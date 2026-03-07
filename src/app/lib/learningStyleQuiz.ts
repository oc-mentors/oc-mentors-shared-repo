/**
 * Shared learning style quiz content for the quiz page and profile Q&A view.
 */
export interface QuizQuestionItem {
  id: number;
  question: string;
  options: string[];
}

export const LEARNING_STYLE_QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    question: "When learning something new, I prefer to:",
    options: [
      "Watch a video or diagram",
      "Listen to someone explain it",
      "Read about it in a textbook or article",
      "Do hands-on practice",
    ],
  },
  {
    id: 2,
    question: "I remember information best when I:",
    options: [
      "See pictures and charts",
      "Hear it spoken aloud",
      "Write notes about it",
      "Practice or experience it",
    ],
  },
  {
    id: 3,
    question: "When studying, I prefer to:",
    options: [
      "Look at diagrams and visual aids",
      "Discuss topics with others",
      "Read textbooks and articles",
      "Work on practice problems",
    ],
  },
  {
    id: 4,
    question: "I understand concepts better through:",
    options: [
      "Visual demonstrations",
      "Verbal explanations",
      "Written instructions",
      "Hands-on activities",
    ],
  },
];

/** Get the selected option text for a question (0-based question index, 0-based option index). */
export function getQuizAnswerText(questionIndex: number, optionIndex: number): string {
  const q = LEARNING_STYLE_QUIZ_QUESTIONS[questionIndex];
  if (!q || optionIndex < 0 || optionIndex >= q.options.length) return "";
  return q.options[optionIndex];
}
