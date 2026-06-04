# Study Hub — Socratic tutor (chat)

Text-only Socratic mentor in **Study hub → Tutor** tab. No screen reading or OCR.

## How it works

1. Student types in the chat (optional **Studying** topic, e.g. "Chem 1A").
2. App calls Firebase callable **`socraticStudyChat`** (signed-in users only), or ZotGPT directly in dev.
3. **UCI ZotGPT** (`gpt-4o`) receives the Socratic system prompt plus full conversation history.
4. If the API is unavailable, the app uses a **local fallback** that still asks Socratic-style questions.

## Setup (full AI — recommended)

**Option A — local dev (fastest)**  
Add to `.env.local`:

```
VITE_ZOTGPT_API_KEY=your_zotgpt_api_key
```

Restart `npm run dev`. The app calls ZotGPT directly with **multi-turn** conversation.

**Option B — production**

```bash
firebase functions:secrets:set ZOTGPT_API_KEY
firebase deploy --only functions:socraticStudyChat
```

Get an API key from [ZotGPT](https://azureapi.zotgpt.uci.edu) (UCI).

**Endpoint:** `POST https://azureapi.zotgpt.uci.edu/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01`  
**Header:** `api-key: <your-key>`

## Prompt source of truth

| File | Role |
|------|------|
| `src/app/lib/socraticPrompt.ts` | `SOCRATIC_TUTOR_SYSTEM_PROMPT` + `buildZotGptMessages` |
| `functions/index.js` | Same prompt in `SOCRATIC_SYSTEM` (keep in sync) |

## Related files

| File | Purpose |
|------|---------|
| `src/app/components/SocraticTutorChat.tsx` | Chat UI |
| `src/app/lib/socraticChat.ts` | Client: Cloud Function → ZotGPT → fallback |
| `functions/index.js` | `socraticStudyChat` callable |
