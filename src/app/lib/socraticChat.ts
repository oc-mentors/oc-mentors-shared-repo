import { httpsCallable } from "firebase/functions";
import { functions, isFirebaseConfigured } from "./firebase";
import {
  SOCRATIC_TUTOR_SYSTEM_PROMPT,
  buildGeminiRequestBody,
  type ChatTurn,
} from "./socraticPrompt";

export type SocraticChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const GEMINI_MODEL = "gemini-1.5-flash";

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isTooSimilarToPrior(reply: string, priorAssistant: string[]): boolean {
  const n = normalizeForCompare(reply);
  if (n.length < 20) return false;
  for (const p of priorAssistant.slice(-3)) {
    const pn = normalizeForCompare(p);
    if (!pn) continue;
    if (n === pn) return true;
    if (n.length > 40 && pn.includes(n.slice(0, 40))) return true;
    if (pn.length > 40 && n.includes(pn.slice(0, 40))) return true;
  }
  return false;
}

function pickNonRepeating(candidates: string[], priorAssistant: string[]): string {
  for (const c of candidates) {
    if (!isTooSimilarToPrior(c, priorAssistant)) return c;
  }
  return candidates[candidates.length % candidates.length] ?? candidates[0] ?? "What's your next step?";
}

/** Smarter offline mentor when Cloud Function / API key unavailable. Uses full history. */
function localSocraticFallback(
  userMessage: string,
  topic: string | undefined,
  history: ChatTurn[]
): string {
  const m = userMessage.toLowerCase().trim();
  const focus = topic?.trim() ? ` for ${topic.trim()}` : "";
  const priorAssistant = history.filter((h) => h.role === "assistant").map((h) => h.content);
  const priorUser = history.filter((h) => h.role === "user").map((h) => h.content);
  const turn = priorAssistant.length;
  const quote =
    userMessage.length > 15
      ? `"${userMessage.slice(0, 90)}${userMessage.length > 90 ? "…" : ""}"`
      : "that";

  const candidates: string[] = [];

  if (/\b(answer|solution|just tell|give me the|what is the answer)\b/.test(m)) {
    candidates.push(
      `I hear you want the answer${focus}—but you'll remember it better if you build it. Looking at ${quote}, what's one concrete step you could try in the next two minutes, even if you're unsure?`,
      `If I gave you the full solution, we'd have to restart next problem anyway. What have you already ruled out, and what's still on the table?`,
      `Let's shrink the problem: what's the very first thing you need to figure out before the final answer makes sense?`
    );
  } else if (/\b(stuck|don't understand|confused|no idea|lost)\b/.test(m)) {
    candidates.push(
      `Being stuck${focus} is normal. For ${quote}—can you restate the question in your own words, and list what you're given vs. what you need to find?`,
      `Let's step back one level: what topic is this under, and what's one thing you *do* understand about it so far?`,
      `Instead of the whole problem at once—what's the smallest piece you could try first?`
    );
  } else if (/\b(why|how come|how does)\b/.test(m)) {
    candidates.push(
      `Good "why" question. Before I explain—if your current idea were true, what would you expect to see? How could you check that?`,
      `When you say that about ${quote}, what assumption are you making? What happens if that assumption is wrong?`,
      `Can you connect this to something you learned earlier${focus}? What rule or definition might apply here?`
    );
  } else if (/\b(is this right|correct|check my|did i get|am i right)\b/.test(m)) {
    candidates.push(
      `Walk me through your reasoning for ${quote} step by step—where did you start, and why?`,
      `What part of your work are you most confident about, and which part feels shaky?`,
      `If a classmate read only your answer, what question would they ask you to justify it?`
    );
  } else if (/\b(thanks|thank you|got it|makes sense|i see)\b/.test(m)) {
    candidates.push(
      `Glad that's clicking. What's a slightly harder version of the same idea you could try next?`,
      `Nice—can you explain it back in one sentence, then tackle one practice question without looking at notes?`,
      `What would you do if the numbers or wording changed a little—would your approach still work?`
    );
  } else if (m.length < 14) {
    candidates.push(
      `Tell me more${focus}—what class, assignment, or problem are you on? Paste the prompt or describe the setup.`,
      `What have you tried so far, even briefly? That helps me ask a better question.`
    );
  } else {
    const prevTopic = priorUser[priorUser.length - 2] ?? "";
    if (turn >= 2 && prevTopic) {
      candidates.push(
        `You moved from "${prevTopic.slice(0, 50)}…" to ${quote}. What's the link between those two ideas in your mind?`,
        `Building on what we discussed—what's still unclear about ${quote}?`,
        `You said ${quote}. What's your best guess so far, and what would convince you it's wrong?`
      );
    } else {
      candidates.push(
        `On ${quote}${focus}: what's your current approach, and where does it stop working?`,
        `What would a correct answer need to include—units, definitions, or conditions? Does yours meet that?`,
        `Try a simpler version first: can you solve a smaller example of the same type?`,
        `What's one fact from your notes or lecture that might apply to ${quote}?`
      );
    }
  }

  const idx = turn % Math.max(candidates.length, 1);
  const ordered = [...candidates.slice(idx), ...candidates.slice(0, idx)];
  return pickNonRepeating(ordered, priorAssistant);
}

async function callGeminiDirect(params: {
  message: string;
  topic?: string;
  history: ChatTurn[];
}): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey?.trim()) return null;

  const body = buildGeminiRequestBody(params.topic, params.history, params.message);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn("[SocraticTutor] Direct Gemini error:", res.status, await res.text());
    return null;
  }

  const json = await res.json();
  const reply =
    json?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text)
      .filter(Boolean)
      .join("") ?? "";

  return reply.trim() || null;
}

/**
 * Send a message to the Socratic tutor.
 * Order: Cloud Function → direct Gemini (VITE_GEMINI_API_KEY) → local fallback.
 */
export async function sendSocraticTutorMessage(params: {
  message: string;
  topic?: string;
  history: SocraticChatMessage[];
}): Promise<{ reply: string; usedCloud: boolean }> {
  const { message, topic, history } = params;
  const trimmed = message.trim();
  if (!trimmed) {
    return { reply: "What would you like to explore?", usedCloud: false };
  }

  const prior: ChatTurn[] = history
    .filter((h) => h.role === "user" || h.role === "assistant")
    .map((h) => ({ role: h.role, content: h.content }));

  if (isFirebaseConfigured && functions) {
    try {
      const call = httpsCallable<
        {
          message: string;
          topic?: string;
          history: ChatTurn[];
        },
        { reply: string }
      >(functions, "socraticStudyChat");

      const res = await call({
        message: trimmed,
        topic: topic?.trim() || undefined,
        history: prior,
      });
      const reply = res.data?.reply?.trim();
      if (reply) {
        return { reply, usedCloud: true };
      }
    } catch (e) {
      console.warn("[SocraticTutor] Cloud function unavailable:", e);
    }
  }

  const direct = await callGeminiDirect({
    message: trimmed,
    topic: topic?.trim() || undefined,
    history: prior,
  });
  if (direct) {
    return { reply: direct, usedCloud: true };
  }

  return {
    reply: localSocraticFallback(trimmed, topic, prior),
    usedCloud: false,
  };
}

export { SOCRATIC_TUTOR_SYSTEM_PROMPT };
