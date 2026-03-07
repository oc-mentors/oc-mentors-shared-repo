import { Link, useNavigate, useLocation } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import svgPaths from "../../imports/svg-ncbm4ttepm";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronRight, TrendingUp, Target, Settings, HelpCircle, LogOut, Eye, Ear, BookOpen, Hand, Layers, RefreshCw, Lightbulb, Bug, Send, CheckCircle, X, ChevronDown, Mail, Clock, Copy, ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from "react";
import { LogoutConfirmModal } from "../components/LogoutConfirmModal";
import { LEARNING_STYLE_QUIZ_QUESTIONS, getQuizAnswerText } from "../lib/learningStyleQuiz";

// ── Quiz Q&A section (questions + selected answers from DB or indices) ─────────
function QuizAnswersSection({
  answers,
  questionAnswers,
  colors,
  accentColor,
}: {
  answers?: number[];
  questionAnswers?: { question: string; answer: string }[];
  colors: { bgCard: string; textPrimary: string; textSecondary: string; borderSecondary: string };
  accentColor: { primary: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const items = questionAnswers?.length
    ? questionAnswers.map((qa, i) => ({ key: i, question: qa.question, answer: qa.answer }))
    : (answers ?? []).map((_, i) => ({
        key: i,
        question: LEARNING_STYLE_QUIZ_QUESTIONS[i]?.question ?? "",
        answer: getQuizAnswerText(i, answers![i] ?? -1) || "—",
      }));
  return (
    <div className="rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] overflow-hidden" style={{ backgroundColor: colors.bgCard }}>
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center justify-between"
      >
        <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
          Your quiz answers
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: colors.borderSecondary }}>
              {items.map((item, i) => (
                <div key={item.key} className="pt-4">
                  <p className="text-[13px] font-medium mb-1" style={{ color: colors.textSecondary }}>
                    {i + 1}. {item.question}
                  </p>
                  <p className="text-[14px]" style={{ color: colors.textPrimary }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Contact Us modal ─────────────────────────────────────────────────────────
function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colors, accentColor } = useTheme();
  const [copied, setCopied] = useState(false);
  const email = "support@ocmentors.edu";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.bgCard }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accentColor.primary}20` }}>
                  <Mail className="w-5 h-5" style={{ color: accentColor.primary }} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>Contact Us</h3>
                  <p className="text-[12px]" style={{ color: colors.textSecondary }}>We're here to help</p>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </motion.button>
            </div>

            {/* Email card */}
            <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: colors.bgTertiary }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textSecondary }}>Support Email</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>{email}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: copied ? `${accentColor.primary}25` : colors.bgCard }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle className="w-4 h-4" style={{ color: accentColor.primary }} />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Info rows */}
            <div className="rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: colors.bgTertiary }}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: accentColor.primary }} />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>Response Time</p>
                  <p className="text-[12px]" style={{ color: colors.textSecondary }}>Usually within 24 hours</p>
                </div>
              </div>
              <div className="mx-4 h-px" style={{ backgroundColor: colors.borderPrimary }} />
              <div className="flex items-center gap-3 px-4 py-3.5">
                <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#FF9500]" />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>Support Hours</p>
                  <p className="text-[12px]" style={{ color: colors.textSecondary }}>Mon – Fri, 9 AM – 5 PM PST</p>
                </div>
              </div>
            </div>

            {/* Open email client button */}
            <motion.a
              href={`mailto:${email}?subject=OC Mentors Support`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: accentColor.primary }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in Mail App
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Reusable bottom-sheet modal ──────────────────────────────────────────────
function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconBg,
  fields,
  submitLabel,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  fields: { id: string; label: string; placeholder: string; multiline?: boolean; required?: boolean }[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const { colors, accentColor } = useTheme();
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const required = fields.filter(f => f.required);
    const allFilled = required.every(f => (values[f.id] || "").trim().length > 0);
    if (!allFilled) return;
    onSubmit(values);
    setSubmitted(true);
  };

  const handleClose = () => {
    setValues({});
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.bgCard }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
                  {icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>{title}</h3>
                  <p className="text-[12px]" style={{ color: colors.textSecondary }}>{subtitle}</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 gap-3"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: `${accentColor.primary}20` }}>
                    <CheckCircle className="w-8 h-8" style={{ color: accentColor.primary }} />
                  </div>
                  <p className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>Thanks!</p>
                  <p className="text-[13px] text-center" style={{ color: colors.textSecondary }}>
                    Your {title.toLowerCase()} has been received. We'll look into it soon.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="mt-3 w-full py-3 rounded-2xl text-[14px] font-semibold text-white"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col gap-4">
                    {fields.map(field => (
                      <div key={field.id}>
                        <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                          {field.label}{field.required && <span className="ml-1" style={{ color: accentColor.primary }}>*</span>}
                        </label>
                        {field.multiline ? (
                          <textarea
                            rows={4}
                            placeholder={field.placeholder}
                            value={values[field.id] || ""}
                            onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none resize-none transition-colors"
                            style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={values[field.id] || ""}
                            onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                            style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    className="mt-5 w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    <Send className="w-4 h-4" />
                    {submitLabel}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { colors, accentColor } = useTheme();
  const learningStyle = user?.learningStyle ?? localStorage.getItem("learningStyleResult");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with Back Button */}
        <div className="px-6 pt-3 pb-2">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.bgCard }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-8 pb-8 flex flex-col items-center"
        >
          {/* Profile Image with Edit Badge */}
          <div className="relative mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AvatarWithInitials
                src={user?.avatar}
                firstName={user?.firstName}
                lastName={user?.lastName}
                name={user?.name}
                className="w-[130px] h-[130px] rounded-full object-cover shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] text-[45px]"
              />
            </motion.div>
            {/* Edit Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full shadow-[0px_4px_24px_0px_rgba(91,124,235,0.25)] flex items-center justify-center"
              style={{ 
                background: `linear-gradient(to bottom right, ${accentColor.primary}, ${accentColor.hover})` 
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18">
                <path
                  d={svgPaths.p1252e600}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.67"
                />
              </svg>
            </motion.div>
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[30px] font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            {user?.name || "Nora Anderson"}
          </motion.h1>

          {/* University or Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[14px] mb-1"
            style={{ color: colors.textSecondary }}
          >
            {user?.role === "tutor" || user?.role === "admin"
              ? "Professional Tutor"
              : "University of California, Irvine"}
          </motion.p>

          {/* Major & Year or Subjects */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] mb-4"
            style={{ color: colors.textSecondary }}
          >
            {user?.role === "tutor" || user?.role === "admin"
              ? "Chemistry • Math • Physics"
              : "Computer Science • 2nd Year"}
          </motion.p>

          {/* Member Since Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="px-4 py-[6px] rounded-full"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <p className="text-[11px]" style={{ color: colors.textSecondary }}>Member since September 2023</p>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {/* Lessons Taken / Sessions Taught */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#51a2ff] to-[#155dfc] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "69" : "16"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Sessions Taught" : "Lessons Taken"}
              </p>
            </motion.div>

            {/* Hours Studied / Hours Taught */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c27aff] to-[#9810fa] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "103" : "24"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Hours Taught" : "Hours Studied"}
              </p>
            </motion.div>

            {/* Current GPA / Rating */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fb64b6] to-[#e60076] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "4.8" : "3.7"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Avg Rating" : "Current GPA"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 flex flex-col gap-5"
        >
          {/* Track Progress */}
          <Link to="/progress">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                  <TrendingUp className="w-5 h-5" style={{ color: accentColor.primary }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Track Progress</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.div>
          </Link>

          {/* Take Learning Style Quiz / Learning Style Result */}
          {learningStyle ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <Link to="/learning-quiz" className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor.primary}20` }}>
                  {learningStyle === "Visual" && <Eye className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Auditory" && <Ear className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Reading/Writing" && <BookOpen className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Kinesthetic" && <Hand className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Mixed" && <Layers className="w-5 h-5" style={{ color: accentColor.primary }} />}
                </div>
                <span className="text-[15px] font-medium truncate" style={{ color: colors.textPrimary }}>
                  {learningStyle} Learner
                </span>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/learning-quiz?retake=true">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.bgTertiary }}
                  >
                    <RefreshCw className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </motion.div>
                </Link>
                <Link to="/learning-quiz">
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <Link to="/learning-quiz">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Target className="w-5 h-5 text-[#AD46FF]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
                    Take Learning Style Quiz
                  </span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.div>
            </Link>
          )}

          {/* Your quiz Q&A — when user has completed the quiz and we have answers */}
          {learningStyle && (user?.learningStyleQuestionAnswers?.length ? (
            <QuizAnswersSection questionAnswers={user.learningStyleQuestionAnswers} colors={colors} accentColor={accentColor} />
          ) : user?.learningStyleAnswers && user.learningStyleAnswers.length > 0 ? (
            <QuizAnswersSection answers={user.learningStyleAnswers} colors={colors} accentColor={accentColor} />
          ) : null)}

          {/* Settings */}
          <Link to="/settings">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                  <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Settings</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.div>
          </Link>

          {/* Help & Support — expandable */}
          <div className="rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] overflow-hidden" style={{ backgroundColor: colors.bgCard }}>
            {/* Header row */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setHelpExpanded(v => !v)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                  <HelpCircle className="w-5 h-5 text-[#FF9500]" />
                </div>
                <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Help & Support</span>
              </div>
              <motion.div animate={{ rotate: helpExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.div>
            </motion.button>

            {/* Sub-items */}
            <AnimatePresence initial={false}>
              {helpExpanded && (
                <motion.div
                  key="help-items"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Divider */}
                  <div className="mx-4 h-px" style={{ backgroundColor: colors.borderPrimary }} />

                  {/* Contact Us */}
                  <motion.button
                    whileHover={{ backgroundColor: `${accentColor.primary}08` }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowContact(true)}
                    className="w-full px-4 py-3.5 flex items-center gap-4 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor.primary}18` }}>
                      <Mail className="w-4 h-4" style={{ color: accentColor.primary }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>Contact Us</p>
                      <p className="text-[12px]" style={{ color: colors.textSecondary }}>Get in touch with our support team</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  </motion.button>

                  {/* Divider */}
                  <div className="mx-4 h-px" style={{ backgroundColor: colors.borderPrimary }} />

                  {/* Submit Feedback */}
                  <motion.button
                    whileHover={{ backgroundColor: `${accentColor.primary}08` }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowFeedback(true)}
                    className="w-full px-4 py-3.5 flex items-center gap-4 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor.primary}18` }}>
                      <Lightbulb className="w-4 h-4" style={{ color: accentColor.primary }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>Submit Feedback</p>
                      <p className="text-[12px]" style={{ color: colors.textSecondary }}>Suggest a feature or improvement</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  </motion.button>

                  {/* Divider */}
                  <div className="mx-4 h-px" style={{ backgroundColor: colors.borderPrimary }} />

                  {/* Report a Bug */}
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(239,68,68,0.05)" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowBugReport(true)}
                    className="w-full px-4 py-3.5 flex items-center gap-4 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
                      <Bug className="w-4 h-4 text-[#ef4444]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>Report a Bug</p>
                      <p className="text-[12px]" style={{ color: colors.textSecondary }}>Let us know what went wrong</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  </motion.button>
                  {/* bottom padding inside card */}
                  <div className="h-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogoutClick}
            className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: colors.bgCard }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                <LogOut className="w-5 h-5 text-[#FF453A]" />
              </div>
              <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Logout</span>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Feedback modal */}
      <FormModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        title="Submit Feedback"
        subtitle="Suggestions & feature ideas"
        icon={<Lightbulb className="w-5 h-5" style={{ color: accentColor.primary }} />}
        iconBg={`${accentColor.primary}20`}
        fields={[
          { id: "title", label: "Title", placeholder: "e.g. Dark mode scheduling view", required: true },
          { id: "category", label: "Category", placeholder: "e.g. Calendar, Tutors, Canvas…" },
          { id: "description", label: "Description", placeholder: "Describe your idea or suggestion in detail…", multiline: true, required: true },
        ]}
        submitLabel="Send Feedback"
        onSubmit={values => {
          const existing = JSON.parse(localStorage.getItem("user_feedback_v1") || "[]");
          existing.push({ ...values, submittedAt: new Date().toISOString(), type: "feedback" });
          localStorage.setItem("user_feedback_v1", JSON.stringify(existing));
        }}
      />

      {/* Bug report modal */}
      <FormModal
        isOpen={showBugReport}
        onClose={() => setShowBugReport(false)}
        title="Report a Bug"
        subtitle="Help us squash it"
        icon={<Bug className="w-5 h-5 text-[#ef4444]" />}
        iconBg="rgba(239,68,68,0.14)"
        fields={[
          { id: "title", label: "Bug Summary", placeholder: "e.g. Calendar crashes on day view", required: true },
          { id: "steps", label: "Steps to Reproduce", placeholder: "1. Go to…\n2. Tap…\n3. See error", multiline: true, required: true },
          { id: "expected", label: "Expected Behaviour", placeholder: "What should have happened?" },
        ]}
        submitLabel="Submit Bug Report"
        onSubmit={values => {
          const existing = JSON.parse(localStorage.getItem("user_feedback_v1") || "[]");
          existing.push({ ...values, submittedAt: new Date().toISOString(), type: "bug" });
          localStorage.setItem("user_feedback_v1", JSON.stringify(existing));
        }}
      />

      {/* Contact Us modal */}
      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />
    </div>
  );
}