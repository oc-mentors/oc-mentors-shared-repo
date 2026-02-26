import { useNavigate } from "react-router";
import { ArrowLeft, Check, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme, accentColors } from "../contexts/ThemeContext";
import { BottomNav } from "../components/BottomNav";
import { useState } from "react";

export default function ThemeCustomizationPage() {
  const navigate = useNavigate();
  const { mode, accentColor, setMode, setAccentColor, colors } = useTheme();
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSaveChanges = () => {
    // Theme changes are automatically saved via ThemeContext
    // Show success message
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/settings")}
              className="transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Appearance</h1>
          </div>
        </div>

        <div className="px-6">
          {/* Theme Mode Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Theme Mode
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Dark Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("dark")}
                className={`relative rounded-2xl p-5 border-2 transition-all`}
                style={{
                  borderColor: mode === "dark" ? accentColor.primary : colors.borderSecondary,
                  backgroundColor: mode === "dark" ? `${accentColor.primary}20` : colors.bgCard,
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: mode === "dark" ? accentColor.primary : colors.bgTertiary,
                  }}>
                    <Moon className={`w-7 h-7`} style={{
                      color: mode === "dark" ? "white" : colors.textSecondary,
                    }} />
                  </div>
                  <span className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>
                    Dark
                  </span>
                </div>
                <AnimatePresence>
                  {mode === "dark" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor.primary }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Light Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("light")}
                className={`relative rounded-2xl p-5 border-2 transition-all`}
                style={{
                  borderColor: mode === "light" ? accentColor.primary : colors.borderSecondary,
                  backgroundColor: mode === "light" ? `${accentColor.primary}20` : colors.bgCard,
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: mode === "light" ? accentColor.primary : colors.bgTertiary,
                  }}>
                    <Sun className={`w-7 h-7`} style={{
                      color: mode === "light" ? "white" : colors.textSecondary,
                    }} />
                  </div>
                  <span className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>
                    Light
                  </span>
                </div>
                <AnimatePresence>
                  {mode === "light" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor.primary }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Accent Color Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Accent Color
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {accentColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccentColor(color)}
                  className="relative"
                >
                  <div
                    className="w-full aspect-square rounded-2xl shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color.primary}, ${color.primary}dd)`,
                    }}
                  >
                    <AnimatePresence>
                      {accentColor.name === color.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-6 h-6" style={{ color: color.primary }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-center text-sm font-medium mt-2" style={{ color: colors.textPrimary }}>
                    {color.name}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Preview
            </h2>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
              <div
                className="w-full h-12 rounded-xl shadow-md mb-3"
                style={{
                  background: `linear-gradient(to right, ${accentColor.primary}ee, ${accentColor.primary})`,
                }}
              />
              <div className="flex gap-2">
                <div
                  className="flex-1 h-8 rounded-lg opacity-70"
                  style={{ backgroundColor: accentColor.primary }}
                />
                <div
                  className="flex-1 h-8 rounded-lg opacity-50"
                  style={{ backgroundColor: accentColor.primary }}
                />
                <div
                  className="flex-1 h-8 rounded-lg opacity-30"
                  style={{ backgroundColor: accentColor.primary }}
                />
              </div>
              <p className="text-xs text-center mt-4" style={{ color: colors.textSecondary }}>
                This is how your accent color will look throughout the app
              </p>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="mb-6">
            <motion.button
              onClick={handleSaveChanges}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white font-bold py-3 rounded-2xl transition-colors"
              style={{ backgroundColor: accentColor.primary }}
              onMouseEnter={(e) => {
                const hex = accentColor.primary;
                // Darken the color slightly on hover
                e.currentTarget.style.filter = "brightness(0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
              Save Changes
            </motion.button>
            <AnimatePresence>
              {showSavedMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm mt-2"
                  style={{ color: accentColor.primary }}
                >
                  ✓ Changes saved successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomNav currentPage="profile" />
    </div>
  );
}