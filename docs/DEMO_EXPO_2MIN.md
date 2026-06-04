# OC Mentors — 2-Minute Killer Demo (Expo / Pitch)

**Story in one line:** A UCI student who learns differently gets a readable app, Canvas in one place, a matched human mentor, and a Socratic AI that teaches thinking—not answers.

**Audience:** ICS Expo judges, industry, Antrepreneur mentors  
**Duration:** 2:00 (stretch to 2:30 if they ask questions mid-flow)  
**Devices:** 1 phone (student) required · 2nd phone/laptop (tutor) optional but recommended

---

## Before you present (30 min setup)

### 1. Environment
- [ ] Deploy or run on phone: `npm run dev` + tunnel **or** Firebase Hosting URL
- [ ] Phone on Do Not Disturb · brightness 80%+ · logged out at `/login`
- [ ] Second device logged in as tutor (optional): `debra.peterson@ocmentors.edu` / `password`

### 2. Seed data
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
npm run reset-and-seed   # or seed-users + seed-tutors + seed-tutor-profiles
```

### 3. One-time Firebase seed (required)
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
npm run seed-demo-expo
```

### 4. In-app Expo Demo (easiest)
On the **login screen**, tap **Expo Demo** (purple button). This:
- Signs in as **Maya Chen** (`demo.expo@ocmentors.edu` / `password`)
- Sets up profile, Canvas mock data, schedule, and matching (Learning Comfort toggles stay off until you enable them on step 2)
- Opens a **guided bottom panel** — tap **Next** / **Show screen** through 10 steps

No manual quiz or settings setup needed after seeding.

### 4. Pre-stage for speed
- [ ] Student account logged in once, then **log out** so login animation plays (looks polished)
- [ ] Canvas **not** connected yet (you’ll connect live)
- [ ] No pending tutor request to Debra/Jordan demo tutor (or tutor device ready to Accept)
- [ ] Gemini: `GEMINI_API_KEY` set on Cloud Functions **or** `VITE_GEMINI_API_KEY` in `.env.local` so Socratic tab works live

### 5. QR on poster
Same URL judges will use · test the full path once end-to-end.

---

## Feature coverage map (everything in 120 seconds)

| Time | Beat | Features shown | Tech you mention |
|------|------|----------------|------------------|
| 0:00–0:20 | Hook + Login | Auth, roles, onboarding | Firebase Auth, React/TS |
| 0:20–0:40 | Accessibility | Learning Comfort, Bionic text | Client a11y layer + profile-driven UX |
| 0:40–0:55 | Canvas hub | Courses, assignments, due dates | LMS integration path (OAuth-ready architecture) |
| 0:55–1:15 | Smart matching | Tutors list, match badges, request | Scoring algorithm on accommodations |
| 1:15–1:35 | Socratic AI | Study Hub → AI tutor tab | Gemini + Cloud Functions, multi-turn |
| 1:35–1:50 | Human loop | Request accept → Chat | Firestore + atomic Cloud Function |
| 1:50–2:00 | Close | Schedule, win, stack | Capacitor mobile, Beall 3rd |

*Community, Progress, Well-being, Theme:* point at Home tiles or say “also built” in closing if time.

---

## THE SCRIPT — word-for-word (≈2:00)

### [0:00–0:12] HOOK — no phone yet, eye contact

> **“Quick question: where do UCI students juggle Canvas, tutoring, and ChatGPT? Three apps—and ChatGPT gives you the answer, not the understanding.**
>
> **We built OC Mentors: one mobile platform for students who learn differently—ADHD, dyslexia, reading challenges—with human mentors and an AI that only asks questions. We placed third at Beall & Butterworth for $3,500. Let me show you sixty seconds of product.”**

*(Pick up phone.)*

---

### [0:12–0:25] LOGIN + HOME

**Taps:** Open app → **Login** → Student → `jessica.park.student@ocmentors.edu` / `password` → wait for login animation → **Home**

**Say:**

> **“Student logs in with Firebase Auth—role-based access for students and tutors. Onboarding captured her learning style and disability services profile. Home is her command center: today’s plan, study hub, and schedule—not ten tabs in Canvas.”**

**Point at:** Greeting with **Bionic reading** (bold syllables) if Reading assist is on · **Study hub** · **Start Today’s Learning Plan**

---

### [0:25–0:40] ACCESSIBILITY — your differentiator

**Taps:** **Settings** → scroll to **Learning Comfort** → toggle all three **ON live** (they start OFF) → **Next** → **Home** to show the difference

**Say:**

> **“This is what sets us apart from every other tutoring app in the expo. One tap: OpenDyslexic-style typography, bionic reading aids, and an ADHD-friendly simplified layout—stored per user, applied app-wide. We’re not bolting accessibility onto the side; the interface adapts to how your brain reads.”**

**Point at:** Text changing on Home · wider layout / fewer clutter items if reduce distractions on.

---

### [0:40–0:55] CANVAS HUB

**Taps:** Bottom nav **Canvas** → **Connect Canvas** → any email/password → wait for success → **Canvas classes** → tap a course → **Assignments** (or show due dates on list)

**Say:**

> **“Canvas is overwhelming. We pull courses and assignments into one readable feed—same deadlines, less noise. Production path is Canvas OAuth; this demo syncs our UCI-shaped catalog so students see Chem, Math, and Writing due dates without living in three LMS tabs.”**

**Point at:** Due dates · course colors · notification settings if you have 3 extra seconds.

---

### [0:55–1:15] MENTOR MATCHING

**Taps:** Bottom nav **Tutors** → point at **“Matched for how you learn”** banner → toggle **Show matches only** (if visible) → open **Jordan Lee** or top card with **Match · ADHD** badge → scroll bio / teaching adjustments → tap **Request tutor** (or **Message** if connection exists)

**Say:**

> **“Matching isn’t star ratings—it’s a scoring layer. We map her DSC accommodations—ADHD, extra time, written summaries—to tutors who declare supported learning differences and teaching adjustments. That’s structured data in Firestore, not a generic recommendation feed.”**

**If requesting live:**  
> **“She sends a tutor request—status tracked in Firestore.”**

**On tutor device (if available):** Tutor home → **Requests** → **Accept** — then say:

> **“Our Cloud Function atomically accepts the request, creates the connection, and spins up the conversation—one transactional write, no orphaned chats.”**

---

### [1:15–1:35] SOCRATIC AI (Study Hub)

**Taps:** **Home** → **Study hub** → tab **Tutor** (sparkle icon) → type: *“I'm stuck on limiting reagents in Chem 1A—how do I start?”* → Send → read AI reply (questions, not answer)

**Say:**

> **“When she’s studying alone, Gemini powers a Socratic mentor through Firebase Cloud Functions—multi-turn history, system prompts that refuse to dump solutions. Same philosophy as a human tutor: guide, don’t cheat. Offline fallback keeps the demo alive if Wi‑Fi blips.”**

**Point at:** Assistant reply ending with a **question** · optional “cloud” indicator if shown.

---

### [1:35–1:50] HUMAN MENTOR + MESSAGING

**Taps:** Bottom nav **Chat** → open conversation with tutor → show last message / send “Thanks, can we go over problem 4?”

**Say:**

> **“Human mentors close the loop—real-time messaging on Firestore with triggers that update conversation previews. Schedule holds sessions; after a session she rates the tutor and we aggregate reviews back to the profile.”**

**Optional 5 sec:** Bottom nav **Schedule** → upcoming session · **Join** if shown.

---

### [1:50–2:00] CLOSE — technical stack + proof

**Taps:** Stay on **Home** or show phone home screen with app icon (Capacitor/PWA)

**Say:**

> **“Stack: React and TypeScript, Firebase Auth and Firestore, serverless functions for AI and matching workflows, Capacitor for iOS and Android. Built at UCI Antrepreneur Center—third place, Beall & Butterworth. Scan the QR: turn on Learning Comfort and try the Socratic tutor yourself. Happy to dive into architecture or accessibility scoring.”**

---

## Fast tap cheat sheet (no narration)

```
Login (student) → Home
Settings → Learning Comfort (3 toggles ON) → Home
Canvas → Connect → Classes → Assignments
Tutors → Match card → Request (or Message)
Home → Study hub → Tutor tab → ask Chem question
Chat → conversation
Schedule (optional)
```

---

## If you have 2 devices (recommended)

| Device | Account | Action during demo |
|--------|---------|-------------------|
| Phone A | `jessica.park.student@ocmentors.edu` | Main script |
| Phone B | `debra.peterson@ocmentors.edu` | After Request → **Tutor Requests** → **Accept** while you say Cloud Function line |

Pre-create connection? Only if live accept makes you nervous—live accept is more impressive.

---

## Backup lines (when things break)

| Problem | Say |
|---------|-----|
| Gemini fails | “We have a local Socratic fallback—same pedagogy, edge-deployed for resilience.” |
| Canvas slow | “Connection is device-local; production uses OAuth token refresh.” |
| No match badges | “This account needs DSC quiz—matching scores learning support profiles.” |
| Wi‑Fi dead | “I have a 90-second screen recording—key flow is accessibility → match → Socratic AI.” |
| Judge asks “vs ChatGPT?” | “ChatGPT optimizes for answers. We optimize for learning outcomes and accommodation-aware human support.” |

---

## Poster / booth one-liner

**Headline:** *Tutoring for brains that learn differently.*

**Sub:** Canvas + matched mentors + Socratic AI · Beall & Butterworth 3rd · UCI Antrepreneur Center

**QR label:** *Try Learning Comfort + AI tutor*

---

## Optional 15-second encore (if judge stays)

**Taps:** Home → **Community** OR Settings → **Theme**

> **“Peer community for study accountability, per-course notification prefs, and full theme customization—same Firebase backend, one product surface.”**

---

## What NOT to say

- Don’t claim full Canvas OAuth if you’re on mock connect.
- Don’t say “automated notification pipelines” unless push/email is live.
- Don’t say “agentic AI”—say **Socratic AI with multi-turn context**.
- Don’t list fifteen features—let the workflow imply breadth.

---

*Last updated for Socratic OC / OC Mentors codebase — Expo 2026.*
