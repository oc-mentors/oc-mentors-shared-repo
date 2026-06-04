import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
  MapPin,
  Copy,
} from "lucide-react";
import { useDemoMode } from "../contexts/DemoModeContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

/** Inline demo guide card — sits at the end of the page scroll, not fixed on screen. */
export function DemoGuidePanel() {
  const {
    isStarting,
    step,
    stepIndex,
    totalSteps,
    socraticMessage,
    nextStep,
    prevStep,
    goToStep,
    exitExpoDemo,
  } = useDemoMode();
  const { colors } = useTheme();

  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const isSocraticStep = step.id === "study-tutor";
  const isLast = stepIndex >= totalSteps - 1;

  const copySocratic = async () => {
    try {
      await navigator.clipboard.writeText(socraticMessage);
      toast.success("Copied — paste in the Tutor tab and send");
    } catch {
      toast.message(socraticMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 26, stiffness: 280 }}
      className="w-full px-4 pt-4 pb-[max(5.5rem,env(safe-area-inset-bottom))]"
      style={{ backgroundColor: colors.bgPrimary }}
      role="dialog"
      aria-label="Demo guide"
    >
      <div
        className="max-w-md mx-auto rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1e2139 0%, #141824 100%)",
          borderColor: "rgba(91, 124, 235, 0.35)",
          boxShadow: "0 8px 40px rgba(91, 124, 235, 0.2)",
        }}
      >
        <div className="h-1 bg-[#2a3148]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4361d9] to-[#8b5cf6]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4361d9] to-[#8b5cf6] flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#8b9fd4]">
                  Demo · Step {stepIndex + 1} of {totalSteps}
                </p>
                <h3 className="text-base font-bold text-[#e8edf5] truncate">{step.title}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={exitExpoDemo}
              className="w-8 h-8 rounded-full bg-[#2a3148] flex items-center justify-center shrink-0"
              aria-label="Exit demo"
            >
              <X className="w-4 h-4 text-[#a8b3cf]" />
            </button>
          </div>

          {isStarting ? (
            <p className="text-sm text-[#a8b3cf] py-4 text-center">Signing in as Maya…</p>
          ) : (
            <>
              <p className="text-sm text-[#e8edf5] leading-relaxed mb-2">{step.pitch}</p>
              {step.hint && (
                <p className="text-xs text-[#a8b3cf] bg-[#252b42] rounded-xl px-3 py-2.5 mb-3 border border-[#3d4668] leading-relaxed">
                  {step.hint}
                </p>
              )}
              {isSocraticStep && (
                <button
                  type="button"
                  onClick={copySocratic}
                  className="w-full mb-1 flex items-center gap-2 text-left text-xs text-[#e8edf5] bg-[#252b42] rounded-xl px-3 py-2.5 border border-[#4361d9]/40"
                >
                  <Copy className="w-3.5 h-3.5 shrink-0 text-[#5b7ceb]" />
                  <span className="line-clamp-2">{socraticMessage}</span>
                </button>
              )}
            </>
          )}
        </div>

        {!isStarting && (
          <div className="px-4 pb-4 flex items-center gap-2">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={prevStep}
              className="w-11 h-11 rounded-xl bg-[#2a3148] flex items-center justify-center disabled:opacity-30"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5 text-[#e8edf5]" />
            </button>
            <button
              type="button"
              onClick={() => goToStep(stepIndex)}
              className="flex-1 h-11 rounded-xl bg-[#2a3148] text-[#e8edf5] text-sm font-semibold flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-[#5b7ceb]" />
              Show screen
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-[1.2] h-11 rounded-xl bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] text-white text-sm font-bold flex items-center justify-center gap-1"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
