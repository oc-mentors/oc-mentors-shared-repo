import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function LogoutAnimation() {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#FF453A]"
          style={{ width: "120px", height: "120px", left: "-10px", top: "-10px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle pulsing circle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "#FF453A", opacity: 0.2, width: "100px", height: "100px" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center icon container */}
        <motion.div
          className="w-[100px] h-[100px] rounded-full bg-[#FF453A] flex items-center justify-center relative z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          <motion.div
            animate={{ 
              x: [0, 5, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <LogOut className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Text below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-[130px] left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <p className="text-[18px] font-semibold" style={{ color: colors.textPrimary }}>
            Logging out...
          </p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#FF453A]"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
