import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendar } from "../contexts/CalendarContext";
import { AddEventModal } from "./AddEventModal";
import { EventDetailsModal } from "./EventDetailsModal";

export function CalendarMonthView() {
  const { colors, accentColor } = useTheme();
  const { calendarEvents, addCalendarEvent, removeCalendarEvent, updateCalendarEvent } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 13)); // Feb 13, 2026
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setShowAddEventModal(true);
  };

  const handleAddEvent = (eventData: {
    title: string;
    type: "class" | "study" | "tutor";
    location: string;
    date: Date;
    startTime: string;
    endTime: string;
  }) => {
    // Generate new ID
    const newId = Math.max(...calendarEvents.map(e => e.id), 0) + 1;

    // Assign color based on type
    let color = "from-[#5b7ceb] to-[#7c3aed]"; // Default class color
    if (eventData.type === "study") {
      color = "from-[#14b8a6] to-[#06b6d4]";
    } else if (eventData.type === "tutor") {
      color = "from-[#f59e0b] to-[#d97706]"; // Orange for tutor sessions
    }

    const newEvent = {
      id: newId,
      type: eventData.type,
      title: eventData.title,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      day: eventData.date.getDay(),
      date: eventData.date,
      location: eventData.location,
      color: color,
    };

    addCalendarEvent(newEvent);
    setShowAddEventModal(false);
    setSelectedDate(null);
  };

  const days = getDaysInMonth(currentDate);
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date(2026, 1, 13); // Feb 13, 2026
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold" style={{ color: colors.textPrimary }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-[12px] font-semibold py-2"
            style={{ color: colors.textSecondary }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const events = getEventsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <motion.div
              key={index}
              whileHover={date ? { scale: 1.05 } : {}}
              whileTap={date ? { scale: 0.95 } : {}}
              onClick={() => handleDateClick(date)}
              className={`aspect-square rounded-lg p-1 transition-all ${
                date ? "cursor-pointer" : ""
              }`}
              style={{
                backgroundColor: date
                  ? isCurrentDay
                    ? accentColor.primary + "20"
                    : colors.bgSecondary
                  : "transparent",
                border: isCurrentDay ? `2px solid ${accentColor.primary}` : "none",
              }}
            >
              {date && (
                <div className="h-full flex flex-col">
                  {/* Date Number */}
                  <div
                    className="text-[13px] font-semibold text-center mb-0.5"
                    style={{
                      color: isCurrentDay ? accentColor.primary : colors.textPrimary,
                    }}
                  >
                    {date.getDate()}
                  </div>

                  {/* Event Indicators */}
                  <div className="flex-1 overflow-hidden space-y-0.5">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[8px] px-1 py-0.5 rounded text-white truncate bg-gradient-to-r ${event.color}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div
                        className="text-[8px] px-1 text-center"
                        style={{ color: colors.textSecondary }}
                      >
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEventModal && selectedDate && (
          <AddEventModal
            date={selectedDate}
            onClose={() => {
              setShowAddEventModal(false);
              setSelectedDate(null);
            }}
            onSave={handleAddEvent}
          />
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetailsModal && selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => {
              setShowEventDetailsModal(false);
              setSelectedEvent(null);
            }}
            onDelete={removeCalendarEvent}
            onUpdate={updateCalendarEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}