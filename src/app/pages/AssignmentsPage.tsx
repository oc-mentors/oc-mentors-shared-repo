import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full flex flex-col flex-1 overflow-hidden">
        <div className="px-6 pt-12 pb-3 flex-shrink-0">
          <div className="flex items-center gap-4 mb-6">
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
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                Assignments
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                Socratic OC
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl p-8 border text-center"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              No assignments yet
            </p>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage="progress" />
    </div>
  );
}
