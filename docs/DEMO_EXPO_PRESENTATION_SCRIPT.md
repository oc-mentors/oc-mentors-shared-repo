# OC Mentors (Socratic OC) — ICS Project Expo Presentation Script

**Use with:** Login → **Expo Demo** → scroll down for the guide → **Next** through 14 steps  
**Presenter:** One phone · Maya Chen (`demo.expo@ocmentors.edu`) after `npm run seed-demo-expo`  
**Target length:** ~2:30 (tight version ~2:00 at bottom)

---

## Before you speak

- Brightness up, Do Not Disturb on, dev server or hosted build open at `/login`
- Tap **Expo Demo** once; let it sign in as Maya
- On each step: scroll the **page** first so judges see the UI, then scroll to the **guide** for your line
- On **Socratic tutor** step: tap **copy** on the guide, paste in Tutor tab, send

---

## OPENING (15 seconds) — phone down, eye contact

> UCI students live in three places at once: Canvas for deadlines, a tutoring site for people, and ChatGPT for homework. ChatGPT gives you the answer in one shot—it does not teach you how to think, and it does not know you have ADHD, dyslexia, or extra time on exams.
>
> **OC Mentors** is one mobile app: onboarding that captures how you learn, accessibility built into the UI, Canvas deadlines in one list, tutors matched on accommodations—not star ratings—and a Socratic AI that only guides with questions. We built this at the Antrepreneur Center with React, Firebase, and UCI’s ZotGPT. Let me walk you through the product.

*(Pick up phone. Tap **Expo Demo** if you have not already.)*

---

## STEP-BY-STEP (follow the in-app guide)

### Step 1 — Learning style quiz (~12 sec)

**On screen:** Quiz options (order is shuffled each time)

> Every student starts with a short learning-style quiz and an optional Disability Services section—conditions, accommodations, how they like explanations. That profile is structured data in Firestore, not a generic sign-up form. It powers matching and how we personalize the app.

*(Tap one answer if you want motion, or **Next** — Maya already completed this in the demo account.)*

---

### Step 2 — Home (~12 sec)

**On screen:** Greeting, Today’s Plan, Study hub / Community tiles

> This is the command center after onboarding: today’s plan, subjects, and one tap into study tools—instead of five Canvas tabs.

---

### Step 3 — Settings / Learning Comfort (~15 sec)

**On screen:** Scroll to **Learning Comfort** → toggle all three **ON live**

> This is our core differentiator. **Learning Comfort** is a client-side accessibility layer: dyslexia-friendly typography, bionic reading emphasis, and a reduced-distraction layout. It is per user, applied app-wide—not a buried browser setting. Watch the text change when I flip these on.

---

### Step 4 — Home again (~8 sec)

**On screen:** Same home with comfort settings active

> Same screen, different reading experience—what you would actually use during a Chem lecture or late-night study.

---

### Step 5 — Canvas classes (~10 sec)

**On screen:** CHEM, MATH, PHYS, WRIT, BIO list

> Canvas is noisy. We surface UCI-shaped classes in one readable list. Production uses Canvas OAuth; this demo uses our synced catalog so judges see realistic courses without a live LMS login.

---

### Step 6 — Assignments (~10 sec)

**On screen:** Due dates—e.g. Lab Report 3, Problem Set 4

> All due dates in one sorted feed—urgent vs upcoming—pulled from those classes. Same deadlines, less cognitive load.

---

### Step 7 — Find a tutor (~12 sec)

**On screen:** Match banner, tutor cards with badges

> Matching is not “highest rated tutor.” We score tutors against the student’s learning support profile—ADHD, extra time, note-taking—and surface **matched for how you learn** on the card.

---

### Step 8 — Tutor profile (~10 sec)

**On screen:** James Chen — Chem, teaching adjustments

> Here is **James Chen**: chemistry, and explicit teaching adjustments for attention and processing differences. That is Firestore profile data tutors declare at onboarding.

---

### Step 9 — Study hub — Socratic tutor (~18 sec)

**On screen:** Tutor tab → paste & send the demo question

> When Maya studies alone, the **Socratic tutor** uses **UCI ZotGPT—GPT-4o**—with a strict system prompt: guide with questions, refuse to dump the solution. Multi-turn history goes through our Firebase callable function, with a local fallback if the network drops. Same pedagogy as a human tutor—think, don’t cheat.

**Demo question (pre-copied in guide):**  
*“I'm stuck on limiting reagents in Chem 1A — how do I start without just getting the answer?”*

*(Point at the AI reply ending in a question, not a final numeric answer.)*

---

### Step 10 — Study hub — Notes (~8 sec)

**On screen:** Notes tab

> Notes are organized by class so study material stays next to the AI tutor—not in a separate notes app.

---

### Step 11 — Study hub — Flashcards (~8 sec)

**On screen:** Flashcards tab

> Flashcards for quick review before quizzes—same study hub, one navigation model.

---

### Step 12 — Schedule (~10 sec)

**On screen:** Calendar / upcoming Chem session

> Schedule merges tutoring sessions and class events. Maya’s upcoming Chem session with James shows the human loop closing the AI loop.

---

### Step 13 — Messages (~10 sec)

**On screen:** Chat thread with James

> Real-time messaging on Firestore—conversation previews, read state, and connections created when a tutor request is accepted. Human mentors handle what AI should not pretend to do.

---

### Step 14 — Close (~20 sec)

**On screen:** Home · tap **Finish** on guide when done

> In one flow you saw onboarding, accessibility, Canvas aggregation, accommodation-aware matching, ZotGPT-powered Socratic study help, notes, flashcards, schedule, and chat.
>
> **Stack:** React and TypeScript, Vite, Firebase Auth and Firestore, Cloud Functions for chat and tutor workflows, Capacitor for iOS and Android, and ZotGPT for the study tutor. Built for students who learn differently—scan our QR, run Expo Demo, and try Learning Comfort yourself. Happy to go deeper on architecture or matching math.

---

## ~2:00 TIGHT VERSION (if judges cut you off)

| Step | One sentence |
|------|----------------|
| Hook | Three apps today; we unify Canvas, matched tutors, and question-only AI for learners with ADHD/dyslexia. |
| 1 | Profile quiz + DSC data in Firestore drives the whole product. |
| 3 | Learning Comfort changes typography and layout live—our moat. |
| 6 | One assignment feed across classes. |
| 7–8 | Match on accommodations, not stars—meet James. |
| 9 | ZotGPT Socratic tutor—questions, not answers. |
| 13 | Firestore chat with real tutors. |
| Close | React, Firebase, Capacitor, ZotGPT—try the demo on the poster QR. |

---

## Technical phrases (sprinkle 2–3 max)

- **Firebase Auth** — role-based student vs tutor  
- **Firestore** — profiles, connections, messages, tutor requests  
- **Cloud Functions** — atomic tutor accept + Socratic `socraticStudyChat`  
- **ZotGPT (gpt-4o)** — multi-turn Socratic prompting  
- **Capacitor** — native iOS/Android shell around the React web app  
- **Learning Comfort** — dyslexia font, bionic reading, reduce distractions  

---

## Backup lines

| Situation | Say |
|-----------|-----|
| ZotGPT / Wi‑Fi fails | “We ship a local Socratic fallback—same rules, no solution dumping.” |
| Judge: “Why not ChatGPT?” | “ChatGPT optimizes for answers. We optimize for learning outcomes and tutors who know your accommodations.” |
| Judge: “Canvas real?” | “Architecture is OAuth-ready; this booth uses a UCI-shaped mock catalog for a reliable demo.” |
| Running long | Skip Notes + Flashcards; say “same study hub” and jump to Schedule. |

---

## What not to say

- Do not claim full Canvas OAuth is live in the booth mock.  
- Do not say “agentic AI”—say **Socratic AI with multi-turn context**.  
- Do not read the guide verbatim—use it as bullet prompts; judges watch the phone, not the card.

---

*Aligned with `DEMO_EXPO_STEPS` (14 steps) in `src/app/lib/demoExpoConfig.ts`.*
