import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Users, Clock, DollarSign, Star } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export default function TutorAnalyticsPage() {
  const navigate = useNavigate();

  const monthlyEarnings = [
    { month: "Jan", amount: 1840 },
    { month: "Feb", amount: 2150 },
    { month: "Mar", amount: 1920 },
    { month: "Apr", amount: 2400 },
    { month: "May", amount: 2280 },
    { month: "Jun", amount: 2650 },
  ];

  const maxEarning = Math.max(...monthlyEarnings.map(e => e.amount));

  const subjectStats = [
    { subject: "Chemistry", sessions: 24, hours: 36, rating: 4.8 },
    { subject: "Math", sessions: 18, hours: 27, rating: 4.9 },
    { subject: "Physics", sessions: 15, hours: 22.5, rating: 4.7 },
    { subject: "Biology", sessions: 12, hours: 18, rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">Analytics</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">$2,650</p>
              <p className="text-xs text-[#a8b3cf]">This Month</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">69</p>
              <p className="text-xs text-[#a8b3cf]">Total Sessions</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">103.5</p>
              <p className="text-xs text-[#a8b3cf]">Total Hours</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#fcd34d] flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">4.8</p>
              <p className="text-xs text-[#a8b3cf]">Avg Rating</p>
            </motion.div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="px-6 mb-6">
          <div className="bg-[#1e2139] rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#e8edf5]">Monthly Earnings</h2>
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-32 mb-3">
              {monthlyEarnings.map((item, index) => (
                <motion.div
                  key={item.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.amount / maxEarning) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-[#4361d9] to-[#5b7ceb] rounded-t-lg relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2f45] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <p className="text-xs text-[#e8edf5] font-semibold">${item.amount}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              {monthlyEarnings.map((item) => (
                <p key={item.month} className="text-xs text-[#a8b3cf]">
                  {item.month}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-[#e8edf5] mb-4">Subject Breakdown</h2>
          <div className="space-y-3">
            {subjectStats.map((stat, index) => (
              <motion.div
                key={stat.subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-[#e8edf5]">{stat.subject}</h3>
                  <div className="flex items-center gap-1 bg-[#2a2f45] px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                    <span className="text-xs font-semibold text-[#e8edf5]">{stat.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#a8b3cf] mb-1">Sessions</p>
                    <p className="text-lg font-bold text-[#e8edf5]">{stat.sessions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a8b3cf] mb-1">Hours</p>
                    <p className="text-lg font-bold text-[#e8edf5]">{stat.hours}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-[#2a2f45] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.sessions / 24) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#4361d9] to-[#5b7ceb]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav currentPage="home" />
    </div>
  );
}
