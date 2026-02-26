import { motion } from "motion/react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  size?: "sm" | "md";
}

export function ToggleSwitch({ checked, onChange, size = "md" }: ToggleSwitchProps) {
  const dimensions = size === "sm" ? { w: 12, h: 7, ball: 5, translate: 20 } : { w: 14, h: 8, ball: 6, translate: 24 };
  
  return (
    <button
      onClick={onChange}
      className={`relative rounded-full transition-colors`}
      style={{
        width: `${dimensions.w * 4}px`,
        height: `${dimensions.h * 4}px`,
        backgroundColor: checked ? "#5b7ceb" : "#2a2f45",
      }}
    >
      <motion.div
        className="absolute top-1 left-1 bg-white rounded-full shadow-md"
        style={{
          width: `${dimensions.ball * 4}px`,
          height: `${dimensions.ball * 4}px`,
        }}
        animate={{ x: checked ? dimensions.translate : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
