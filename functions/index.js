/**
 * Socratic OC Cloud Functions.
 * - acceptTutorRequest: atomically update request, create connection + conversation.
 * - onMessageCreated: update conversation lastMessage* when a message is added.
 */

import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();
const db = getFirestore();

/**
 * Callable: acceptTutorRequest(requestId).
 * Caller must be the tutor of the request. Atomically:
 * 1. Update tutorRequests/{requestId} (status: accepted, respondedAt)
 * 2. Create conversations/{convId} with participantUids, participantSummary, lastMessageAt
 * 3. Create connections/{connId} with conversationId, requestId
 * 4. Update conversation with connectionId
 */
export const acceptTutorRequest = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }
    const requestId = request.data?.requestId;
    if (typeof requestId !== "string" || !requestId) {
      throw new HttpsError("invalid-argument", "requestId is required.");
    }

    const uid = request.auth.uid;
    const requestRef = db.collection("tutorRequests").doc(requestId);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      throw new HttpsError("not-found", "Request not found.");
    }
    const reqData = requestSnap.data();
    if (reqData.tutorUid !== uid) {
      throw new HttpsError("permission-denied", "Only the tutor can accept this request.");
    }
    if (reqData.status !== "pending") {
      throw new HttpsError("failed-precondition", "Request already responded to.");
    }

    const studentUid = reqData.studentUid;
    const tutorDisplayName = request.data?.tutorDisplayName ?? "Tutor";
    const tutorPhotoURL = request.data?.tutorPhotoURL ?? null;
    const studentDisplayName = request.data?.studentDisplayName ?? "Student";
    const studentPhotoURL = request.data?.studentPhotoURL ?? null;

    const convRef = db.collection("conversations").doc();
    const conversationId = convRef.id;
    const connRef = db.collection("connections").doc();

    const batch = db.batch();

    batch.set(convRef, {
      type: "direct",
      participantUids: [studentUid, uid],
      participantSummary: {
        [studentUid]: {
          displayName: studentDisplayName,
          photoURL: studentPhotoURL ?? undefined,
          role: "student",
        },
        [uid]: {
          displayName: tutorDisplayName,
          photoURL: tutorPhotoURL ?? undefined,
          role: "tutor",
        },
      },
      connectionId: connRef.id,
      lastMessageText: reqData.initialMessage ?? "",
      lastMessageSenderUid: studentUid,
      lastMessageAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    batch.set(connRef, {
      studentUid,
      tutorUid: uid,
      requestId,
      status: "active",
      conversationId,
      studentDisplayName: studentDisplayName ?? undefined,
      studentPhotoURL: studentPhotoURL ?? undefined,
      createdAt: FieldValue.serverTimestamp(),
      endedAt: null,
    });

    batch.update(requestRef, {
      status: "accepted",
      updatedAt: FieldValue.serverTimestamp(),
      respondedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return { conversationId, connectionId: connRef.id };
  }
);

/**
 * When a message is created in conversations/{convId}/messages/{msgId},
 * update the parent conversation's lastMessageText, lastMessageSenderUid, lastMessageAt, updatedAt.
 */
export const onMessageCreated = onDocumentCreated(
  "conversations/{convId}/messages/{msgId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();
    const convId = event.params.convId;
    const convRef = db.collection("conversations").doc(convId);
    await convRef.update({
      lastMessageText: data.text ?? "",
      lastMessageSenderUid: data.senderUid ?? "",
      lastMessageAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
);

// Keep aligned with src/app/lib/socraticPrompt.ts
const SOCRATIC_SYSTEM = `You are an expert Socratic study mentor for college students (OC Mentors). You help them think—not by handing them answers.

NON-NEGOTIABLE RULES:
1. Never give the final answer, full solution, or a list of steps they can copy verbatim.
2. You MAY explain a concept briefly (1–2 sentences) when they are genuinely confused—but always end with a question that makes them apply the idea.
3. Read the full conversation. Never repeat the same question, opening line, or advice you already gave. Each reply must move the dialogue forward.
4. Reference something specific the student just said (their words, their attempt, or their mistake).
5. Vary your approach: clarify goals → probe reasoning → test with a scenario → ask them to predict → narrow the problem.
6. If they ask "just tell me the answer," acknowledge the frustration, then offer one smaller hint plus one focused question.
7. When they are correct, affirm briefly (one sentence), then ask a deeper follow-up.
8. Tone: warm, patient, clear. 2–6 sentences unless they need a short concept explanation.
9. Any subject: math, science, writing, history, languages, etc.

CONVERSATION MEMORY:
- Track what they have already tried and what you already asked.
- If they repeat a question, say what changed since last time and ask a different angle.
- If they give a partial answer, build on the correct part before questioning the weak part.

SOCRATIC MOVES (rotate; do not reuse the same move twice in a row):
- "What is this problem asking you to find, in your own words?"
- "What would have to be true for your idea to work?"
- "What evidence supports that, and what would disprove it?"
- "Can you think of a simpler case or example first?"
- "What's the next smallest step you could try—not the whole solution?"`;

const ZOTGPT_CHAT_URL =
  "https://azureapi.zotgpt.uci.edu/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01";

/** Multi-turn OpenAI-style messages for ZotGPT (gpt-4o). */
function buildZotGptMessages(topic, history, latestUserMessage) {
  const messages = [{ role: "system", content: SOCRATIC_SYSTEM }];
  const topicNote = topic ? `[Study focus for this session: ${topic}]\n\n` : "";
  const trimmedHistory = history
    .filter((h) => h && typeof h.content === "string" && h.content.trim())
    .slice(-16);

  if (trimmedHistory.length === 0) {
    messages.push({ role: "user", content: topicNote + latestUserMessage });
    return messages;
  }

  let first = true;
  for (const turn of trimmedHistory) {
    const role = turn.role === "assistant" ? "assistant" : "user";
    const text = turn.content.trim();
    if (first && role === "user" && topicNote) {
      messages.push({ role: "user", content: topicNote + text });
      first = false;
    } else {
      messages.push({ role, content: text });
    }
  }

  const last = trimmedHistory[trimmedHistory.length - 1];
  if (last?.role === "user" && last.content.trim() === latestUserMessage.trim()) {
    return messages;
  }
  messages.push({ role: "user", content: latestUserMessage });
  return messages;
}

/**
 * Callable: socraticStudyChat — Study Hub Socratic tutor (text only, no OCR).
 * Set ZOTGPT_API_KEY in Firebase Functions secrets.
 */
export const socraticStudyChat = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }
    const message = typeof request.data?.message === "string" ? request.data.message.trim() : "";
    if (!message) {
      throw new HttpsError("invalid-argument", "message is required.");
    }
    const topic = typeof request.data?.topic === "string" ? request.data.topic.trim() : "";
    const history = Array.isArray(request.data?.history) ? request.data.history : [];

    const apiKey = process.env.ZOTGPT_API_KEY;
    if (!apiKey) {
      throw new HttpsError(
        "failed-precondition",
        "ZOTGPT_API_KEY is not configured on Cloud Functions."
      );
    }

    const body = {
      temperature: 1,
      top_p: 1,
      stream: false,
      stop: null,
      max_completion_tokens: 1024,
      messages: buildZotGptMessages(topic, history, message),
    };

    const res = await fetch(ZOTGPT_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[socraticStudyChat] ZotGPT error:", res.status, errText);
      throw new HttpsError("internal", "AI mentor unavailable. Try again later.");
    }

    const json = await res.json();
    const reply = json?.choices?.[0]?.message?.content ?? "";

    if (!reply.trim()) {
      throw new HttpsError("internal", "Empty response from AI mentor.");
    }

    return { reply: reply.trim() };
  }
);
