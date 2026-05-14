import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  HelpCircle,
  UserCheck,
  Palette,
  LayoutGrid,
  ClipboardList,
  Zap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { BottomNav } from "../components/BottomNav";

const FEATURES = [
  {
    title: "Guided questions",
    desc: "Socratic style prompts to deepen understanding.",
    Icon: HelpCircle,
  },
  {
    title: "Learning differences",
    desc: "Support tailored to how you learn best.",
    Icon: UserCheck,
  },
  {
    title: "Learning styles",
    desc: "Visual, auditory, reading, and hands on paths.",
    Icon: Palette,
  },
  {
    title: "Canvas friendly",
    desc: "Keep assignments and deadlines in view.",
    Icon: LayoutGrid,
  },
  {
    title: "Quiz and test support",
    desc: "Targeted review and confidence building.",
    Icon: ClipboardList,
  },
  {
    title: "Active problem solving",
    desc: "Practice with mentors who push thinking, not answers.",
    Icon: Zap,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    navigate(isAuthenticated ? "/home" : "/login");
  };

  return (
    <div className={isAuthenticated ? "min-h-screen pb-24" : "min-h-screen pb-8"} style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto px-6">
        <div className="flex items-center justify-between min-h-[4rem] pt-12 pb-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bgTertiary }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
          <h1 className="flex-1 text-center text-lg font-bold px-2" style={{ color: colors.textPrimary }}>
            Overview
          </h1>
          <div className="w-10 shrink-0" aria-hidden />
        </div>

        <div className="space-y-12 pb-4">
          <header className="text-center space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: colors.textSecondary }}>
              Socratic OC
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: colors.textPrimary }}>
              Reach your{" "}
              <span style={{ color: accentColor.primary }}>full potential</span> with the right mentor.
            </h2>
            <p className="text-base" style={{ color: colors.textSecondary }}>
              Personalized tutoring for Orange County students, built around how you learn, not one size fits all
              lectures.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2">
              {!isAuthenticated && (
                <Link to="/login">
                  <motion.span
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-white"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    Sign in or create account
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              )}
              <Link
                to="/privacy"
                className="text-sm font-medium underline underline-offset-[5px] hover:opacity-90"
                style={{ color: accentColor.primary }}
              >
                Privacy policy
              </Link>
            </div>
          </header>

          <section
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <h2 className="text-xl font-bold mb-3 text-center" style={{ color: colors.textPrimary }}>
              Our mission
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Education is more than memorization. It is transformation! We start by understanding how each student
              learns best, then match you with mentors who teach in that style.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-center mb-2" style={{ color: colors.textPrimary }}>
              What you get
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: colors.textSecondary }}>
              Tools and people in one place: notes, community, scheduling, and Canvas aware workflows in the app.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(({ title, desc, Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl p-4 border"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: colors.bgTertiary }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accentColor.primary }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center space-y-3 pb-8">
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Ready to get matched?
            </p>
            {isAuthenticated ? (
              <Link to="/learning-quiz" className="text-sm font-semibold underline" style={{ color: accentColor.primary }}>
                Review or retake your learning style quiz
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-semibold underline" style={{ color: accentColor.primary }}>
                Create a free account
              </Link>
            )}
          </section>
        </div>
      </div>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
