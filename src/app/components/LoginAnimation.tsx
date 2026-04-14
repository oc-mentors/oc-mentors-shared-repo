import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export function LoginAnimation() {
  const { colors, accentColor } = useTheme();
  const { user, loginAnimationMode } = useAuth();

  const raw = user?.firstName || user?.name?.split(" ")[0] || "there";
  const firstName = raw && raw !== "User" && raw !== "user" ? raw : "there";
  const isSignup = loginAnimationMode === "signup";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ backgroundColor: colors.bgPrimary }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
    >
      <div className="max-w-md w-full text-center">

        {/* Circle + checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="relative w-32 h-32 mx-auto mb-6">

            {/* Outer glow ring — expands and fades */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${accentColor.gradient}`}
            />

            {/* Main circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${accentColor.gradient}`}
              style={{ boxShadow: `0 0 48px ${colors.accent}55` }}
            />

            {/* Checkmark */}
            <svg
              className="absolute inset-0 w-full h-full p-8"
              viewBox="0 0 52 52"
              fill="none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl font-bold mb-1.5" style={{ color: colors.textPrimary }}>
            {isSignup ? `Welcome, ${firstName}!` : `Welcome back, ${firstName}!`}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {isSignup ? "Let's get you set up…" : "Taking you to your dashboard…"}
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}