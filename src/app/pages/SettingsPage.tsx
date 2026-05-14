import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import svgPaths from "../../imports/svg-2ctauirw4p";
import { EditProfileModal } from "../components/EditProfileModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronRight, ChevronDown, Bell, Mail, Globe, Moon, Sun, Eye, Ear, BookOpen, Hand, Layers, Target, RefreshCw, Contrast, Type } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { LEARNING_STYLE_QUIZ_QUESTIONS, getQuizAnswerText } from "../lib/learningStyleQuiz";
import { db, firestoreReady } from "../lib/firebase";
import type { TutorProfileDoc } from "../types/firestore";
import { doc, getDocFromServer } from "firebase/firestore";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const { mode, accentColor, colors, highContrast, dyslexiaFont, setHighContrast, setDyslexiaFont } = useTheme();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [quizAnswersExpanded, setQuizAnswersExpanded] = useState(false);
  const [tutorProfile, setTutorProfile] = useState<TutorProfileDoc | null>(null);
  const [tutorQuizExpanded, setTutorQuizExpanded] = useState(false);

  const learningStyle = user?.learningStyle ?? (typeof localStorage !== "undefined" ? localStorage.getItem("learningStyleResult") : null);
  const hasQuizAnswers = !!(user?.learningStyleQuestionAnswers?.length ?? (user?.learningStyleAnswers?.length ?? 0));
  const quizItems = user?.learningStyleQuestionAnswers?.length
    ? user.learningStyleQuestionAnswers.map((qa, i) => ({ key: i, question: qa.question, answer: qa.answer }))
    : (user?.learningStyleAnswers ?? []).map((_, i) => ({
        key: i,
        question: LEARNING_STYLE_QUIZ_QUESTIONS[i]?.question ?? "",
        answer: getQuizAnswerText(i, user?.learningStyleAnswers?.[i] ?? -1) || "—",
      }));

  useEffect(() => {
    if (!user?.id || user.role !== "tutor" || !db) {
      setTutorProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      await firestoreReady;
      if (cancelled || !db) return;
      try {
        const ref = doc(db, "tutorProfiles", user.id);
        const snap = await getDocFromServer(ref);
        if (!cancelled && snap.exists()) {
          setTutorProfile(snap.data() as TutorProfileDoc);
        }
      } catch (e) {
        console.warn("[Settings] Failed to load tutor profile for quiz summary:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with back arrow */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </motion.button>
            <div className="flex-1 text-center mr-10">
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
                Settings
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                Socratic OC
              </p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="px-6">
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Account
            </h2>
            <div className="space-y-3">
              {/* Edit Profile */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
                onClick={() => setShowEditProfileModal(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip-user)">
                        <circle cx="10" cy="10" r="8.33" stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="10" cy="8.33" r="2.5" stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p327551d3} stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip-user">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>

              {/* Year & Major (students) – edit via Edit Profile */}
              {(user?.role === "student" || !user?.role) && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between text-left"
                  style={{ backgroundColor: colors.bgCard }}
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: colors.textSecondary }}>Year & Major(s)</p>
                    <p className="text-[15px] font-medium truncate" style={{ color: colors.textPrimary }}>
                      {user?.year || user?.major?.length
                        ? [user?.year, user?.major?.join(", ")].filter(Boolean).join(" • ") || "Not set"
                        : "Add your year and major(s)"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: colors.textSecondary }} />
                </motion.button>
              )}

              {/* Change Password */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
                onClick={() => setShowChangePasswordModal(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip-lock)">
                        <rect x="2.5" y="9.17" width="15" height="9.17" rx="1.67" stroke="#AD46FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p16b5f400} stroke="#AD46FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip-lock">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>


              {/* Academic Information */}
              <Link to="/academic-info">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                        <g clipPath="url(#clip-academic)">
                          <path d={svgPaths.p2004c080} stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.33 8.33V13.33" stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={svgPaths.p916cd00} stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip-academic">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Academic Information</span>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Notifications
            </h2>
            <div className="space-y-3">
              {/* Push Notifications */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Bell className="w-5 h-5 text-[#FF9500]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Push Notifications</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: pushNotifications ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: pushNotifications ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>

              {/* Email Updates */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Mail className="w-5 h-5 text-[#34C759]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Email Updates</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: emailUpdates ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: emailUpdates ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Preferences
            </h2>
            <div className="space-y-3">
              {/* Language */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Globe className="w-5 h-5" style={{ color: accentColor.primary }} />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px]" style={{ color: colors.textSecondary }}>English</span>
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </div>
              </motion.button>

              {/* Theme */}
              <Link to="/theme-customization">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                      {mode === "dark" ? (
                        <Moon className="w-5 h-5" style={{ color: accentColor.primary }} />
                      ) : (
                        <Sun className="w-5 h-5" style={{ color: accentColor.primary }} />
                      )}
                    </div>
                    <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Appearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full shadow-md"
                      style={{ backgroundColor: accentColor.primary }}
                    />
                    <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  </div>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Accessibility (matches marketing profile toggles) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Accessibility
            </h2>
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Contrast className="w-5 h-5" style={{ color: accentColor.primary }} />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
                    High contrast
                  </span>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHighContrast(!highContrast)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: highContrast ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: highContrast ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Type className="w-5 h-5" style={{ color: accentColor.primary }} />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
                    Dyslexia-friendly font (Lexend)
                  </span>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: dyslexiaFont ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: dyslexiaFont ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage="profile" />
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}