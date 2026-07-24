import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { db, firestoreReady } from "../lib/firebase";
import { doc, getDocFromServer, setDoc, serverTimestamp } from "firebase/firestore";

const SUBJECT_OPTIONS = [
  "Calculus",
  "Linear Algebra",
  "Statistics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Programming (Python / Java / C++)",
  "Data Structures & Algorithms",
  "Economics",
  "Writing / Essays",
  "Other",
] as const;

const TEACHING_STYLE_OPTIONS = [
  "Step-by-step explanations",
  "Visual diagrams / whiteboard explanations",
  "Practice problems together",
  "Conceptual explanations first",
  "Real-world examples",
  "Structured lesson plans",
  "Interactive problem solving",
  "Written summaries after sessions",
] as const;

const SESSION_PACE_OPTIONS = [
  "Fast review + practice",
  "Moderate pace explanation + practice",
  "Slow paced step-by-step teaching",
  "Adaptive based on student needs",
] as const;

const TEACHING_TOOL_OPTIONS = [
  "Whiteboard explanations",
  "Practice worksheets",
  "Coding walkthroughs",
  "Visual diagrams",
  "Concept summaries",
  "Step-by-step worked examples",
  "Audio explanations",
  "Study plans",
] as const;

const ACCESSIBILITY_EXPERIENCE_OPTIONS = [
  "Yes — I have experience supporting these students",
  "Some experience",
  "No experience but willing to adapt",
  "Prefer not to say",
] as const;

const SUPPORTED_DIFFERENCES_OPTIONS = [
  "ADHD / Attention challenges",
  "Dyslexia",
  "Dyscalculia (math learning difficulty)",
  "Autism spectrum",
  "Processing speed differences",
  "Executive functioning challenges",
  "Anxiety related to exams or learning",
  "Visual impairment",
  "Hearing impairment",
  "Chronic health conditions affecting learning",
  "Prefer not to say",
] as const;

const TEACHING_ADJUSTMENTS_OPTIONS = [
  "Slower paced explanations",
  "Breaking problems into smaller steps",
  "Repeating explanations in different ways",
  "Allowing extra thinking time before answers",
  "Checking understanding frequently",
  "Providing written summaries",
  "Using diagrams and visual explanations",
  "Practicing multiple examples",
  "Flexible pacing during sessions",
] as const;

const SESSION_FORMAT_OPTIONS = ["Remote (video call)", "In-person", "Both"] as const;

export default function TutorOnboardingQuizPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { colors, accentColor } = useTheme();

  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [coursesText, setCoursesText] = useState("");
  const [teachingStyles, setTeachingStyles] = useState<string[]>([]);
  const [sessionPace, setSessionPace] = useState<string | null>(null);
  const [teachingTools, setTeachingTools] = useState<string[]>([]);
  const [accessibilityExperience, setAccessibilityExperience] = useState<string | null>(null);
  const [supportedLearningDifferences, setSupportedLearningDifferences] = useState<string[]>([]);
  const [teachingAdjustments, setTeachingAdjustments] = useState<string[]>([]);
  const [sessionFormat, setSessionFormat] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 9;
  const progress = (step + 1) / totalSteps;

  useEffect(() => {
    if (!user || user.role !== "tutor" || !db) return;
    let cancelled = false;
    (async () => {
      await firestoreReady;
      if (cancelled || !db) return;
      try {
        const ref = doc(db, "tutorProfiles", user.id);
        const snap = await getDocFromServer(ref);
        if (!cancelled && snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          setSubjects(Array.isArray(data.subjects) ? (data.subjects as string[]) : []);
          setCoursesText(Array.isArray(data.courses) ? (data.courses as string[]).join("\n") : "");
          setTeachingStyles(Array.isArray(data.teachingStyles) ? (data.teachingStyles as string[]) : []);
          setSessionPace(typeof data.sessionPace === "string" && data.sessionPace ? (data.sessionPace as string) : null);
          setTeachingTools(Array.isArray(data.teachingTools) ? (data.teachingTools as string[]) : []);
          setAccessibilityExperience(
            typeof data.accessibilityExperience === "string" && data.accessibilityExperience
              ? (data.accessibilityExperience as string)
              : null
          );
          setSupportedLearningDifferences(
            Array.isArray(data.supportedLearningDifferences) ? (data.supportedLearningDifferences as string[]) : []
          );
          setTeachingAdjustments(Array.isArray(data.teachingAdjustments) ? (data.teachingAdjustments as string[]) : []);
          setSessionFormat(typeof data.sessionFormat === "string" && data.sessionFormat ? (data.sessionFormat as string) : null);
        }
      } catch (e) {
        console.warn("[TutorQuiz] Failed to preload tutor quiz answers:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  if (!user || user.role !== "tutor") {
    // Only tutors should see this quiz
    navigate("/home", { replace: true });
    return null;
  }

  const toggleMulti = (value: string, list: string[], setList: (v: string[]) => void, max?: number) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
      return;
    }
    if (max && list.length >= max) return;
    setList([...list, value]);
  };

  const parseCourses = (raw: string): string[] => {
    return raw
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const canProceed = (() => {
    switch (step) {
      case 0:
        return subjects.length >= 1;
      case 1:
        return parseCourses(coursesText).length >= 1;
      case 2:
        return teachingStyles.length >= 1;
      case 3:
        return sessionPace != null;
      case 4:
        return teachingTools.length >= 1;
      case 5:
        return accessibilityExperience != null;
      case 6:
        return supportedLearningDifferences.length >= 1;
      case 7:
        return teachingAdjustments.length >= 1;
      case 8:
        return sessionFormat != null;
      default:
        return false;
    }
  })();

  useEffect(() => {
    if (canProceed) setError(null);
  }, [canProceed]);

  const handleNext = () => {
    if (!canProceed) {
      setError("Select at least one option to continue.");
      return;
    }
    setError(null);
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  const handleSubmit = async () => {
    if (!canProceed) {
      setError("Select at least one option to finish.");
      return;
    }
    if (!db || !user?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await firestoreReady;
      const tutorRef = doc(db, "tutorProfiles", user.id);
      await setDoc(
        tutorRef,
        {
          uid: user.id,
          subjects,
          courses: parseCourses(coursesText),
          teachingStyles,
          sessionPace: sessionPace ?? "",
          teachingTools,
          accessibilityExperience: accessibilityExperience ?? "",
          supportedLearningDifferences,
          teachingAdjustments,
          sessionFormat: sessionFormat ?? "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      // Mark onboarding as completed on the primary user document as well (backend)
      const userRef = doc(db, "users", user.id);
      await setDoc(
        userRef,
        {
          tutorOnboardingCompleted: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      // And in the in-memory auth state so App routing stops redirecting back here
      updateUser({ tutorOnboardingCompleted: true });
      navigate("/home", { replace: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[TutorQuiz] Failed to save tutor quiz:", e);
      setError("Could not save your answers. Please try again.");
      console.warn(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center p-6"
      style={{ background: `linear-gradient(to bottom right, ${colors.bgPrimary}, ${colors.bgSecondary})` }}
    >
      <div className="w-full max-w-md">
        {/* Back Arrow */}
        <div className="px-6 mb-4" style={{ marginTop: "-1rem" }}>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        {/* Header */}
        <div className="px-6 mb-4">
          <h1 className="text-[22px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
            Tutor Onboarding
          </h1>
          <p className="text-[14px]" style={{ color: colors.textSecondary }}>
            Tell us how you teach so we can match you with the right students.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-6">
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.bgTertiary }}>
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: accentColor.primary,
                width: "100%",
                transform: `scaleX(${progress})`,
                transformOrigin: "left",
                transition: "transform 0.4s ease-out",
              }}
            />
          </div>
          <p className="mt-2 text-xs font-medium" style={{ color: colors.textSecondary }}>
            Step {step + 1} of {totalSteps}
          </p>
        </div>

        {/* Question content */}
        <div className="px-6 mb-8 space-y-4">
          {step === 0 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which subjects can you tutor?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Select all that apply.
              </p>
              <div className="space-y-3">
                {SUBJECT_OPTIONS.map((label) => {
                  const active = subjects.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleMulti(label, subjects, setSubjects)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which specific courses have you taken or can tutor?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Include course codes and names, one per line (e.g. Math 2A, ICS 31, Physics 7C).
              </p>
              <textarea
                className="w-full rounded-2xl p-4 text-[14px] border resize-none"
                rows={5}
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
                style={{
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderSecondary,
                  color: colors.textPrimary,
                }}
                placeholder={"Math 2A\nICS 31\nPhysics 7C"}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which teaching styles do you commonly use?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Select up to 3.
              </p>
              <div className="space-y-3">
                {TEACHING_STYLE_OPTIONS.map((label) => {
                  const active = teachingStyles.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleMulti(label, teachingStyles, setTeachingStyles, 3)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                How do you usually structure tutoring sessions?
              </h2>
              <div className="space-y-3">
                {SESSION_PACE_OPTIONS.map((label) => {
                  const active = sessionPace === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setSessionPace(label)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which support tools do you commonly use when teaching?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Select all that apply.
              </p>
              <div className="space-y-3">
                {TEACHING_TOOL_OPTIONS.map((label) => {
                  const active = teachingTools.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleMulti(label, teachingTools, setTeachingTools)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Do you have experience supporting students with learning differences or accommodations?
              </h2>
              <div className="space-y-3">
                {ACCESSIBILITY_EXPERIENCE_OPTIONS.map((label) => {
                  const active = accessibilityExperience === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setAccessibilityExperience(label)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which learning differences are you comfortable supporting?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Select all that apply.
              </p>
              <div className="space-y-3">
                {SUPPORTED_DIFFERENCES_OPTIONS.map((label) => {
                  const active = supportedLearningDifferences.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() =>
                        toggleMulti(label, supportedLearningDifferences, setSupportedLearningDifferences)
                      }
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which teaching adjustments are you comfortable providing?
              </h2>
              <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                Select all that apply.
              </p>
              <div className="space-y-3">
                {TEACHING_ADJUSTMENTS_OPTIONS.map((label) => {
                  const active = teachingAdjustments.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleMulti(label, teachingAdjustments, setTeachingAdjustments)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 8 && (
            <>
              <h2 className="text-[20px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Which session formats do you offer?
              </h2>
              <div className="space-y-3">
                {SESSION_FORMAT_OPTIONS.map((label) => {
                  const active = sessionFormat === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setSessionFormat(label)}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: active ? `${accentColor.primary}20` : colors.bgCard,
                        borderColor: active ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {error && (
            <p className="text-sm mt-2" style={{ color: "#f97373" }}>
              {error}
            </p>
          )}
        </div>

        {/* Navigation buttons (scroll with content, not fixed) */}
        <div className="px-6 pb-6 pt-3">
          <div className="flex items-center justify-between">
            <button
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
              onClick={handleBack}
              disabled={isSubmitting}
            >
              {step === 0 ? "Back" : "Previous"}
            </button>
            <motion.button
              whileHover={canProceed && !isSubmitting ? { scale: 1.02 } : undefined}
              whileTap={canProceed && !isSubmitting ? { scale: 0.98 } : undefined}
              onClick={step === totalSteps - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting || !canProceed}
              className="px-5 py-3 rounded-xl font-semibold flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: accentColor.primary,
                color: "#ffffff",
                opacity: isSubmitting || !canProceed ? 0.45 : 1,
              }}
            >
              <span className="text-sm">{step === totalSteps - 1 ? "Finish" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

