import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendar } from "../contexts/CalendarContext";

export default function BookingPage() {
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();
  const { addCalendarEvent, calendarEvents } = useCalendar();
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<number>(now.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [location, setLocation] = useState("Online");

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
      const bookingDate = new Date(currentYear, currentMonth, selectedDate);
      const dayOfWeek = bookingDate.getDay();
      
      // Calculate end time (30 minutes later)
      const endTime = calculateEndTime(selectedTime, 30);
      
      // Generate unique ID
      const newId = calendarEvents.length > 0 
        ? Math.max(...calendarEvents.map(e => e.id)) + 1 
        : 1;
      
      // Add event to calendar
      addCalendarEvent({
        id: newId,
        type: "tutor",
        title: "Tutor Session - Debra Peterson",
        startTime: selectedTime,
        endTime: endTime,
        day: dayOfWeek,
        date: bookingDate,
        tutor: "Debra Peterson",
        location: location,
        color: "from-[#f59e0b] to-[#d97706]", // Orange gradient for tutor sessions
      });

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

  // Helper function to calculate end time
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [time, period] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    // Add duration
    minutes += durationMinutes;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    
    // Convert back to 12-hour format
    const endPeriod = hours >= 12 ? "PM" : "AM";
    let endHours = hours % 12;
    if (endHours === 0) endHours = 12;
    
    return `${endHours}:${minutes.toString().padStart(2, "0")} ${endPeriod}`;
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with Back */}
        <div className="px-6 pt-3 pb-2">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-6 pb-4"
        >
          {/* Mentor Info */}
          <div className="text-center mb-4">
            <p className="text-[14px] mb-2" style={{ color: colors.textSecondary }}>Debra Peterson</p>
            <h1 className="text-[32px] font-bold mb-2" style={{ color: colors.textPrimary }}>30 Minute Meeting</h1>
            <div className="flex items-center justify-center gap-2" style={{ color: colors.textSecondary }}>
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
          <h2 className="text-[18px] font-semibold mb-4" style={{ color: colors.textPrimary }}>Select a Day</h2>

          {/* Calendar */}
          <div className="rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" style={{ backgroundColor: colors.bgCard }}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
              <h3 className="text-[16px] font-semibold" style={{ color: colors.textPrimary }}>
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center">
                  <span className="text-[12px] font-medium" style={{ color: colors.textSecondary }}>{day}</span>
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
                  className="aspect-square rounded-lg flex items-center justify-center text-[14px] transition-all"
                  style={{
                    backgroundColor: dayObj.isCurrentMonth && selectedDate === dayObj.day ? accentColor.primary : "transparent",
                    color: dayObj.isCurrentMonth
                      ? selectedDate === dayObj.day ? "#ffffff" : colors.textPrimary
                      : colors.textTertiary,
                    fontWeight: dayObj.isCurrentMonth && selectedDate === dayObj.day ? 600 : 400,
                    boxShadow: dayObj.isCurrentMonth && selectedDate === dayObj.day ? `0px 4px 12px 0px ${accentColor.primary}66` : "none",
                  }}
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
          <h2 className="text-[18px] font-semibold mb-4" style={{ color: colors.textPrimary }}>Available Times</h2>

          <div className="grid grid-cols-2 gap-3">
            {availableTimes.map((time) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTime(time)}
                className="py-4 rounded-xl text-[15px] font-medium transition-all"
                style={{
                  backgroundColor: selectedTime === time ? accentColor.primary : colors.bgCard,
                  color: selectedTime === time ? "#ffffff" : colors.textPrimary,
                  boxShadow: selectedTime === time ? `0px 4px 12px 0px ${accentColor.primary}66` : "none",
                }}
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
            className="w-full py-4 rounded-xl text-[16px] font-semibold transition-all"
            style={{
              background: selectedDate && selectedTime
                ? `linear-gradient(to bottom right, ${accentColor.primary}, ${accentColor.hover})`
                : colors.bgTertiary,
              color: selectedDate && selectedTime ? "#ffffff" : colors.textTertiary,
              boxShadow: selectedDate && selectedTime ? "0px 4px 16px 0px rgba(0,0,0,0.5)" : "none",
              cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
            }}
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