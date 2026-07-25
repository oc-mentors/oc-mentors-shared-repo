import type { LearningStyle, LearningSupport } from "../contexts/AuthContext";

export const DEMO_STORAGE_KEY = "oc_expo_demo_active";
export const DEMO_NOTES_TAB_KEY = "oc_expo_demo_notes_tab";
export const DEMO_PASSWORD = "password";

/** Primary expo demo student — run `npm run seed-demo-expo` once per Firebase project. */
export const DEMO_STUDENT_EMAIL = "demo.expo@ocmentors.edu";
export const DEMO_TUTOR_EMAIL = "james.chen@ocmentors.edu";

export const DEMO_STUDENT_PROFILE = {
  firstName: "Maya",
  lastName: "Chen",
  name: "Maya Chen",
  university: "University of California, Irvine",
  year: "Sophomore",
  major: ["Chemistry", "Education Sciences"],
  learningStyle: "Visual" as LearningStyle,
  learningStyleQuestionAnswers: [
    { question: "When learning something new, I prefer to:", answer: "See diagrams, charts, or videos" },
    { question: "In a lecture, I learn best when the professor:", answer: "Uses slides and visual aids" },
    { question: "When studying for a test, I usually:", answer: "Rewrite notes and use color coding" },
    { question: "I understand a concept best when I:", answer: "Draw it out or watch a demonstration" },
  ],
  learningSupport: {
    dscSupportLevel: "yes",
    conditions: ["ADHD / Attention challenges", "Processing speed differences"],
    accommodations: [
      "Extra time on exams or assignments",
      "Note-taking support",
      "Breaks during exams or study sessions",
    ],
    learningPreferences: ["Shorter study sessions", "Written summaries after sessions"],
    tutoringPreferences: ["Patient pacing", "Step-by-step explanations"],
    learningChallenges: ["Staying focused during long readings", "Starting large assignments"],
  } satisfies LearningSupport,
};

export const DEMO_SOCRATIC_MESSAGE =
  "I'm stuck on limiting reagents in Chem 1A — how do I start without just getting the answer?";

export type DemoExpoStep = {
  id: string;
  path: string;
  title: string;
  /** Short line shown under the title */
  pitch: string;
  /** What to do on this screen */
  hint?: string;
};

export const DEMO_EXPO_STEPS: DemoExpoStep[] = [
  {
    id: "learning-quiz",
    path: "/learning-quiz?retake=true",
    title: "Learning style quiz",
    pitch:
      "Every new student starts here. A few questions figure out how they learn best and what kind of support helps.",
    hint: "Tap one answer to show the quiz, or use Back — Maya already finished this in the demo account.",
  },
  {
    id: "home",
    path: "/home",
    title: "Home",
    pitch: "After onboarding, this is home — today's plan, subjects, and links to study tools.",
    hint: "Point at Today's Plan and the Study hub / Community tiles.",
  },
  {
    id: "settings",
    path: "/settings",
    title: "Settings",
    pitch: "Scroll to Learning Comfort. Turn on each switch so people can see the screen change.",
    hint: "Toggle dyslexia-friendly font, reading assist, and reduce distractions — all three.",
  },
  {
    id: "home-after-comfort",
    path: "/home",
    title: "Home again",
    pitch: "Same page, but text should be easier to read now.",
    hint: "Call out the greeting and Today's Plan line.",
  },
  {
    id: "canvas",
    path: "/zot-planner",
    title: "Course planner",
    pitch: "Her UCI classes and schedule live here in Zot Zot! instead of digging through Canvas.",
    hint: "Browse a term or open My Plan.",
  },
  {
    id: "assignments",
    path: "/assignments",
    title: "Assignments",
    pitch: "Due dates from those classes, sorted in one list.",
    hint: "Point at what's due soon — like the Chem lab report.",
  },
  {
    id: "tutors",
    path: "/tutors",
    title: "Find a tutor",
    pitch: "Tutors are ranked by how well they fit Maya's learning needs, not just stars.",
    hint: "Look for the match banner and badges on tutor cards.",
  },
  {
    id: "tutor",
    path: "/tutor/__TUTOR_UID__",
    title: "Tutor profile",
    pitch: "James teaches Chem and lists how he adapts for ADHD and similar needs.",
    hint: "Scroll the bio and match tags, then tap Next.",
  },
  {
    id: "study-tutor",
    path: "/notes",
    title: "Study hub — Socratic tutor",
    pitch: "The Tutor tab is an AI study buddy. It asks questions instead of giving the final answer.",
    hint: "Tap Tutor, paste the copied question below, and send.",
  },
  {
    id: "study-notes",
    path: "/notes",
    title: "Study hub — Notes",
    pitch: "Students can save notes by class here.",
    hint: "Tap the Notes tab. Add a quick note if you want to show it live.",
  },
  {
    id: "study-flashcards",
    path: "/notes",
    title: "Study hub — Flashcards",
    pitch: "Flashcards for quick review before a quiz or exam.",
    hint: "Tap Cards. Flip a card or start a short quiz.",
  },
  {
    id: "schedule",
    path: "/schedule",
    title: "Schedule",
    pitch: "Upcoming tutoring sessions and class events in one calendar.",
    hint: "Show the Chem session with James if it's on the list.",
  },
  {
    id: "chat",
    path: "/chat/__CONVERSATION_ID__",
    title: "Messages",
    pitch: "Maya can message her tutor here after they're connected.",
    hint: "Open the thread with James and show the last few messages.",
  },
  {
    id: "done",
    path: "/home",
    title: "That's the tour",
    pitch: "You just walked through onboarding, accessibility, course planning, matching, study tools, schedule, and chat.",
    hint: "Tap Finish to leave demo mode.",
  },
];

export function resolveDemoPath(
  path: string,
  ids: { tutorUid: string | null; conversationId: string | null }
): string {
  return path
    .replace("__TUTOR_UID__", ids.tutorUid ?? "")
    .replace("__CONVERSATION_ID__", ids.conversationId ?? "");
}
