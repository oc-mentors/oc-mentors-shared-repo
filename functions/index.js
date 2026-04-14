/**
 * OC Mentors Cloud Functions.
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
