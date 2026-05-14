import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

export function LogoutAnimation() {
  const { colors } = useTheme();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ backgroundColor: colors.bgPrimary }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
    >
      <div className="max-w-md w-full text-center">

        {/* Circle + wave icon */}
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
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "#FF453A" }}
            />

            {/* Main circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FF453A, #FF6B6B)",
                boxShadow: "0 0 48px rgba(255, 69, 58, 0.45)",
              }}
            />

            {/* Waving hand emoji rendered as SVG path / text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span
                className="text-4xl select-none"
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ delay: 0.35, duration: 0.7, ease: "easeInOut" }}
              >
                👋
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl font-bold mb-1.5" style={{ color: colors.textPrimary }}>
            See you soon!
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            You've been signed out of Socratic OC
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
