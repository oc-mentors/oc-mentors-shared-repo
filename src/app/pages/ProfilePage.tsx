import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Target, Settings, ChevronRight, HelpCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-ncbm4ttepm";

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    const previousPage = localStorage.getItem("previousPageBeforeProfile");
    if (previousPage) {
      navigate(previousPage);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with Back Button */}
        <div className="px-6 pt-3 pb-2">
          <Link to="/profile">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#1e2139] flex items-center justify-center shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-[#e8edf5]" />
            </motion.button>
          </Link>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-8 pb-8 flex flex-col items-center"
        >
          {/* Profile Image with Edit Badge */}
          <div className="relative mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1729691031378-d63d7e81bb38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHlvdW5nJTIwd29tYW4lMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTI5Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nora Anderson"
                className="w-[130px] h-[130px] rounded-3xl object-cover shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
            {/* Edit Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-to-br from-[#4361d9] to-[#7c98f2] rounded-2xl shadow-[0px_4px_24px_0px_rgba(91,124,235,0.25)] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18">
                <path
                  d={svgPaths.p1252e600}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.67"
                />
              </svg>
            </motion.div>
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[30px] font-bold text-[#e8edf5] mb-2"
          >
            Nora Anderson
          </motion.h1>

          {/* University */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[14px] text-[#a8b3cf] mb-1"
          >
            University of California, Irvine
          </motion.p>

          {/* Major & Year */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] text-[#a8b3cf] mb-4"
          >
            Computer Science • 2nd Year
          </motion.p>

          {/* Member Since Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-[#2a2f4a] px-4 py-[6px] rounded-full"
          >
            <p className="text-[11px] text-[#a8b3cf]">Member since September 2023</p>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {/* Lessons Taken */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#51a2ff] to-[#155dfc] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">16</span>
              </div>
              <p className="text-[11px] text-[#a8b3cf] leading-tight text-center">
                Lessons Taken
              </p>
            </motion.div>

            {/* Hours Studied */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c27aff] to-[#9810fa] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">24</span>
              </div>
              <p className="text-[11px] text-[#a8b3cf] leading-tight text-center">
                Hours Studied
              </p>
            </motion.div>

            {/* Current GPA */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fb64b6] to-[#e60076] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">3.7</span>
              </div>
              <p className="text-[11px] text-[#a8b3cf] leading-tight text-center">
                Current GPA
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 space-y-3"
        >
          {/* Track Progress */}
          <Link to="/progress">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#2a2f4a] rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#2B7FFF]" />
                </div>
                <span className="text-[15px] font-medium text-[#e8edf5]">Track Progress</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
            </motion.div>
          </Link>

          {/* Take Learning Style Quiz */}
          <Link to="/learning-quiz">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#2a2f4a] rounded-2xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#AD46FF]" />
                </div>
                <span className="text-[15px] font-medium text-[#e8edf5]">
                  Take Learning Style Quiz
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
            </motion.div>
          </Link>

          {/* Settings */}
          <Link to="/settings">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#2a2f4a] rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#6A7282]" />
                </div>
                <span className="text-[15px] font-medium text-[#e8edf5]">Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
            </motion.div>
          </Link>

          {/* Help & Support */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-[#2a2f4a] rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#FF9500]" />
              </div>
              <span className="text-[15px] font-medium text-[#e8edf5]">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}