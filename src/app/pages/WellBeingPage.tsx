import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wind, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { BottomNav } from "../components/BottomNav";
import { useTheme } from "../contexts/ThemeContext";
import { BionicText } from "../components/BionicText";

const PHASE_LABELS = ["Breathe in", "Hold", "Breathe out", "Hold"] as const;
const PHASE_SECONDS = 4;
const breatheScales = [1.18, 1.18, 0.88, 0.88] as const;

/** Optional breathing + quiet meditation — not medical advice. */
export default function WellBeingPage() {
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();
  const [tab, setTab] = useState<"breathe" | "meditate">("breathe");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [breathCountdown, setBreathCountdown] = useState(PHASE_SECONDS);
  const [breathingActive, setBreathingActive] = useState(false);
  const [meditationSeconds, setMeditationSeconds] = useState(120);
  const [meditationRunning, setMeditationRunning] = useState(false);

  useEffect(() => {
    if (!breathingActive) return;
    const id = window.setInterval(() => {
      setBreathCountdown((c) => {
        if (c > 1) return c - 1;
        setPhaseIndex((i) => (i + 1) % PHASE_LABELS.length);
        return PHASE_SECONDS;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [breathingActive]);

  const scale = tab === "breathe" && breathingActive ? breatheScales[phaseIndex] : 1;

  useEffect(() => {
    if (!meditationRunning || tab !== "meditate") return;
    const id = window.setInterval(() => {
      setMeditationSeconds((s) => {
        if (s <= 1) {
          setMeditationRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [meditationRunning, tab]);

  const stopBreathing = () => {
    setBreathingActive(false);
    setPhaseIndex(0);
    setBreathCountdown(PHASE_SECONDS);
  };

  return (
    <div className="min-h-screen overflow-auto pb-24" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto px-6 pt-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bgTertiary }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            <BionicText text="Calm space" />
          </h1>
        </div>

        <p className="text-[13px] leading-relaxed mb-6 rounded-xl p-3 border" style={{ color: colors.textSecondary, backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}>
          <BionicText text="These exercises are general wellness suggestions. Anyone can use them. They are not medical treatment — reach out to a professional or crisis line if you need urgent support." />
        </p>

        <div className="flex rounded-2xl p-1 mb-8" style={{ backgroundColor: colors.bgTertiary }}>
          <button
            type="button"
            onClick={() => setTab("breathe")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: tab === "breathe" ? colors.bgCard : "transparent",
              color: tab === "breathe" ? colors.textPrimary : colors.textSecondary,
              boxShadow: tab === "breathe" ? "0 2px 8px rgba(0,0,0,0.12)" : undefined,
            }}
          >
            <Wind className="w-4 h-4" />
            <BionicText text="Breathing" />
          </button>
          <button
            type="button"
            onClick={() => setTab("meditate")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: tab === "meditate" ? colors.bgCard : "transparent",
              color: tab === "meditate" ? colors.textPrimary : colors.textSecondary,
              boxShadow: tab === "meditate" ? "0 2px 8px rgba(0,0,0,0.12)" : undefined,
            }}
          >
            <Sparkles className="w-4 h-4" />
            <BionicText text="Quiet time" />
          </button>
        </div>

        {tab === "breathe" && (
          <div className="rounded-2xl p-6 border text-center" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
            <p className="text-[15px] font-medium mb-4" style={{ color: colors.textPrimary }}>
              <BionicText text="Box breathing — follow the circle. Each phase lasts four seconds; use the countdown to stay in sync." />
            </p>
            <div className="flex flex-col items-center mb-6">
              <motion.div
                key={phaseIndex}
                initial={false}
                animate={{ scale }}
                transition={{ duration: PHASE_SECONDS, ease: "easeInOut" }}
                className="w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-semibold text-center px-3"
                style={{ backgroundColor: accentColor.primary }}
              >
                {breathingActive ? (
                  <>
                    <BionicText
                      text={PHASE_LABELS[phaseIndex]}
                      className="text-[11px] font-medium uppercase tracking-wide opacity-90 mb-2 block text-white"
                    />
                    <span className="text-5xl font-bold tabular-nums leading-none">{breathCountdown}</span>
                  </>
                ) : (
                  <BionicText text="Tap start" className="text-sm font-medium block text-center text-white" />
                )}
              </motion.div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (breathingActive) stopBreathing();
                else {
                  setPhaseIndex(0);
                  setBreathCountdown(PHASE_SECONDS);
                  setBreathingActive(true);
                }
              }}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: accentColor.primary }}
            >
              {breathingActive ? <BionicText text="Stop" /> : <BionicText text="Start" />}
            </button>
          </div>
        )}

        {tab === "meditate" && (
          <div className="rounded-2xl p-6 border space-y-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
            <p className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
              <BionicText text="Two-minute quiet sit" />
            </p>
            <ol className="text-[14px] space-y-2 list-decimal pl-5" style={{ color: colors.textSecondary }}>
              <li>
                <BionicText text="Sit comfortably; soften your shoulders." />
              </li>
              <li>
                <BionicText text="Pick one neutral focus (breath at the nose, or sounds far away)." />
              </li>
              <li>
                <BionicText text='When thoughts wander, label them "thinking" and return gently.' />
              </li>
            </ol>
            <div className="text-center py-4">
              <span className="text-4xl font-bold tabular-nums inline-block" style={{ color: colors.textPrimary }}>
                {meditationSeconds === 0 ? (
                  <BionicText text="Done" />
                ) : (
                  <BionicText
                    text={`${Math.floor(meditationSeconds / 60)}:${(meditationSeconds % 60).toString().padStart(2, "0")}`}
                    className="text-4xl font-bold tabular-nums"
                  />
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMeditationRunning((r) => !r)}
                className="flex-1 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: accentColor.primary }}
              >
                {meditationRunning ? <BionicText text="Pause" /> : <BionicText text="Start timer" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeditationRunning(false);
                  setMeditationSeconds(120);
                }}
                className="py-3 px-4 rounded-xl font-medium border"
                style={{ borderColor: colors.borderSecondary, color: colors.textPrimary }}
              >
                <BionicText text="Reset" />
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav currentPage="profile" />
    </div>
  );
}
