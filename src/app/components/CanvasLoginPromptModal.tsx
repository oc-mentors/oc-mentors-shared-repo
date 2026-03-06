import { motion, AnimatePresence } from "motion/react";
import { X, Lock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router";
import { useScrollLock } from "../hooks/useScrollLock";

interface CanvasLoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CanvasLoginPromptModal({ isOpen, onClose }: CanvasLoginPromptModalProps) {
  const { colors, accentColor } = useTheme();
  const navigate = useNavigate();
  useScrollLock(isOpen);

  const handleLogin = () => {
    onClose();
    navigate("/canvas-login");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
            style={{
              backgroundColor: colors.bgCard,
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#e13f2b20" }}
                >
                  <Lock className="w-5 h-5" style={{ color: "#e13f2b" }} />
                </div>
                <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
                  Canvas Login Required
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary }}
              >
                <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Canvas Logo */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-[#e13f2b] flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="white">
                    <path d="M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2ZM21 20H3V4H21V20Z" />
                    <path d="M7 17H9V7H7V17ZM11 17H13V7H11V17ZM15 17H17V7H15V17Z" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-2">
                <p className="text-[16px] font-medium" style={{ color: colors.textPrimary }}>
                  Connect Your Canvas Account
                </p>
                <p className="text-[14px]" style={{ color: colors.textSecondary }}>
                  You need to sign in to Canvas to access your courses, assignments, and announcements.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                  style={{
                    backgroundColor: colors.bgTertiary,
                    color: colors.textPrimary,
                  }}
                  type="button"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                  style={{ 
                    backgroundColor: "#e13f2b",
                  }}
                  type="button"
                >
                  Sign In to Canvas
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}