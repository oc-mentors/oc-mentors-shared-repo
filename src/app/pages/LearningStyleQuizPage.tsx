import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import svgPaths from "../../imports/svg-in824s3fr2";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ChevronLeft, Eye, Layers } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import type { LearningStyle, LearningSupport } from "../contexts/AuthContext";
import {
  LEARNING_STYLE_QUIZ_QUESTIONS as quizQuestions,
  buildShuffledQuizQuestions,
  getQuizAnswerText,
} from "../lib/learningStyleQuiz";
import { useDemoModeOptional } from "../contexts/DemoModeContext";

const learningStyles: LearningStyle[] = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"];

export default function LearningStyleQuizPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [searchParams] = useSearchParams();
  const isRetake = searchParams.get("retake") === "true";
  // For logged-in users, only use profile — never localStorage (so new accounts always see the quiz)
  const savedResult = (user?.learningStyle ?? null) as LearningStyle | null;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(!isRetake && !!savedResult);
  const { colors, accentColor } = useTheme();
  const demoMode = useDemoModeOptional();
  const isExpoDemo = !!(demoMode?.isDemoMode || demoMode?.isStarting);
  const shuffledQuestions = useMemo(() => buildShuffledQuizQuestions(quizQuestions), []);
  const pageBackgroundStyle = isExpoDemo
    ? { backgroundColor: colors.bgPrimary }
    : {
        background: `linear-gradient(to bottom right, ${colors.bgPrimary}, ${colors.bgSecondary})`,
      };
  const currentQuestionRef = useRef(0);
  const [barProgress, setBarProgress] = useState(0);
  const [quizPhase, setQuizPhase] = useState<"quiz" | "transitioning" | "dsc" | "results">(
    !isRetake && !!savedResult ? "results" : "quiz"
  );
  // DSC / Learning Support extension state
  const [dscSupportLevel, setDscSupportLevel] = useState<"yes" | "maybe" | "no" | null>(null);
  const [yesConditions, setYesConditions] = useState<string[]>([]);
  const [yesAccommodations, setYesAccommodations] = useState<string[]>([]);
  const [yesLearningPrefs, setYesLearningPrefs] = useState<string[]>([]);
  const [yesTutorPrefs, setYesTutorPrefs] = useState<string[]>([]);
  const [maybeChallenges, setMaybeChallenges] = useState<string[]>([]);
  const [maybeLearningStyle, setMaybeLearningStyle] = useState<string | null>(null);
  const [maybeStudyStrategy, setMaybeStudyStrategy] = useState<string | null>(null);
  const [maybeTutorExperience, setMaybeTutorExperience] = useState<string | null>(null);
  const [dscStep, setDscStep] = useState<number>(0); // 0 = gate, then 1..4 per branch

  // When retaking the quiz, pre-fill with previous answers so options are selected
  useEffect(() => {
    if (!isRetake || !user) return;
    // Prefer legacy numeric indices if present
    let indices: number[] | null = null;
    if (Array.isArray((user as any).learningStyleAnswers) && (user as any).learningStyleAnswers.length === quizQuestions.length) {
      indices = [...((user as any).learningStyleAnswers as number[])];
    } else if (Array.isArray(user.learningStyleQuestionAnswers) && user.learningStyleQuestionAnswers.length === quizQuestions.length) {
      indices = user.learningStyleQuestionAnswers.map((qa, i) => {
        const optIndex = quizQuestions[i].options.indexOf(qa.answer);
        return optIndex >= 0 ? optIndex : -1;
      });
    }
    if (!indices || indices.length === 0) return;
    setSelectedAnswers(indices);
    currentQuestionRef.current = 0;
    setCurrentQuestion(0);
    const styleIdx = indices[0];
    const displayIdx =
      styleIdx >= 0
        ? shuffledQuestions[0].shuffledOptions.findIndex((o) => o.styleIndex === styleIdx)
        : -1;
    setSelectedOption(displayIdx >= 0 ? displayIdx : null);
    setBarProgress(0 / quizQuestions.length);
  }, [isRetake, user?.id, user?.learningStyle, user?.learningStyleQuestionAnswers, shuffledQuestions]);

  const styleIndexForDisplay = (questionIndex: number, displayIndex: number) =>
    shuffledQuestions[questionIndex]?.shuffledOptions[displayIndex]?.styleIndex ?? displayIndex;

  const displayIndexForStyle = (questionIndex: number, styleIndex: number) =>
    shuffledQuestions[questionIndex]?.shuffledOptions.findIndex((o) => o.styleIndex === styleIndex) ?? -1;

  const handleOptionSelect = (displayIndex: number) => {
    setSelectedOption(displayIndex);

    // Auto-advance after a short delay
    setTimeout(() => {
      const cq = currentQuestionRef.current;
      const styleIndex = styleIndexForDisplay(cq, displayIndex);
      setSelectedAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[cq] = styleIndex;
        return newAnswers;
      });

      if (cq < quizQuestions.length - 1) {
        const next = cq + 1;
        currentQuestionRef.current = next;
        setCurrentQuestion(next);
        setBarProgress(next / quizQuestions.length);
        setSelectedOption(null);
      } else {
        // Last question: slide bar to 100%, then transition to DSC / Learning Support extension
        setBarProgress(1);
        setTimeout(() => {
          setQuizPhase("transitioning");
        }, 500);
        setTimeout(() => {
          setQuizPhase("dsc");
        }, 1800);
      }
    }, 400);
  };

  const getResult = (): LearningStyle => {
    if (!isRetake && savedResult && selectedAnswers.length === 0) return savedResult;
    if (selectedAnswers.length === 0) return "Visual";
    const counts = [0, 0, 0, 0];
    selectedAnswers.forEach((answer) => counts[answer]++);
    const maxCount = Math.max(...counts);
    const tiedIndices = counts
      .map((c, i) => (c === maxCount ? i : -1))
      .filter((i) => i >= 0);
    if (tiedIndices.length > 1) return "Mixed";
    return learningStyles[tiedIndices[0]];
  };

  // Build Learning Support payload from DSC state
  const buildLearningSupport = (): LearningSupport | undefined => {
    if (!dscSupportLevel) return undefined;
    if (dscSupportLevel === "no") {
      return {
        dscSupportLevel,
        conditions: [],
        accommodations: [],
        learningPreferences: [],
        tutoringPreferences: [],
        learningChallenges: [],
      };
    }
    if (dscSupportLevel === "yes") {
      return {
        dscSupportLevel,
        conditions: yesConditions,
        accommodations: yesAccommodations,
        learningPreferences: yesLearningPrefs,
        tutoringPreferences: yesTutorPrefs,
        learningChallenges: [],
      };
    }
    // maybe
    const learningPrefs: string[] = [];
    if (maybeLearningStyle) learningPrefs.push(maybeLearningStyle);
    if (maybeStudyStrategy) learningPrefs.push(maybeStudyStrategy);
    const tutorPrefs: string[] = [];
    if (maybeTutorExperience) tutorPrefs.push(maybeTutorExperience);
    return {
      dscSupportLevel,
      conditions: [],
      accommodations: [],
      learningPreferences: learningPrefs,
      tutoringPreferences: tutorPrefs,
      learningChallenges: maybeChallenges,
    };
  };

  // Save result + literal Q&A text only (no numeric indices) to Firestore when results are shown (once)
  const savedToBackendRef = useRef(false);
  useEffect(() => {
    if (!showResults || savedToBackendRef.current || selectedAnswers.length < quizQuestions.length) return;
    const result = getResult() as LearningStyle;
    localStorage.setItem("learningStyleResult", result);
    if (user?.id) {
      savedToBackendRef.current = true;
      const questionAnswers = quizQuestions.map((q, i) => ({
        question: q.question,
        answer: getQuizAnswerText(i, selectedAnswers[i] ?? -1) || "—",
      }));
      const learningSupport = buildLearningSupport();
      const updates: Partial<import("../contexts/AuthContext").User> = {
        learningStyle: result,
        learningStyleQuestionAnswers: questionAnswers,
        learningStyleCompletedAt: new Date().toISOString(),
      };
      if (learningSupport) {
        (updates as any).learningSupport = learningSupport;
      }
      updateUser(updates);
    }
  }, [showResults, user?.id, updateUser, selectedAnswers, dscSupportLevel, yesConditions, yesAccommodations, yesLearningPrefs, yesTutorPrefs, maybeChallenges, maybeLearningStyle, maybeStudyStrategy, maybeTutorExperience]);

  if (showResults) {
    const result = getResult();
    
    const getLearningStyleIcon = () => {
      switch (result) {
        case "Visual":
          return (
            <svg className="w-20 h-20" fill="none" viewBox="0 0 80 80">
              <path d={svgPaths.pba86b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
              <path d={svgPaths.p23cbedc0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
            </svg>
          );
        case "Mixed":
          return <Layers className="w-20 h-20 text-white" />;
        default:
          return <Eye className="w-20 h-20 text-white" />;
      }
    };

    const getDescription = () => {
      switch (result) {
        case "Visual":
          return "You learn best by seeing information. Diagrams, charts, videos, and visual demonstrations help you absorb and retain knowledge";
        case "Auditory":
          return "You learn best by hearing information. Lectures, discussions, and verbal explanations help you absorb and retain knowledge";
        case "Reading/Writing":
          return "You learn best through reading and writing. Textbooks, notes, and written exercises help you absorb and retain knowledge";
        case "Kinesthetic":
          return "You learn best through hands-on experience. Practical activities, experiments, and physical engagement help you absorb and retain knowledge";
        case "Mixed":
          return "You learn well in many ways — visual, auditory, reading/writing, and hands-on. Mix different methods to keep studying effective and engaging.";
        default:
          return "";
      }
    };

    const getStudyTips = () => {
      switch (result) {
        case "Visual":
          return [
            { emoji: "📊", title: "Use Mind Maps", description: "Create visual diagrams to connect concepts" },
            { emoji: "✏️", title: "Color Code Notes", description: "Use highlighters and different colors for better retention" },
            { emoji: "🎥", title: "Watch Video Tutorials", description: "Visual demonstrations make learning easier" },
          ];
        case "Auditory":
          return [
            { emoji: "🎧", title: "Listen to Podcasts", description: "Audio content helps reinforce learning" },
            { emoji: "🗣️", title: "Join Study Groups", description: "Discussing topics out loud improves understanding" },
            { emoji: "🎵", title: "Use Mnemonics", description: "Create rhymes or songs to remember key facts" },
          ];
        case "Reading/Writing":
          return [
            { emoji: "📝", title: "Take Detailed Notes", description: "Writing things down strengthens your memory" },
            { emoji: "📖", title: "Read Widely", description: "Explore textbooks, articles, and written resources" },
            { emoji: "✍️", title: "Rewrite Key Points", description: "Summarize material in your own words" },
          ];
        case "Kinesthetic":
          return [
            { emoji: "🔬", title: "Do Experiments", description: "Hands-on practice makes concepts click" },
            { emoji: "🏃", title: "Take Active Breaks", description: "Move around between study sessions to stay focused" },
            { emoji: "🧩", title: "Use Physical Models", description: "Build or manipulate objects to understand concepts" },
          ];
        case "Mixed":
          return [
            { emoji: "🔄", title: "Rotate Methods", description: "Switch between videos, notes, and practice to reinforce learning" },
            { emoji: "📚", title: "Combine Inputs", description: "Read, then discuss, then try it — use more than one style per topic" },
            { emoji: "✨", title: "Match the Task", description: "Use visuals for concepts, hands-on for skills, writing for recall" },
          ];
        default:
          return [];
      }
    };

    return (
      <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pt-6 pb-6"
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
            </motion.button>
          </motion.div>

          {/* Animated Card with Flip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-6 mb-6"
            style={{ perspective: 1000 }}
          >
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: "spring",
                stiffness: 80,
              }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div 
                className="relative overflow-hidden rounded-[30px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] p-10"
                style={{ backgroundImage: "linear-gradient(124.85deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}
              >
                {/* Background Blur Effects */}
                <div className="absolute bg-[rgba(255,255,255,0.1)] blur-[64px] right-[40px] rounded-full w-32 h-32 top-0" />
                <div className="absolute bg-[rgba(255,255,255,0.1)] blur-[40px] left-0 rounded-full w-24 h-24 bottom-[100px]" />

                {/* Icon Container */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="relative mx-auto w-[120px] h-[120px] bg-[rgba(255,255,255,0.2)] rounded-[24px] flex items-center justify-center mb-6"
                >
                  {getLearningStyleIcon()}
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-4"
                >
                  {/* Title with Sparkle */}
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 18 18">
                        <path d={svgPaths.p1f21bc00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </motion.div>
                    <h2 className="text-[22px] font-bold text-white text-center">
                      You are a<br />{result} Learner
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-[14px] text-[rgba(255,255,255,0.9)] text-center leading-[22px] px-2">
                    {getDescription()}
                  </p>

                  {/* Continue Button */}
                  <Link to="/home">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[rgba(255,255,255,0.2)] rounded-[12px] py-3 shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]"
                    >
                      <span className="text-[15px] font-semibold text-white">Continue to Profile</span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Recommended Study Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="px-6 mb-6"
          >
            <h3 className="text-[20px] font-semibold mb-4" style={{ color: colors.textPrimary }}>Recommended Study Tips</h3>
            <div className="space-y-3">
              {getStudyTips().map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="rounded-2xl p-4 border cursor-pointer"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-[30px] leading-[45px] flex-shrink-0">{tip.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {tip.title}
                      </h4>
                      <p className="text-[13px] leading-[18px]" style={{ color: colors.textSecondary }}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    );
  }

  return (
    <div
      className={
        isExpoDemo
          ? "w-full p-6 pt-4"
          : "min-h-screen flex items-center justify-center p-6"
      }
      style={pageBackgroundStyle}
    >
      <div className="w-full max-w-md mx-auto" style={isExpoDemo ? pageBackgroundStyle : undefined}>

        {/* Back Arrow */}
        <div className="px-6 mb-4" style={{ marginTop: "-1rem" }}>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        {/* Transitioning overlay (between learning style quiz and DSC section) */}
        <AnimatePresence>
          {quizPhase === "transitioning" && (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${colors.bgPrimary}, ${colors.bgSecondary})` }}
            >
              {/* Animated checkmark circle */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: accentColor.primary }}
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>

              {/* Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-[18px] font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Analyzing your answers...
              </motion.p>

              {/* Animated dots */}
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accentColor.primary }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Base learning style quiz (existing questions) */}
        {quizPhase === "quiz" && (
          <>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="px-6 text-[15px] mb-4"
              style={{ color: colors.textSecondary }}
            >
              Tell us a bit more about how you learn best — we’ll use this to personalize your experience.
            </motion.p>

            {/* Progress Bar */}
            <div className="px-6 mb-8">
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.bgTertiary }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: accentColor.primary,
                    width: "100%",
                    transform: `scaleX(${barProgress})`,
                    transformOrigin: "left",
                    transition: "transform 0.5s ease-out",
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="px-6 mb-8"
              >
                <h2 className="text-[22px] font-semibold mb-8 leading-[30px]" style={{ color: colors.textPrimary }}>
                  {quizQuestions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                  {shuffledQuestions[currentQuestion].shuffledOptions.map((option, index) => (
                    <motion.button
                      key={`${currentQuestion}-${option.styleIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full rounded-xl p-5 text-left border transition-all shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]`}
                      style={{
                        backgroundColor: selectedOption === index ? `${accentColor.primary}15` : colors.bgCard,
                        borderColor: selectedOption === index ? accentColor.primary : colors.borderSecondary,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selectedOption === index ? accentColor.primary : colors.borderSecondary,
                            backgroundColor: selectedOption === index ? accentColor.primary : "transparent",
                          }}
                        >
                          {selectedOption === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-[15px]" style={{ color: colors.textPrimary }}>{option.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* DSC / Learning Support extension */}
        {quizPhase === "dsc" && (
          <div className="px-6 mb-8">
            {/* Gate question */}
            {dscStep === 0 && (
              <>
                <h2 className="text-[22px] font-semibold mb-4 leading-[30px]" style={{ color: colors.textPrimary }}>
                  Learning Support &amp; Accessibility (Optional)
                </h2>
                <p className="text-[14px] mb-6" style={{ color: colors.textSecondary }}>
                  This section helps us match you with mentors and learning tools that support your learning needs.
                </p>
                <h3 className="text-[18px] font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Do you think you need academic accommodations or learning support through DSC (Disability Services Center)?
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Yes — I already receive accommodations", value: "yes" as const },
                    { label: "Maybe — I'm not sure", value: "maybe" as const },
                    { label: "No", value: "no" as const },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setDscSupportLevel(opt.value);
                        if (opt.value === "no") {
                          // Skip the rest of this section and go to results
                          setShowResults(true);
                          setQuizPhase("results");
                        } else {
                          setDscStep(1);
                        }
                      }}
                      className="w-full rounded-xl p-4 text-left border cursor-pointer"
                      style={{
                        backgroundColor: colors.bgCard,
                        borderColor: colors.borderSecondary,
                      }}
                    >
                      <span className="text-[15px]" style={{ color: colors.textPrimary }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* YES branch */}
            {dscStep > 0 && dscSupportLevel === "yes" && (
              <>
                {dscStep === 1 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Which learning differences or conditions affect your learning?
                    </h3>
                    <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                      Select all that apply.
                    </p>
                    <div className="space-y-3">
                      {[
                        "ADHD / Attention challenges",
                        "Dyslexia",
                        "Dyscalculia (math learning difficulty)",
                        "Autism spectrum",
                        "Processing speed differences",
                        "Executive functioning or organization challenges",
                        "Anxiety related to exams or learning",
                        "Visual impairment",
                        "Hearing impairment",
                        "Chronic health condition affecting concentration or energy",
                        "Prefer not to say",
                        "Other",
                      ].map((label) => {
                        const active = yesConditions.includes(label);
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setYesConditions((prev) =>
                                prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
                              );
                            }}
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

                {dscStep === 2 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Which accommodations do you currently receive through DSC?
                    </h3>
                    <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                      Select all that apply.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Extra time on exams or assignments",
                        "Breaks during exams or study sessions",
                        "Note-taking support",
                        "Recorded lectures",
                        "Alternative formats (audio, large text, etc.)",
                        "Reduced distraction testing environment",
                        "Flexible deadlines",
                        "Assistive technology (screen readers, speech-to-text, etc.)",
                        "Other",
                      ].map((label) => {
                        const active = yesAccommodations.includes(label);
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setYesAccommodations((prev) =>
                                prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
                              );
                            }}
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

                {dscStep === 3 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Which explanation style helps you learn best?
                    </h3>
                    <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                      Select up to 3.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Step-by-step explanations",
                        "Visual diagrams or whiteboard explanations",
                        "Practice problems together",
                        "Slower paced teaching",
                        "Written summaries",
                        "Audio explanations",
                        "Real-world examples",
                        "Repetition and review",
                      ].map((label) => {
                        const active = yesLearningPrefs.includes(label);
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setYesLearningPrefs((prev) => {
                                if (prev.includes(label)) return prev.filter((v) => v !== label);
                                if (prev.length >= 3) return prev;
                                return [...prev, label];
                              });
                            }}
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

                {dscStep === 4 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      What would make tutoring sessions most helpful for you?
                    </h3>
                    <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                      Select up to 3.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Breaking problems into smaller steps",
                        "Checking understanding frequently",
                        "Allowing extra time to think before answering",
                        "Using diagrams or visuals",
                        "Summarizing key ideas at the end",
                        "Practicing similar problems together",
                        "Providing written notes or study guides",
                        "A slower paced session",
                        "Keeping instructions clear and not overwhelming",
                      ].map((label) => {
                        const active = yesTutorPrefs.includes(label);
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setYesTutorPrefs((prev) => {
                                if (prev.includes(label)) return prev.filter((v) => v !== label);
                                if (prev.length >= 3) return prev;
                                return [...prev, label];
                              });
                            }}
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

                {/* Navigation buttons for YES branch */}
                <div className="mt-6 flex justify-between">
                  <button
                    className="text-sm font-medium"
                    style={{ color: colors.textSecondary }}
                    onClick={() => {
                      if (dscStep === 1) {
                        setDscStep(0);
                        setDscSupportLevel(null);
                      } else {
                        setDscStep((s) => Math.max(1, s - 1));
                      }
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="text-sm font-semibold"
                    style={{ color: accentColor.primary }}
                    onClick={() => {
                      if (dscStep < 4) {
                        setDscStep((s) => s + 1);
                      } else {
                        // Submit YES branch and show results
                        setShowResults(true);
                        setQuizPhase("results");
                      }
                    }}
                  >
                    {dscStep < 4 ? "Next" : "Submit"}
                  </button>
                </div>
              </>
            )}

            {/* MAYBE branch */}
            {dscStep > 0 && dscSupportLevel === "maybe" && (
              <>
                {dscStep === 1 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Which situations make learning most difficult for you?
                    </h3>
                    <p className="text-[13px] mb-4" style={{ color: colors.textSecondary }}>
                      Select all that apply.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Keeping focus during long study sessions",
                        "Reading dense material quickly",
                        "Understanding complex instructions",
                        "Keeping track of multiple steps",
                        "Processing information quickly",
                        "None of these",
                      ].map((label) => {
                        const active = maybeChallenges.includes(label);
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setMaybeChallenges((prev) =>
                                prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
                              );
                            }}
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

                {dscStep === 2 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Which learning style helps you understand concepts best?
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Visual diagrams and illustrations",
                        "Step-by-step explanations",
                        "Listening to explanations",
                        "Practicing problems",
                        "Written summaries",
                      ].map((label) => {
                        const active = maybeLearningStyle === label;
                        return (
                          <button
                            key={label}
                            onClick={() => setMaybeLearningStyle(label)}
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

                {dscStep === 3 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      When studying difficult material, what usually helps the most?
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Slower explanations",
                        "Breaking concepts into smaller steps",
                        "Practicing multiple examples",
                        "Seeing visual diagrams",
                        "Reviewing concepts repeatedly",
                      ].map((label) => {
                        const active = maybeStudyStrategy === label;
                        return (
                          <button
                            key={label}
                            onClick={() => setMaybeStudyStrategy(label)}
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

                {dscStep === 4 && (
                  <>
                    <h3 className="text-[18px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Would you like tutors who are experienced supporting students with different learning needs?
                    </h3>
                    <div className="space-y-3">
                      {["Yes", "Maybe", "No preference"].map((label) => {
                        const active = maybeTutorExperience === label;
                        return (
                          <button
                            key={label}
                            onClick={() => setMaybeTutorExperience(label)}
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

                {/* Navigation buttons for MAYBE branch */}
                <div className="mt-6 flex justify-between">
                  <button
                    className="text-sm font-medium"
                    style={{ color: colors.textSecondary }}
                    onClick={() => {
                      if (dscStep === 1) {
                        setDscStep(0);
                        setDscSupportLevel(null);
                      } else {
                        setDscStep((s) => Math.max(1, s - 1));
                      }
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="text-sm font-semibold"
                    style={{ color: accentColor.primary }}
                    onClick={() => {
                      if (dscStep < 4) {
                        setDscStep((s) => s + 1);
                      } else {
                        // Submit MAYBE branch and show results
                        setShowResults(true);
                        setQuizPhase("results");
                      }
                    }}
                  >
                    {dscStep < 4 ? "Next" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}