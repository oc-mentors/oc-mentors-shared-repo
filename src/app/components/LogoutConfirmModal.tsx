import { motion, AnimatePresence } from "motion/react";
import { LogOut, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useScrollLock } from "../hooks/useScrollLock";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  const { colors, accentColor } = useTheme();
  useScrollLock(isOpen);

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: colors.bgCard,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, #FF453A20 0%, #FF453A05 100%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Content */}
              <div className="relative p-6 pb-5">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
                  style={{ backgroundColor: colors.borderPrimary }}
                >
                  <X className="w-4 h-4" style={{ color: colors.textPrimary }} />
                </motion.button>

                {/* Icon with animation */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      damping: 15, 
                      stiffness: 200,
                      delay: 0.1 
                    }}
                    className="relative"
                  >
                    {/* Pulsing background circles */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: "#FF453A" }}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <motion.div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FF453A20" }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        animate={{ 
                          x: [0, 3, 0],
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <LogOut className="w-10 h-10 text-[#FF453A]" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-2 mb-6"
                >
                  <h2 className="text-[24px] font-bold" style={{ color: colors.textPrimary }}>
                    Logout?
                  </h2>
                  <p className="text-[15px]" style={{ color: colors.textSecondary }}>
                    Are you sure you want to logout? You'll need to sign in again to access your account.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl font-bold text-[16px] border-2"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderPrimary,
                    }}
                    type="button"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 24px rgba(255, 69, 58, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="flex-1 py-4 rounded-2xl font-bold text-[16px] shadow-lg relative overflow-hidden"
                    style={{ 
                      backgroundColor: "#FF453A",
                      color: "white",
                    }}
                    type="button"
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      }}
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative z-10">Yes, Logout</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}