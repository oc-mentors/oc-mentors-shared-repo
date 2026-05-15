# Tutor matching (learning differences & accommodations)

How OC Mentors connects **student learning support** (from the quiz) to **tutor profiles** (from tutor onboarding).

## Honest status

| Piece | Status |
|-------|--------|
| Student quiz saves `learningSupport` on `users/{uid}` | ✅ Implemented |
| Tutor quiz saves `supportedLearningDifferences`, `teachingAdjustments` on `tutorProfiles/{uid}` | ✅ Implemented |
| Tutors page: sort, badges, filters, summary banner | ✅ Implemented (`src/app/lib/tutorMatching.ts`, `TutorsPage.tsx`) |
| Sample mentors for pitch when Firestore tutors lack accessibility fields | ✅ `src/app/data/demoMatchTutors.ts` (labeled “Sample match”) |
| Mentor brief before session | ❌ Not yet |
| Cloud Function for server-side match | ❌ Optional; matching runs in the app today |

## Data model (Firestore)

### Student — `users/{studentUid}`

```json
{
  "learningSupport": {
    "dscSupportLevel": "yes",
    "conditions": ["ADHD / Attention challenges", "Anxiety related to exams or learning"],
    "accommodations": ["Extra time on exams or assignments", "Providing written summaries"],
    "learningPreferences": ["Visual diagrams", "Step-by-step explanations"],
    "tutoringPreferences": ["Patient pacing", "Checking understanding often"],
    "learningChallenges": []
  }
}
```

### Tutor — `tutorProfiles/{tutorUid}`

```json
{
  "supportedLearningDifferences": [
    "ADHD / Attention challenges",
    "Executive functioning challenges"
  ],
  "teachingAdjustments": [
    "Breaking problems into smaller steps",
    "Providing written summaries",
    "Flexible pacing during sessions"
  ],
  "accessibilityExperience": "Yes — I have experience supporting these students"
}
```

## Matching algorithm (client-side)

Implemented in `src/app/lib/tutorMatching.ts`.

1. **Condition overlap** — For each student `conditions[]` item, check if the tutor’s `supportedLearningDifferences[]` contains the same label (with aliases, e.g. “Executive functioning or organization challenges” ↔ “Executive functioning challenges”).
2. **Accommodation overlap** — Map each student accommodation to tutor `teachingAdjustments[]` (e.g. “Extra time on exams” → “Flexible pacing during sessions”).
3. **Score** — `totalScore = conditionMatches × 2 + accommodationMatches`.
4. **Sort** — Tutors list sorted by `totalScore` descending (then name).
5. **Filters** — “My learning profile” = only tutors with `totalScore > 0`; “Uses my accommodations” = `accommodationScore > 0`.

## Three sample mentors (demo / pitch)

These appear in the app under **“How matching works (sample mentors)”** when the student has completed the learning-support section of the quiz. They are **not** real Firebase users.

| Mentor | Supports | Good for student who needs |
|--------|----------|----------------------------|
| **Jordan Lee** | ADHD, executive function, exam anxiety | Extra time, step-by-step, written recap |
| **Priya Nair** | Dyslexia, processing speed | Visual/diagram explanations, written summaries |
| **Marcus Ortiz** | Dyscalculia, exam anxiety | Micro-steps in math, extra thinking time |

## Demo script for judges

1. Log in as a **student** who completed the quiz with **ADHD** + **extra time**.
2. Open **Tutors** → see banner: *“3 mentors trained for ADHD · extended time”* (count depends on real + sample data).
3. Toggle **Uses my accommodations** → list narrows to mentors whose teaching adjustments map to your accommodations.
4. Point to **Match · ADHD · Extra time** badges on cards.
5. Show **sample mentors** section: *“This is how the backend scores overlap—we use the same logic on real `tutorProfiles`.”*

## Seeding real tutors with accessibility fields

When running `node scripts/seed-tutor-profiles.js`, add to each tutor object:

```js
supportedLearningDifferences: ["ADHD / Attention challenges"],
teachingAdjustments: ["Breaking problems into smaller steps", "Providing written summaries"],
accessibilityExperience: "Yes — I have experience supporting these students",
```

Then re-run the seed script so live tutors match like the samples.
