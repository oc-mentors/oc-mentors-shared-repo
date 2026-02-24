import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function BookingPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number>(3);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const availableTimes = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysArray = () => {
    const days = [];
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const handleBookLesson = () => {
    if (selectedDate && selectedTime) {
      // Show success message and navigate to schedule
      navigate("/schedule", {
        state: {
          showBookingSuccess: true,
          bookingDetails: {
            date: `${monthNames[currentMonth]} ${selectedDate}, ${currentYear}`,
            time: selectedTime,
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with Back */}
        <div className="px-6 pt-3 pb-2">
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#e8edf5]" />
            </motion.button>
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-6 pb-4"
        >
          {/* Mentor Info */}
          <div className="text-center mb-4">
            <p className="text-[14px] text-[#a8b3cf] mb-2">Debra Peterson</p>
            <h1 className="text-[32px] font-bold text-[#e8edf5] mb-2">30 Minute Meeting</h1>
            <div className="flex items-center justify-center gap-2 text-[#a8b3cf]">
              <Clock className="w-4 h-4" />
              <span className="text-[14px]">30 min</span>
            </div>
          </div>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-6"
        >
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-4">Select a Day</h2>

          {/* Calendar */}
          <div className="bg-[#1e2139] rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg bg-[#2a2f4a] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#e8edf5]" />
              </motion.button>
              <h3 className="text-[16px] font-semibold text-[#e8edf5]">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-[#2a2f4a] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-[#e8edf5]" />
              </motion.button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center">
                  <span className="text-[12px] text-[#a8b3cf] font-medium">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysArray().map((dayObj, index) => (
                <motion.button
                  key={index}
                  whileHover={dayObj.isCurrentMonth ? { scale: 1.1 } : {}}
                  whileTap={dayObj.isCurrentMonth ? { scale: 0.95 } : {}}
                  onClick={() => dayObj.isCurrentMonth && setSelectedDate(dayObj.day)}
                  disabled={!dayObj.isCurrentMonth}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[14px] transition-all ${
                    dayObj.isCurrentMonth
                      ? selectedDate === dayObj.day
                        ? "bg-[#5b7ceb] text-white font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
                        : "text-[#e8edf5] hover:bg-[#2a2f4a]"
                      : "text-[#4a4f6a]"
                  }`}
                >
                  {dayObj.day}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Available Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-4">Available Times</h2>

          <div className="grid grid-cols-2 gap-3">
            {availableTimes.map((time) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTime(time)}
                className={`py-4 rounded-xl text-[15px] font-medium transition-all ${
                  selectedTime === time
                    ? "bg-[#5b7ceb] text-white shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
                    : "bg-[#1e2139] text-[#e8edf5] hover:bg-[#2a2f4a]"
                }`}
              >
                {time}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Confirm Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 pb-6"
        >
          <motion.button
            whileHover={{ scale: selectedDate && selectedTime ? 1.02 : 1 }}
            whileTap={{ scale: selectedDate && selectedTime ? 0.98 : 1 }}
            onClick={handleBookLesson}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-xl text-[16px] font-semibold transition-all ${
              selectedDate && selectedTime
                ? "bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] text-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                : "bg-[#2a2f4a] text-[#6a7282] cursor-not-allowed"
            }`}
          >
            {selectedDate && selectedTime
              ? `Confirm Booking for ${monthNames[currentMonth]} ${selectedDate} at ${selectedTime}`
              : "Select Date and Time"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}