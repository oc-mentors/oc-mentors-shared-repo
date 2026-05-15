import type { Tutor } from "../contexts/TutorsContext";

/**
 * Sample mentors for pitch / demo when Firestore tutors lack accessibility fields.
 * Shown in a labeled section on Tutors — not mixed in as real users.
 */
export const DEMO_MATCH_TUTORS: Tutor[] = [
  {
    id: "demo-match-jordan",
    name: "Jordan Lee",
    avatar: "",
    university: "UC Irvine",
    major: "Psychology & Education",
    subjects: ["Chem", "Writing"],
    learningStyle: "Visual + step-by-step",
    rating: 4.9,
    reviewCount: 41,
    priceLevel: "$$",
    pricePerHour: 32,
    bio: "I support students with ADHD using shorter bursts, check-ins, and written recaps after each session.",
    supportedLearningDifferences: [
      "ADHD / Attention challenges",
      "Executive functioning challenges",
      "Anxiety related to exams or learning",
    ],
    teachingAdjustments: [
      "Breaking problems into smaller steps",
      "Providing written summaries",
      "Flexible pacing during sessions",
      "Allowing extra thinking time before answers",
    ],
    accessibilityExperience: "Yes — I have experience supporting these students",
    isDemo: true,
  },
  {
    id: "demo-match-priya",
    name: "Priya Nair",
    avatar: "",
    university: "UC Irvine",
    major: "Biology",
    subjects: ["Biology", "Chem"],
    learningStyle: "Reading/Writing + diagrams",
    rating: 4.8,
    reviewCount: 28,
    priceLevel: "$$",
    pricePerHour: 28,
    bio: "Comfortable with dyslexia-friendly explanations, slower pacing, and visual breakdowns of dense readings.",
    supportedLearningDifferences: ["Dyslexia", "Processing speed differences"],
    teachingAdjustments: [
      "Using diagrams and visual explanations",
      "Providing written summaries",
      "Slower paced explanations",
      "Repeating explanations in different ways",
    ],
    accessibilityExperience: "Some experience",
    isDemo: true,
  },
  {
    id: "demo-match-marcus",
    name: "Marcus Ortiz",
    avatar: "",
    university: "Orange Coast College",
    major: "Mathematics",
    subjects: ["Math", "Physics"],
    learningStyle: "Dyscalculia-aware",
    rating: 4.7,
    reviewCount: 19,
    priceLevel: "$",
    pricePerHour: 22,
    bio: "I break math into micro-steps and never rush answers—especially for dyscalculia and exam anxiety.",
    supportedLearningDifferences: [
      "Dyscalculia (math learning difficulty)",
      "Anxiety related to exams or learning",
    ],
    teachingAdjustments: [
      "Breaking problems into smaller steps",
      "Allowing extra thinking time before answers",
      "Checking understanding frequently",
      "Practicing multiple examples",
    ],
    accessibilityExperience: "Yes — I have experience supporting these students",
    isDemo: true,
  },
];
