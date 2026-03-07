import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { BottomNav } from "../components/BottomNav";
import svgPaths from "../../imports/svg-in824s3fr2";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ChevronLeft, Eye } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import type { LearningStyle } from "../contexts/AuthContext";
import { LEARNING_STYLE_QUIZ_QUESTIONS as quizQuestions } from "../lib/learningStyleQuiz";

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
  const currentQuestionRef = useRef(0);
  const [barProgress, setBarProgress] = useState(0);
  const [quizPhase, setQuizPhase] = useState<"quiz" | "transitioning" | "results">(
    !isRetake && !!savedResult ? "results" : "quiz"
  );

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      const cq = currentQuestionRef.current;
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[cq] = optionIndex;
        return newAnswers;
      });

      if (cq < quizQuestions.length - 1) {
        const next = cq + 1;
        currentQuestionRef.current = next;
        setCurrentQuestion(next);
        setBarProgress(next / quizQuestions.length);
        setSelectedOption(null);
      } else {
        // Last question: slide bar to 100%, then transition to results
        setBarProgress(1);
        setTimeout(() => {
          setQuizPhase("transitioning");
        }, 500);
        setTimeout(() => {
          setShowResults(true);
          setQuizPhase("results");
        }, 1800);
      }
    }, 400);
  };

  const getResult = () => {
    // If showing saved result (not a retake), use the saved value
    if (!isRetake && savedResult && selectedAnswers.length === 0) return savedResult;
    if (selectedAnswers.length === 0) return "Visual";
    const counts = [0, 0, 0, 0];
    selectedAnswers.forEach((answer) => counts[answer]++);
    const maxIndex = counts.indexOf(Math.max(...counts));
    return learningStyles[maxIndex];
  };

  // Save result + answers to Firestore (user profile) and localStorage when results are shown (once)
  const savedToBackendRef = useRef(false);
  useEffect(() => {
    if (!showResults || savedToBackendRef.current || selectedAnswers.length < quizQuestions.length) return;
    const result = getResult() as LearningStyle;
    localStorage.setItem("learningStyleResult", result);
    if (user?.id) {
      savedToBackendRef.current = true;
      updateUser({
        learningStyle: result,
        learningStyleAnswers: [...selectedAnswers],
        learningStyleCompletedAt: new Date().toISOString(),
      });
    }
  }, [showResults, user?.id, updateUser, selectedAnswers]);

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
            <Link to="/progress">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <ChevronLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
              </motion.button>
            </Link>
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
                  <Link to="/progress">
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

        <BottomNav currentPage="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: `linear-gradient(to bottom right, ${colors.bgPrimary}, ${colors.bgSecondary})` }}>
      <div className="w-full max-w-md">

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

        {/* Transitioning overlay */}
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

        {/* Intro for new users */}
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
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
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
                    <span className="text-[15px]" style={{ color: colors.textPrimary }}>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav currentPage="profile" />
    </div>
  );
}