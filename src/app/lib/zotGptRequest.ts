import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { buildZotGptRequestBody, type ChatTurn } from "./socraticPrompt";

export const ZOTGPT_CHAT_URL =
  "https://azureapi.zotgpt.uci.edu/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01";

function getApiKey(): string | null {
  const key = import.meta.env.VITE_ZOTGPT_API_KEY as string | undefined;
  return key?.trim() || null;
}

function parseReply(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const content = (json as { choices?: { message?: { content?: string } }[] }).choices?.[0]
    ?.message?.content;
  return typeof content === "string" && content.trim() ? content.trim() : null;
}

/** POST to ZotGPT; uses native HTTP on Capacitor (Android/iOS) to avoid WebView CORS blocks. */
export async function requestZotGpt(
  topic: string | undefined,
  history: ChatTurn[],
  message: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const body = buildZotGptRequestBody(topic, history, message);
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "api-key": apiKey,
  };

  if (Capacitor.isNativePlatform()) {
    try {
      const response = await CapacitorHttp.post({
        url: ZOTGPT_CHAT_URL,
        headers,
        data: body,
      });
      if (response.status < 200 || response.status >= 300) {
        console.warn("[SocraticTutor] ZotGPT native HTTP error:", response.status, response.data);
        return null;
      }
      const json =
        typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      return parseReply(json);
    } catch (err) {
      console.warn("[SocraticTutor] CapacitorHttp failed:", err);
    }
  }

  try {
    const res = await fetch(ZOTGPT_CHAT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.warn("[SocraticTutor] ZotGPT fetch error:", res.status, text.slice(0, 200));
      return null;
    }
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return null;
    }
    return parseReply(json);
  } catch (err) {
    console.warn("[SocraticTutor] fetch failed:", err);
    return null;
  }
}

export function hasZotGptApiKey(): boolean {
  return !!getApiKey();
}
