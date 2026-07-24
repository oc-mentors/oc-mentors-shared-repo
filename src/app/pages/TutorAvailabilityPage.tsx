import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Plus, X, Clock, Check } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export default function TutorAvailabilityPage() {
  const navigate = useNavigate();
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const [availability, setAvailability] = useState({
    Monday: [] as { start: string; end: string }[],
    Tuesday: [] as { start: string; end: string }[],
    Wednesday: [] as { start: string; end: string }[],
    Thursday: [] as { start: string; end: string }[],
    Friday: [] as { start: string; end: string }[],
    Saturday: [] as { start: string; end: string }[],
    Sunday: [] as { start: string; end: string }[],
  });

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].filter((_, i) => i !== index),
    }));
  };

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day as keyof typeof prev], { start: "09:00", end: "10:00" }],
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-[#e8edf5]">My Availability</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save
            </motion.button>
          </div>

          <p className="text-[#a8b3cf] text-sm">
            Set your weekly availability for students to book sessions
          </p>
        </div>

        {/* Availability List */}
        <div className="px-6 space-y-4">
          {daysOfWeek.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-[#e8edf5]">{day}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addTimeSlot(day)}
                  className="w-8 h-8 bg-[#2a2f45] rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-[#5b7ceb]" />
                </motion.button>
              </div>

              {availability[day as keyof typeof availability].length === 0 ? (
                <p className="text-sm text-[#a8b3cf] text-center py-2">No availability set</p>
              ) : (
                <div className="space-y-2">
                  {availability[day as keyof typeof availability].map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-[#2a2f45] rounded-xl p-3"
                    >
                      <Clock className="w-4 h-4 text-[#a8b3cf]" />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => {
                            const newAvail = { ...availability };
                            newAvail[day as keyof typeof availability][index].start = e.target.value;
                            setAvailability(newAvail);
                          }}
                          className="bg-transparent text-[#e8edf5] text-sm outline-none"
                        />
                        <span className="text-[#a8b3cf]">-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => {
                            const newAvail = { ...availability };
                            newAvail[day as keyof typeof availability][index].end = e.target.value;
                            setAvailability(newAvail);
                          }}
                          className="bg-transparent text-[#e8edf5] text-sm outline-none"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeTimeSlot(day, index)}
                        className="w-8 h-8 bg-[#1e2139] rounded-lg flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-[#a8b3cf]" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-6 mt-6 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#2a2f45] text-[#e8edf5] font-semibold py-3 rounded-xl"
          >
            Copy Previous Week
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#2a2f45] text-[#e8edf5] font-semibold py-3 rounded-xl"
          >
            Clear All
          </motion.button>
        </div>
      </div>

      <BottomNav currentPage="schedule" />
    </div>
  );
}