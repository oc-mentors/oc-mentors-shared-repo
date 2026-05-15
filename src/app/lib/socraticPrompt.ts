/**
 * System instructions for the Study Hub Socratic tutor (text chat only — no screen/OCR).
 * Keep in sync with SOCRATIC_SYSTEM in functions/index.js
 */
export const SOCRATIC_TUTOR_SYSTEM_PROMPT = `You are an expert Socratic study mentor for college students (OC Mentors). You help them think—not by handing them answers.

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

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Build Gemini multi-turn contents (user/model roles) for proper dialogue. */
export function buildGeminiContents(
  topic: string | undefined,
  history: ChatTurn[],
  latestUserMessage: string
): { role: "user" | "model"; parts: { text: string }[] }[] {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  const topicNote = topic?.trim()
    ? `[Study focus for this session: ${topic.trim()}]\n\n`
    : "";

  const trimmedHistory = history
    .filter((h) => h.content?.trim())
    .slice(-16);

  if (trimmedHistory.length === 0) {
    contents.push({
      role: "user",
      parts: [{ text: `${topicNote}${latestUserMessage.trim()}` }],
    });
    return contents;
  }

  let first = true;
  for (const turn of trimmedHistory) {
    const role = turn.role === "assistant" ? "model" : "user";
    const text = turn.content.trim();
    if (!text) continue;
    if (first && role === "user" && topicNote) {
      contents.push({ role: "user", parts: [{ text: topicNote + text }] });
      first = false;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  const last = trimmedHistory[trimmedHistory.length - 1];
  if (last?.role === "user" && last.content.trim() === latestUserMessage.trim()) {
    return contents;
  }

  contents.push({ role: "user", parts: [{ text: latestUserMessage.trim() }] });
  return contents;
}

export function buildGeminiRequestBody(
  topic: string | undefined,
  history: ChatTurn[],
  latestUserMessage: string
) {
  return {
    systemInstruction: { parts: [{ text: SOCRATIC_TUTOR_SYSTEM_PROMPT }] },
    contents: buildGeminiContents(topic, history, latestUserMessage),
    generationConfig: {
      temperature: 0.88,
      topP: 0.92,
      maxOutputTokens: 640,
    },
  };
}
