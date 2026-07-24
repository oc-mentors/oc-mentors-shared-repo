import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Filter } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const announcements: {
  id: number;
  courseName: string;
  courseColor: string;
  title: string;
  content: string;
  timestamp: string;
  date: string;
}[] = [];

export default function AnnouncementsPage() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const handleListScroll = () => {
    if (listContainerRef.current) {
      setShowTopFade(listContainerRef.current.scrollTop > 0);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full flex flex-col flex-1 overflow-hidden">
        <div className="px-6 pt-12 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors.bgCard }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Announcements</h1>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                  Socratic OC
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(!showFilter)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accentColor.primary }}
            >
              <Filter className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence>
            {showTopFade && (
              <motion.div
                key="top-fade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${colors.bgPrimary} 0%, transparent 100%)`,
                }}
              />
            )}
          </AnimatePresence>

          <div
            ref={listContainerRef}
            onScroll={handleListScroll}
            className="h-full overflow-y-auto px-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-8 border text-center"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No announcements yet
                  </p>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentPage="progress" />
    </div>
  );
}
