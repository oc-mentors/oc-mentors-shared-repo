import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import svgPaths from "../../imports/svg-in824s3fr2";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

const quizQuestions: QuizQuestion[] = [
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

const learningStyles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"];

export default function LearningStyleQuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = optionIndex;
      setSelectedAnswers(newAnswers);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 400);
  };

  const getResult = () => {
    if (selectedAnswers.length === 0) return "Visual";
    const counts = [0, 0, 0, 0];
    selectedAnswers.forEach((answer) => counts[answer]++);
    const maxIndex = counts.indexOf(Math.max(...counts));
    return learningStyles[maxIndex];
  };

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
        case "Auditory":
          return <Ear className="w-20 h-20 text-white" />;
        case "Reading/Writing":
          return <BookOpen className="w-20 h-20 text-white" />;
        case "Kinesthetic":
          return <Hand className="w-20 h-20 text-white" />;
        default:
          return <Eye className="w-20 h-20 text-white" />;
      }
    };

    const getDescription = () => {
      switch (result) {
        case "Visual":
          return "You learn best by seeing information. Diagrams, charts, videos, and visual demonstrations help you absorb and retain knowledge";
        case "Auditory":
          return "You learn best through listening and verbal explanations. Discussions, lectures, and audio content help you understand";
        case "Reading/Writing":
          return "You learn best through reading and writing. Taking notes, reading textbooks, and written assignments help you learn";
        case "Kinesthetic":
          return "You learn best through hands-on practice and experience. Physical activities and real-world applications help you understand";
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
            { emoji: "🎧", title: "Record Lectures", description: "Listen to recordings while studying" },
            { emoji: "👥", title: "Study Groups", description: "Discuss topics with others to reinforce learning" },
            { emoji: "🗣️", title: "Read Aloud", description: "Hearing information helps you remember better" },
          ];
        case "Reading/Writing":
          return [
            { emoji: "📝", title: "Take Detailed Notes", description: "Writing helps you process and remember" },
            { emoji: "📚", title: "Summarize Content", description: "Rewrite information in your own words" },
            { emoji: "📋", title: "Create Lists", description: "Organize information with outlines and lists" },
          ];
        case "Kinesthetic":
          return [
            { emoji: "✍️", title: "Practice Problems", description: "Work through exercises hands-on" },
            { emoji: "🔬", title: "Experiments", description: "Use hands-on activities to learn concepts" },
            { emoji: "🚶", title: "Take Breaks", description: "Move around while studying to stay engaged" },
          ];
        default:
          return [];
      }
    };

    return (
      <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
        <div className="max-w-md mx-auto">
          {/* Status Bar */}
          <div className="px-6 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-white">9:41</span>
            </div>
          </div>

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
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#e8edf5]" />
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
            <h3 className="text-[20px] font-semibold text-[#e8edf5] mb-4">Recommended Study Tips</h3>
            <div className="space-y-3">
              {getStudyTips().map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="bg-[#353a52] rounded-2xl p-4 border border-[rgba(255,255,255,0.05)] cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-[30px] leading-[45px] flex-shrink-0">{tip.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-semibold text-[#e8edf5] mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-[13px] text-[#a8b3cf] leading-[18px]">
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
    <div className="min-h-screen bg-gradient-to-br from-[#2c3042] to-[#1e2139] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-8"
        >
          <div className="w-full h-2 bg-[#2a2f4a] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundImage: "linear-gradient(174.463deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

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
            <h2 className="text-[22px] font-semibold text-[#e8edf5] mb-8 leading-[30px]">
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
                  className={`w-full bg-[#1e2139] rounded-xl p-5 text-left border transition-all ${
                    selectedOption === index
                      ? "border-[#5b7ceb] bg-[rgba(91,124,235,0.1)]"
                      : "border-[rgba(255,255,255,0.12)]"
                  } shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedOption === index
                          ? "border-[#5b7ceb] bg-[#5b7ceb]"
                          : "border-[rgba(255,255,255,0.12)]"
                      }`}
                    >
                      {selectedOption === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-[15px] text-[#e8edf5]">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip Quiz */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6"
        >
          <Link to="/progress">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 text-[#a8b3cf] text-[15px] font-normal"
            >
              Skip Quiz
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <BottomNav currentPage="profile" />
    </div>
  );
}