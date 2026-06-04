import { LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useTheme } from "../contexts/ThemeContext";

type CanvasLogoutButtonProps = {
  className?: string;
  variant?: "card" | "inline";
};

export function CanvasLogoutButton({ className = "", variant = "card" }: CanvasLogoutButtonProps) {
  const { isCanvasConnected, disconnectCanvas } = useCanvasAuth();
  const { colors } = useTheme();

  if (!isCanvasConnected) return null;

  const handleLogout = () => {
    const ok = window.confirm(
      "Log out of Canvas? Courses and assignments synced on this device will be cleared until you sign in again."
    );
    if (ok) disconnectCanvas();
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={`inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-2 hover:underline ${className}`}
        style={{ color: "#e13f2b" }}
      >
        <LogOut className="w-3.5 h-3.5" />
        Log out of Canvas
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[14px] font-semibold ${className}`}
      style={{
        backgroundColor: colors.bgCard,
        borderColor: "rgba(225, 63, 43, 0.35)",
        color: "#e13f2b",
      }}
    >
      <LogOut className="w-4 h-4" />
      Log out of Canvas
    </motion.button>
  );
}
