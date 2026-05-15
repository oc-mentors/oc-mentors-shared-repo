import type { LearningSupport } from "../contexts/AuthContext";

/** Tutor fields used for learning-difference matching (from tutorProfiles). */
export interface TutorMatchProfile {
  id: string;
  supportedLearningDifferences?: string[];
  teachingAdjustments?: string[];
  accessibilityExperience?: string;
}

export interface TutorMatchResult {
  conditionOverlap: string[];
  accommodationOverlap: string[];
  conditionScore: number;
  accommodationScore: number;
  totalScore: number;
  /** Human-readable badges for UI, e.g. "ADHD" */
  matchLabels: string[];
}

/** Normalize quiz labels so student ↔ tutor lists still match. */
const CONDITION_ALIASES: Record<string, string[]> = {
  "adhd / attention challenges": ["adhd / attention challenges"],
  dyslexia: ["dyslexia"],
  "dyscalculia (math learning difficulty)": ["dyscalculia (math learning difficulty)"],
  "autism spectrum": ["autism spectrum"],
  "processing speed differences": ["processing speed differences"],
  "executive functioning or organization challenges": [
    "executive functioning or organization challenges",
    "executive functioning challenges",
  ],
  "executive functioning challenges": [
    "executive functioning or organization challenges",
    "executive functioning challenges",
  ],
  "anxiety related to exams or learning": ["anxiety related to exams or learning"],
  "visual impairment": ["visual impairment"],
  "hearing impairment": ["hearing impairment"],
  "chronic health condition affecting concentration or energy": [
    "chronic health condition affecting concentration or energy",
    "chronic health conditions affecting learning",
  ],
  "chronic health conditions affecting learning": [
    "chronic health condition affecting concentration or energy",
    "chronic health conditions affecting learning",
  ],
};

/** Student accommodation → tutor teaching adjustments that satisfy it. */
const ACCOMMODATION_TO_ADJUSTMENTS: Record<string, string[]> = {
  "extra time on exams or assignments": [
    "Flexible pacing during sessions",
    "Allowing extra thinking time before answers",
  ],
  "breaks during exams or study sessions": [
    "Flexible pacing during sessions",
    "Checking understanding frequently",
  ],
  "note-taking support": ["Providing written summaries", "Checking understanding frequently"],
  "recorded lectures": ["Providing written summaries", "Repeating explanations in different ways"],
  "alternative formats (audio, large text, etc.)": [
    "Using diagrams and visual explanations",
    "Repeating explanations in different ways",
  ],
  "reduced distraction testing environment": [
    "Breaking problems into smaller steps",
    "Checking understanding frequently",
  ],
  "flexible deadlines": ["Flexible pacing during sessions"],
  "assistive technology (screen readers, speech-to-text, etc.)": [
    "Providing written summaries",
    "Using diagrams and visual explanations",
  ],
};

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function expandConditions(conditions: string[]): Set<string> {
  const out = new Set<string>();
  for (const c of conditions) {
    const key = norm(c);
    if (key === "prefer not to say" || key === "other") continue;
    const aliases = CONDITION_ALIASES[key] ?? [c];
    for (const a of aliases) out.add(norm(a));
  }
  return out;
}

function shortConditionLabel(condition: string): string {
  if (condition.includes("ADHD")) return "ADHD";
  if (condition.startsWith("Dyslexia")) return "Dyslexia";
  if (condition.includes("Dyscalculia")) return "Dyscalculia";
  if (condition.includes("Executive")) return "Executive function";
  if (condition.includes("Anxiety")) return "Exam anxiety";
  if (condition.includes("Autism")) return "Autism spectrum";
  if (condition.includes("Processing")) return "Processing speed";
  if (condition.includes("Chronic health")) return "Chronic health";
  if (condition.includes("Visual")) return "Visual";
  if (condition.includes("Hearing")) return "Hearing";
  return condition.split("(")[0].trim();
}

export function scoreTutorMatch(
  learningSupport: LearningSupport | undefined,
  tutor: TutorMatchProfile
): TutorMatchResult | null {
  if (!learningSupport || learningSupport.dscSupportLevel === "no") return null;

  const studentConditions = expandConditions(learningSupport.conditions ?? []);
  const tutorSupports = new Set(
    (tutor.supportedLearningDifferences ?? [])
      .filter((d) => {
        const n = norm(d);
        return n !== "prefer not to say" && n !== "other";
      })
      .map(norm)
  );

  const conditionOverlap: string[] = [];
  for (const c of learningSupport.conditions ?? []) {
    const expanded = CONDITION_ALIASES[norm(c)] ?? [c];
    if (expanded.some((alias) => tutorSupports.has(norm(alias)))) {
      conditionOverlap.push(c);
    }
  }

  const tutorAdjustments = new Set((tutor.teachingAdjustments ?? []).map((a) => a.trim()));
  const accommodationOverlap: string[] = [];
  for (const acc of learningSupport.accommodations ?? []) {
    const needed = ACCOMMODATION_TO_ADJUSTMENTS[norm(acc)] ?? [];
    if (needed.some((adj) => tutorAdjustments.has(adj))) {
      accommodationOverlap.push(acc);
    }
  }

  const conditionScore = conditionOverlap.length;
  const accommodationScore = accommodationOverlap.length;
  const totalScore = conditionScore * 2 + accommodationScore;

  if (totalScore === 0 && learningSupport.dscSupportLevel === "maybe") {
    const willing =
      tutor.accessibilityExperience?.includes("willing to adapt") ||
      tutor.accessibilityExperience?.includes("Some experience") ||
      tutor.accessibilityExperience?.includes("Yes");
    if (!willing) return null;
  }

  if (totalScore === 0) return null;

  const matchLabels = [
    ...conditionOverlap.map(shortConditionLabel),
    ...accommodationOverlap.slice(0, 2).map((a) => {
      if (a.toLowerCase().includes("extra time")) return "Extra time";
      if (a.toLowerCase().includes("written") || a.includes("Note")) return "Written support";
      if (a.toLowerCase().includes("step") || a.includes("Breaking")) return "Step-by-step";
      return a.split("(")[0].trim().slice(0, 20);
    }),
  ];

  return {
    conditionOverlap,
    accommodationOverlap,
    conditionScore,
    accommodationScore,
    totalScore,
    matchLabels: [...new Set(matchLabels)].slice(0, 4),
  };
}

export function buildMatchSummary(
  learningSupport: LearningSupport | undefined,
  matchedCount: number
): string | null {
  if (!learningSupport || learningSupport.dscSupportLevel === "no") return null;
  const conditions = (learningSupport.conditions ?? []).filter(
    (c) => !["Prefer not to say", "Other"].includes(c)
  );
  const accommodations = (learningSupport.accommodations ?? []).filter(
    (a) => a !== "Other"
  );
  if (conditions.length === 0 && accommodations.length === 0) return null;

  const parts: string[] = [];
  if (conditions.length) {
    const labels = conditions.slice(0, 2).map(shortConditionLabel);
    parts.push(labels.join(" + "));
  }
  if (accommodations.length) {
    const accShort = accommodations
      .slice(0, 2)
      .map((a) => (a.toLowerCase().includes("extra time") ? "extended time" : "your accommodations"))
      .join(", ");
    parts.push(accShort);
  }

  const need = parts.join(" · ");
  if (matchedCount === 0) {
    return `We’ll prioritize mentors who support ${need} when profiles are available.`;
  }
  return `${matchedCount} mentor${matchedCount === 1 ? "" : "s"} trained for ${need}`;
}
