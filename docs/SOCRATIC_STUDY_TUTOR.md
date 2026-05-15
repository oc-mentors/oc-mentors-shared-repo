# Study Hub — Socratic tutor (chat)

Text-only Socratic mentor in **Study hub → Tutor** tab. No screen reading or OCR.

## How it works

1. Student types in the chat (optional **Studying** topic, e.g. "Chem 1A").
2. App calls Firebase callable **`socraticStudyChat`** (signed-in users only).
3. Function calls **Gemini 1.5 Flash** with a Socratic system prompt (questions, not answers).
4. If the function is unavailable, the app uses a **local fallback** that still asks Socratic-style questions.

## Setup (full AI — recommended)

**Option A — local dev (fastest)**  
Add to `.env.local`:

```
VITE_GEMINI_API_KEY=your_key_from_aistudio
```

Restart `npm run dev`. The app calls Gemini directly with **multi-turn** conversation (no repeated generic lines).

**Option B — production**

```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase deploy --only functions:socraticStudyChat
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

## Files

| File | Role |
|------|------|
| `src/app/components/SocraticTutorChat.tsx` | Chat UI |
| `src/app/lib/socraticChat.ts` | Client + fallback |
| `src/app/lib/socraticPrompt.ts` | System prompt text |
| `functions/index.js` | `socraticStudyChat` callable |

## Adapted from CalHacks

Inspired by CalHacks Socratic / conversational flow, but **without** OCR, screen capture, or desktop hooks—only chat.
