import { useAllCourseColors } from "../hooks/useCourseColor";
import { getEventColors } from "../utils/eventColors";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { Calendar, Clock, MapPin, Video, X, Plus, ChevronLeft, ChevronRight, Flag, ArrowLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CalendarMonthView } from "../components/CalendarMonthView";
import { EventDetailsModal } from "../components/EventDetailsModal";
import { AddEventModal } from "../components/AddEventModal";
import type { SavedEventData } from "../components/AddEventModal";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendar, isSessionUpcomingByDate } from "../contexts/CalendarContext";

const IGNORED_IDS_KEY   = 'ignoredAssignmentIds';
const COMPLETED_IDS_KEY = 'completedAssignmentIds';

interface Session {
  id: number;
  subject: string;
  tutor: string;
  tutorAvatar: string;
  student?: string;
  studentAvatar?: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed";
  location?: string;
}

interface CalendarEvent {
  id: number;
  type: "class" | "study" | "assignment";
  title: string;
  startTime: string;
  endTime: string;
  day: number;
  date: Date;
  tutor?: string;
  participants?: string[];
  color?: string;
  courseName?: string;
  dueTime?: string;
  location?: string;
  courseId?: number;
  completed?: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { 
    sessions, 
    calendarEvents, 
    removeSession, 
    removeCalendarEvent, 
    removedSessionIds, 
    addRemovedSessionId,
    updateCalendarEvent,
    addCalendarEvent,
  } = useCalendar();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showStudySessionModal, setShowStudySessionModal] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
  const [studySessionData, setStudySessionData] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "1 hour",
  });

  const isTutor = user?.role === "tutor" || user?.role === "admin";

  // Day-view add-event state
  const [showDayAddModal, setShowDayAddModal] = useState(false);
  const [dayAddStartTime, setDayAddStartTime] = useState("");

  // Convert slot label "8 AM" → "8:00 AM" to pre-fill AddEventModal
  const slotToTime = (slot: string) => slot.replace(" ", ":00 ");

  const handleDaySlotClick = (slotLabel: string) => {
    setDayAddStartTime(slotToTime(slotLabel));
    setShowDayAddModal(true);
  };

  const handleDayAddSave = (eventData: SavedEventData) => {
    const baseId = Math.max(...calendarEvents.map(e => e.id), 0) + 1;

    let color = "from-[#5b7ceb] to-[#7c3aed]";
    if (eventData.type === "study") color = "from-[#14b8a6] to-[#06b6d4]";
    else if (eventData.type === "tutor") color = "from-[#f59e0b] to-[#d97706]";

    const isDeadlineEvent = eventData.type === "deadline";
    const calType = isDeadlineEvent ? "assignment" : eventData.type;

    // Custom hex color wins over Tailwind gradient fallback for all types
    const eventColor = eventData.deadlineColor || (isDeadlineEvent ? "" : color);

    if (eventData.recurring && eventData.recurringFrom && eventData.recurringUntil) {
      const cursor = new Date(eventData.recurringFrom);
      let idOffset = 0;
      while (cursor <= eventData.recurringUntil) {
        const eventDate = new Date(cursor);
        addCalendarEvent({
          id: baseId + idOffset,
          type: calType,
          title: eventData.title,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          day: eventDate.getDay(),
          date: eventDate,
          location: eventData.location,
          color: eventColor,
          courseId: eventData.courseId,
          courseName: eventData.courseName,
          isUserCreated: true,
        });
        cursor.setDate(cursor.getDate() + 7);
        idOffset++;
      }
    } else {
      addCalendarEvent({
        id: baseId,
        type: calType,
        title: eventData.title,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        day: eventData.date.getDay(),
        date: eventData.date,
        location: eventData.location,
        color: eventColor,
        courseId: eventData.courseId,
        courseName: eventData.courseName,
        isUserCreated: true,
      });
    }

    setShowDayAddModal(false);
    setDayAddStartTime("");
  };

  // New state for event editing and creation
  const [showEventModal, setShowEventModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [quickAddTime, setQuickAddTime] = useState("");
  const [editEventData, setEditEventData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    type: "class" as "class" | "study",
    tutor: "",
    participants: [] as string[],
    color: "from-[#5b7ceb] to-[#7c3aed]",
    location: "",
    date: new Date(),
  });

  const availableUsers: User[] = [];

  // Sessions and calendar events now come from CalendarContext

  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      setShowSuccessMessage(true);
      // Clear the state
      window.history.replaceState({}, document.title);
      // Hide after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
    
    if (location.state?.showBookingSuccess) {
      setShowBookingSuccess(true);
      // Clear the state
      window.history.replaceState({}, document.title);
      // Hide after 3 seconds
      setTimeout(() => setShowBookingSuccess(false), 3000);
    }
  }, [location]);

  const upcomingSessions = sessions.filter(
    (s) => s.status === "upcoming" && isSessionUpcomingByDate(s.date)
  );
  const pastSessions = sessions.filter((s) => s.status === "completed");

  // Week view helper functions
  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const weekDays = getWeekDays(currentDate);

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Time slots for the calendar (8 AM to 12 AM)
  const timeSlots = [
    "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
    "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
  ];

  // Convert time string to hour number for positioning
  const timeToHour = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    const startHour = timeToHour(event.startTime);
    const endHour = timeToHour(event.endTime);
    const duration = endHour - startHour;
    
    // Start from 8 AM (hour 8) - using 70px per hour for readable view
    const topPosition = ((startHour - 8) * 70); // 70px per hour
    const height = duration * 70; // 70px per hour
    
    return {
      top: `${topPosition}px`,
      height: `${height}px`,
    };
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        // Completely hide ignored assignments from day view
        !(event.type === "assignment" && ignoredIds.has(String(event.id)))
    );
  };

  const handleSendStudyInvite = (userId: number) => {
    const user = availableUsers.find(u => u.id === userId);
    setShowUserSelectModal(false);
    setShowStudySessionModal(false);
    setShowBookingSuccess(true);
    setTimeout(() => setShowBookingSuccess(false), 3000);
  };

  const handleCancelSession = () => {
    if (sessionToCancel) {
      // Add to removed sessions list
      addRemovedSessionId(sessionToCancel.id);
      
      // Also remove the corresponding calendar event
      removeCalendarEvent(sessionToCancel.id);
      
      // Close modal and reset
      setTimeout(() => {
        setShowCancelModal(false);
        setCancelReason("");
        setSessionToCancel(null);
      }, 300); // Delay to allow slide-out animation
    }
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditEventData({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type === "study" ? "study" : "class",
      tutor: event.tutor || "",
      participants: event.participants || [],
      color: event.color || "from-[#5b7ceb] to-[#7c3aed]",
      location: event.location || "",
    });
    setShowEventModal(true);
  };

  // Handle event delete
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      removeCalendarEvent(selectedEvent.id);
      removeSession(selectedEvent.id);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  // Handle event save
  const handleSaveEvent = (updatedData: any) => {
    if (selectedEvent) {
      updateCalendarEvent(selectedEvent.id, updatedData);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  // Check if session is within 30 minutes of start time (uses current date/time)
  const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const isSessionJoinable = (sessionDate: string, sessionTime: string): boolean => {
    const sessionDateParts = sessionDate.split(" ");
    const month = sessionDateParts[0];
    const day = parseInt(sessionDateParts[1].replace(",", ""), 10);
    const year = parseInt(sessionDateParts[2], 10);
    const monthIndex = monthShort.indexOf(month);
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) return false;

    const [time, period] = sessionTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (!minutes) minutes = 0;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const sessionDateTime = new Date(year, monthIndex, day, hours, minutes);
    const currentTime = new Date();

    const diffInMinutes = (sessionDateTime.getTime() - currentTime.getTime()) / (1000 * 60);
    return diffInMinutes <= 30 && diffInMinutes >= -60;
  };

  const [showTopFade, setShowTopFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track ignored assignment ids so they're hidden in day view
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(IGNORED_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(IGNORED_IDS_KEY);
      setIgnoredIds(stored ? new Set(JSON.parse(stored)) : new Set());
    };
    window.addEventListener('assignmentIgnored', handler);
    return () => window.removeEventListener('assignmentIgnored', handler);
  }, []);

  // Track completed assignment ids — mirrors CalendarMonthView so the
  // day view dims correctly whenever a completion is toggled from any view.
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(COMPLETED_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(COMPLETED_IDS_KEY);
      setCompletedIds(stored ? new Set(JSON.parse(stored)) : new Set());
    };
    window.addEventListener('assignmentCompleted', handler);
    return () => window.removeEventListener('assignmentCompleted', handler);
  }, []);

  const handleContentScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopFade(scrollContainerRef.current.scrollTop > 0);
    }
  };

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bgPrimary }}
      data-testid="schedule-screen" id="schedule-screen" aria-label="Schedule"
    >
      <div className="max-w-md mx-auto w-full h-full flex flex-col">
        {/* Header with Profile Button */}
        <div className="flex-shrink-0 px-6 pt-12 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
                Schedule
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                Socratic OC
              </p>
            </div>
            <ProfileButton />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-hidden">
          {/* Top fade overlay */}
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
            ref={scrollContainerRef}
            onScroll={handleContentScroll}
            className="h-full overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {/* Schedule Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-6 pt-[9px] pb-6"
            >
              <h2 className="text-[18px] font-semibold mb-4" style={{ color: colors.textPrimary }}>Upcoming</h2>

              <div className="space-y-4">
                {upcomingSessions
                  .filter((session) => !removedSessionIds.includes(session.id))
                  .length > 0 ? (
                    upcomingSessions
                      .filter((session) => !removedSessionIds.includes(session.id))
                      .map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, x: -300, transition: { duration: 0.15 } }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.2
                          }}
                          className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border"
                          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                        >
                          {/* Tutor Info */}
                          <div className="flex items-start gap-3 mb-3">
                            <ImageWithFallback
                              src={session.tutorAvatar}
                              alt={session.tutor}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-[16px] font-semibold" style={{ color: colors.textPrimary }}>
                                  {session.subject}
                                </h3>
                                <span className="text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor.primary }}>
                                  upcoming
                                </span>
                              </div>
                              <p className="text-[13px]" style={{ color: colors.textSecondary }}>with {session.tutor}</p>
                            </div>
                          </div>

                          {/* Session Details */}
                          <div className="flex flex-wrap items-center gap-4 mb-4 text-[13px]" style={{ color: colors.textSecondary }}>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{session.duration}</span>
                            </div>
                            {session.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{session.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {/* Join Session Button */}
                            <motion.button
                              whileHover={isSessionJoinable(session.date, session.time) ? { scale: 1.01 } : {}}
                              whileTap={isSessionJoinable(session.date, session.time) ? { scale: 0.99 } : {}}
                              onClick={() => isSessionJoinable(session.date, session.time) && navigate("/video-session")}
                              disabled={!isSessionJoinable(session.date, session.time)}
                              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                              style={isSessionJoinable(session.date, session.time)
                                ? { backgroundColor: accentColor.primary, color: "white", cursor: "pointer" }
                                : { backgroundColor: accentColor.primary + "4d", color: colors.textPrimary + "80", cursor: "not-allowed" }
                              }
                            >
                              <Video className="w-4 h-4" />
                              Join Session
                            </motion.button>

                            {/* Cancel Button */}
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => {
                                setSessionToCancel(session);
                                setShowCancelModal(true);
                              }}
                              className="flex-1 bg-transparent text-[#ec4899] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-[#ec4899]"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border text-center" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
                        <p className="mb-4" style={{ color: colors.textSecondary }}>No upcoming sessions</p>
                        <Link to="/book-session">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`bg-gradient-to-r ${accentColor.gradient} text-white py-3 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-2`}
                          >
                            <Plus className="w-4 h-4" />
                            Book Session
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>

            {/* Month View Calendar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-6 pb-6"
            >
              <CalendarMonthView
                onDateSelect={(date) => setCurrentDate(date)}
                selectedDate={currentDate}
              />
            </motion.div>

            {/* Day View Calendar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="px-6 pb-6"
            >
              <div className="rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[20px] font-bold" style={{ color: colors.textPrimary }}>Calendar</h2>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevDay}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <span className="text-[15px] font-semibold min-w-[180px] text-center" style={{ color: colors.textPrimary }}>
                      {dayNamesFull[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextDay}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Single Day View */}
                <div className="relative">
                  {/* Clickable time slots */}
                  {timeSlots.map((time) => (
                    <motion.div
                      key={time}
                      className="flex group cursor-pointer"
                      style={{ borderBottom: `1px solid ${colors.borderPrimary}`, minHeight: '70px' }}
                      onClick={() => handleDaySlotClick(time)}
                      whileHover={{ backgroundColor: accentColor.primary + "08" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="w-20 px-3 py-2 text-[13px] font-medium flex-shrink-0 flex items-start pt-3" style={{ color: colors.textSecondary }}>
                        {time}
                      </div>
                      <div className="flex-1 relative px-2 py-1 flex items-center" style={{ borderLeft: `1px solid ${colors.borderPrimary}` }}>
                        <Plus
                          className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity absolute right-3 top-3"
                          style={{ color: accentColor.primary }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* ── Event blocks + deadline strips — RIGHT side of divider ── */}
                  <div className="absolute inset-0 pointer-events-none pl-20">
                    <div className="relative h-full" style={{ borderLeft: `1px solid ${colors.borderPrimary}` }}>
                      {/* ── Deadline strips + regular event blocks (unified) ── */}
                      {(() => {
                        const todayEvts    = getEventsForDate(currentDate);
                        const deadlineEvts = todayEvts.filter(e => e.type === "assignment");
                        const regularEvts  = todayEvts.filter(e => e.type !== "assignment");

                        const SLOT_H   = 70;
                        const HALF_H   = SLOT_H / 2;  // 35 px
                        const STRIP_H  = 30;
                        const LINE_GAP = 3;
                        const GAP      = 3;

                        // Which slot-hours have a regular event starting there
                        const regularStartSlots = new Set<number>();
                        regularEvts.forEach(evt => {
                          regularStartSlots.add(Math.max(8, Math.min(23, Math.floor(timeToHour(evt.startTime)))));
                        });

                        // Which slot-hours have deadline events
                        const deadlineSlotHours = new Set<number>();
                        deadlineEvts.forEach(evt => {
                          let rh = timeToHour(evt.startTime);
                          if (rh < 8) rh = 23;
                          deadlineSlotHours.add(Math.min(Math.floor(rh), 23));
                        });

                        // Helper: which half (top/bottom) does this deadline belong to
                        const getHalf = (event: typeof deadlineEvts[0]): "t" | "b" => {
                          let rawH = timeToHour(event.startTime);
                          if (rawH < 8) rawH = 23;
                          return Math.round((rawH % 1) * 60) >= 30 ? "b" : "t";
                        };

                        // ── Group by FULL SLOT HOUR (not half-slot) ──
                        // This lets us inspect both halves together before deciding layout,
                        // preventing a grid that expands to full-slot from silently covering
                        // strips that were independently rendered in the other half.
                        const slotGroups: Record<number, typeof deadlineEvts> = {};
                        deadlineEvts.forEach(event => {
                          let rawH = timeToHour(event.startTime);
                          if (rawH < 8) rawH = 23;
                          const slotHour = Math.min(Math.floor(rawH), 23);
                          if (!slotGroups[slotHour]) slotGroups[slotHour] = [];
                          slotGroups[slotHour].push(event);
                        });

                        // ── Build deadline nodes — one full slot at a time ──
                        const deadlineNodes = Object.entries(slotGroups).flatMap(([hourStr, allSlotEvents]) => {
                          const slotHour   = parseInt(hourStr);
                          const slotTop    = (slotHour - 8) * SLOT_H;
                          const hasRegular = regularStartSlots.has(slotHour);
                          const LEFT       = hasRegular ? "calc(48% + 3px)" : 6;
                          const RIGHT      = 6;

                          const topGroup    = allSlotEvents.filter(e => getHalf(e) === "t");
                          const bottomGroup = allSlotEvents.filter(e => getHalf(e) === "b");

                          // If EITHER half needs to expand to full-slot (≥3 items),
                          // merge ALL events from both halves into one single grid so
                          // nothing from the other half is left orphaned underneath it.
                          const needsFullSlot = topGroup.length >= 3 || bottomGroup.length >= 3;

                          if (needsFullSlot) {
                            const allEvents  = [...topGroup, ...bottomGroup];
                            const count      = allEvents.length;
                            const cols       = count <= 4 ? 2 : 3;
                            const maxShown   = cols * 2;
                            const containerH = SLOT_H - LINE_GAP * 2;
                            const gridTop    = slotTop + LINE_GAP;

                            return [(
                              <div
                                key={`grp-${slotHour}`}
                                style={{
                                  position: "absolute",
                                  top: gridTop,
                                  height: containerH,
                                  left: LEFT,
                                  right: RIGHT,
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                  gridTemplateRows: "repeat(2, 1fr)",
                                  gap: GAP,
                                  zIndex: 5,
                                }}
                              >
                                {allEvents.slice(0, maxShown).map((event, i) => {
                                  const { gradient: grad } = getEventColors(event, courseColors);
                                  const isLast   = i === maxShown - 1;
                                  const overflow = allEvents.length - maxShown;
                                  return (
                                    <motion.div
                                      key={event.id}
                                      initial={{ opacity: 0, scale: 0.92 }}
                                      animate={{ opacity: (event.completed || completedIds.has(String(event.id))) ? 0.35 : 1, scale: 1 }}
                                      transition={{ delay: i * 0.04 }}
                                      whileHover={{ scale: 1.03 }}
                                      className="pointer-events-auto cursor-pointer rounded-lg shadow-md overflow-hidden relative"
                                      style={{ background: grad }}
                                      onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                    >
                                      <div className="flex items-center gap-1 px-1.5 h-full overflow-hidden">
                                        <Flag className="w-3.5 h-3.5 text-white flex-shrink-0 opacity-90" />
                                        <span className="text-[13px] font-bold text-white truncate leading-tight flex-1 min-w-0">
                                          {event.title}
                                        </span>
                                        <span className="ml-auto text-[12px] text-white/80 flex-shrink-0 pl-1 font-semibold">
                                          {event.startTime.replace(/\s*(am|pm)$/i, '')}
                                        </span>
                                      </div>
                                      {isLast && overflow > 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                          <span className="text-[11px] font-bold text-white">+{overflow} more</span>
                                        </div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )];
                          }

                          // Neither half has ≥3 items — render each half independently.
                          // The two halves occupy separate 35 px bands so they never overlap.
                          const result: JSX.Element[] = [];

                          const renderHalf = (group: typeof deadlineEvts, halfOffset: number) => {
                            if (group.length === 0) return;
                            const halfTop  = slotTop + halfOffset;
                            const stripTop = halfTop + Math.round((HALF_H - STRIP_H) / 2); // +3 px

                            if (group.length === 1) {
                              const event = group[0];
                              const { gradient: grad } = getEventColors(event, courseColors);
                              result.push(
                                <motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: (event.completed || completedIds.has(String(event.id))) ? 0.35 : 1, x: 0 }}
                                  transition={{ delay: 0 }}
                                  whileHover={{ scale: 1.02 }}
                                  className="pointer-events-auto cursor-pointer flex items-center gap-1.5 px-2.5 rounded-lg shadow-md"
                                  style={{
                                    position: "absolute",
                                    top: stripTop,
                                    height: STRIP_H,
                                    left: LEFT,
                                    right: RIGHT,
                                    background: grad,
                                    zIndex: 5,
                                  }}
                                  onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                >
                                  <Flag className="w-3.5 h-3.5 text-white flex-shrink-0 opacity-90" />
                                  <span className="text-[14px] font-bold text-white truncate leading-normal">
                                    {event.title}
                                  </span>
                                  <span className="ml-auto text-[12px] text-white/85 flex-shrink-0 pl-1 font-semibold">
                                    {event.startTime}
                                  </span>
                                </motion.div>
                              );
                            } else {
                              // 2 items → two strips side-by-side within this half-slot
                              group.forEach((event, i) => {
                                const { gradient: grad } = getEventColors(event, courseColors);
                                let leftPos:  string | number;
                                let rightPos: string | number;
                                if (hasRegular) {
                                  leftPos  = i === 0 ? "calc(48% + 3px)" : "calc(74% + 3px)";
                                  rightPos = i === 0 ? "calc(26% + 3px)" : RIGHT;
                                } else {
                                  leftPos  = i === 0 ? 6 : `calc(50% + ${GAP / 2}px)`;
                                  rightPos = i === 0 ? `calc(50% + ${GAP / 2}px)` : RIGHT;
                                }
                                result.push(
                                  <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: (event.completed || completedIds.has(String(event.id))) ? 0.35 : 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="pointer-events-auto cursor-pointer flex items-center gap-1 px-2 rounded-lg shadow-md overflow-hidden"
                                    style={{
                                      position: "absolute",
                                      top: stripTop,
                                      height: STRIP_H,
                                      left: leftPos,
                                      right: rightPos,
                                      background: grad,
                                      zIndex: 5,
                                    }}
                                    onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                  >
                                    <Flag className="w-3 h-3 text-white flex-shrink-0 opacity-90" />
                                    <span className="text-[13px] font-bold text-white truncate leading-tight flex-1 min-w-0">
                                      {event.title}
                                    </span>
                                    <span className="ml-auto text-[12px] text-white/75 flex-shrink-0 pl-1 font-semibold">
                                      {event.startTime}
                                    </span>
                                  </motion.div>
                                );
                              });
                            }
                          };

                          renderHalf(topGroup, 0);
                          renderHalf(bottomGroup, HALF_H);
                          return result;
                        });

                        // ── Regular (non-deadline) event nodes ──
                        const regularNodes = regularEvts.map((event, index) => {
                          const style = getEventStyle(event);
                          const durationHours = timeToHour(event.endTime) - timeToHour(event.startTime);
                          const isMedium = durationHours >= 0.75;
                          const TYPE_LABELS: Record<string, string> = {
                            class: "Class",
                            study: "Study",
                            tutor: "Tutor",
                          };
                          const typeLabel = TYPE_LABELS[event.type] ?? event.type;

                          // If a deadline shares this start-slot, narrow the block to the left
                          // ~46 % so both are visible side-by-side rather than overlapping.
                          const slotH = Math.max(8, Math.min(23, Math.floor(timeToHour(event.startTime))));
                          const rightOverride = deadlineSlotHours.has(slotH) ? "54%" : "6px";

                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.02 }}
                              className="absolute left-1.5 rounded-xl pointer-events-auto cursor-pointer shadow-lg overflow-hidden"
                              style={{ ...style, background: getEventColors(event, courseColors).gradient, right: rightOverride, zIndex: 8 }}
                              onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                            >
                              <div className="h-full flex flex-col px-2.5 py-2 text-white overflow-hidden">
                                <div className="flex items-center gap-1 mb-1 flex-shrink-0">
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/25 uppercase tracking-wider leading-none">
                                    {typeLabel}
                                  </span>
                                </div>
                                <p className="text-[13px] font-bold leading-tight flex-shrink-0 truncate">
                                  {event.title}
                                </p>
                                {isMedium && (
                                  <p className="text-[11px] opacity-75 mt-0.5 flex-shrink-0">
                                    {event.startTime} – {event.endTime}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        });

                        return [...deadlineNodes, ...regularNodes];
                      })()}
                    </div>
                  </div>
                </div>


              </div>
            </motion.div>

            {/* Past Lessons Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 pb-6"
            >
              <Link to="/past-lessons">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border flex items-center justify-between"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor.primary + "33" }}>
                      <Calendar className="w-6 h-6" style={{ color: accentColor.primary }} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>Past Lessons</h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>View your completed sessions</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180" style={{ color: colors.textSecondary }} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Day-view Add Event Modal */}
      <AnimatePresence>
        {showDayAddModal && (
          <AddEventModal
            date={currentDate}
            defaultStartTime={dayAddStartTime}
            onClose={() => { setShowDayAddModal(false); setDayAddStartTime(""); }}
            onSave={handleDayAddSave}
          />
        )}
      </AnimatePresence>

      <BottomNav currentPage="schedule" />

      {/* Success Toast */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md mx-4"
        >
          <div className="bg-[#4ade80] text-white px-6 py-4 rounded-xl shadow-[0px_8px_24px_0px_rgba(74,222,128,0.4)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[15px]">Review submitted!</p>
              <p className="text-[13px] text-white/90">Thank you for your feedback</p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Booking Success Toast */}
      {showBookingSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md mx-4"
          data-testid="booking-success-banner" id="booking-success-banner" aria-label="Booking successful"
        >
          <div className="bg-[#4ade80] text-white px-6 py-4 rounded-xl shadow-[0px_8px_24px_0px_rgba(74,222,128,0.4)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[15px]">Booking successful!</p>
              <p className="text-[13px] text-white/90">Your session is scheduled</p>
            </div>
            <button
              onClick={() => setShowBookingSuccess(false)}
              data-testid="booking-success-dismiss" id="booking-success-dismiss" aria-label="Dismiss"
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Recurring Class Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>Add Recurring Class</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowRecurringModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Subject/Class
                </label>
                <input
                  type="text"
                  placeholder="e.g., Math 2A - Calculus"
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Day of Week
                </label>
                <select 
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Duration
                  </label>
                  <select 
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  >
                    <option>30 mins</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Location/Link
                </label>
                <input
                  type="text"
                  placeholder="Add Zoom link or location"
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecurringModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowRecurringModal(false);
                  setShowBookingSuccess(true);
                  setTimeout(() => setShowBookingSuccess(false), 3000);
                }}
                className={`flex-1 bg-gradient-to-r ${accentColor.gradient} text-white py-3 rounded-xl font-semibold`}
              >
                Add Class
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Study Session Modal */}
      {showStudySessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>Create Study Session</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowStudySessionModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Subject/Topic
                </label>
                <input
                  type="text"
                  placeholder="What will you study?"
                  value={studySessionData.subject}
                  onChange={(e) => setStudySessionData({ ...studySessionData, subject: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={studySessionData.date}
                    onChange={(e) => setStudySessionData({ ...studySessionData, date: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={studySessionData.time}
                    onChange={(e) => setStudySessionData({ ...studySessionData, time: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Duration
                </label>
                <select
                  value={studySessionData.duration}
                  onChange={(e) => setStudySessionData({ ...studySessionData, duration: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                >
                  <option>30 mins</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Library, online, etc."
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                  style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStudySessionModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserSelectModal(true)}
                className="flex-1 bg-gradient-to-r from-[#14b8a6] to-[#0891b2] text-white py-3 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(20,184,166,0.4)]"
              >
                Invite Friends
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Select Modal */}
      {showUserSelectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>Invite Study Partner</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserSelectModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <p className="text-[14px] mb-4" style={{ color: colors.textSecondary }}>
              Select a classmate to invite to your study session
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-[14px] text-center py-6" style={{ color: colors.textSecondary }}>
                  No classmates to show yet. Invite links from your school roster can be added here later.
                </p>
              ) : (
                availableUsers.map((user, index) => (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendStudyInvite(user.id)}
                    className="w-full flex items-center gap-3 rounded-xl p-4 transition-colors"
                    style={{ backgroundColor: colors.bgTertiary }}
                  >
                    <ImageWithFallback
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>{user.name}</p>
                      <p className="text-[13px]" style={{ color: colors.textSecondary }}>Online now</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#0891b2] flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserSelectModal(false)}
              className="w-full mt-4 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
            >
              Cancel
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Cancel Session Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>Cancel Session</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <p className="text-[14px] mb-4" style={{ color: colors.textSecondary }}>
              Are you sure you want to cancel this session?
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation (optional)"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelSession}
                className="flex-1 bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white py-3 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(236,72,153,0.4)]"
              >
                Confirm Cancellation
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event Details Modal — use live event from context so completed state reflects immediately */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <EventDetailsModal
            event={calendarEvents.find(e => e.id === selectedEvent.id) ?? selectedEvent}
            onClose={() => {
              setShowEventModal(false);
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