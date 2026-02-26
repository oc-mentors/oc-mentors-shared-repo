import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Calendar, Star, Clock, Video, MessageSquare, X, ChevronLeft, ChevronRight, Plus, Repeat, Users, Edit2, Trash2, FileText, MapPin } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CalendarMonthView } from "../components/CalendarMonthView";
import { EventDetailsModal } from "../components/EventDetailsModal";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendar } from "../contexts/CalendarContext";

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
  const { 
    sessions, 
    calendarEvents, 
    removeSession, 
    removeCalendarEvent, 
    removedSessionIds, 
    addRemovedSessionId,
    updateCalendarEvent 
  } = useCalendar();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 13)); // Feb 13, 2026 (Friday)
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

  // Assignments data to show on calendar
  const assignments = [
    {
      id: 101,
      courseName: "CHEM 1A: General Chemistry",
      title: "Lab Report: Acid-Base Titration",
      dueDate: "Feb 16, 2026",
      dueTime: "11:59 PM",
      status: "upcoming",
      color: "from-[#8b5cf6] to-[#a855f7]",
    },
    {
      id: 102,
      courseName: "MATH 2A: Calculus I",
      title: "Problem Set 5: Integration Techniques",
      dueDate: "Feb 15, 2026",
      dueTime: "11:59 PM",
      status: "upcoming",
      color: "from-[#3b82f6] to-[#6366f1]",
    },
    {
      id: 103,
      courseName: "PHYS 7C: Classical Mechanics",
      title: "Midterm Exam Review",
      dueDate: "Feb 14, 2026",
      dueTime: "11:59 PM",
      status: "urgent",
      color: "from-[#14b8a6] to-[#06b6d4]",
    },
  ];

  // Available users for study session invites
  const availableUsers: User[] = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      id: 2,
      name: "Michael Torres",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      id: 5,
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    },
  ];

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

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
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

  // Time slots for the calendar (8 AM to 10 PM)
  const timeSlots = [
    "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
    "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"
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
        event.date.getFullYear() === date.getFullYear()
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

  // Check if session is within 30 minutes of start time
  const isSessionJoinable = (sessionDate: string, sessionTime: string): boolean => {
    // Parse the session date and time
    const sessionDateParts = sessionDate.split(" ");
    const month = sessionDateParts[0];
    const day = parseInt(sessionDateParts[1].replace(",", ""));
    const year = parseInt(sessionDateParts[2]);
    
    // Convert month name to number
    const monthIndex = monthNames.indexOf(month);
    
    // Parse time
    const [time, period] = sessionTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (!minutes) minutes = 0;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    // Create session datetime
    const sessionDateTime = new Date(year, monthIndex, day, hours, minutes);
    
    // Current time (simulated as Feb 13, 2026 1:00 PM for demo)
    const currentTime = new Date(2026, 1, 13, 13, 0); // 1:00 PM on Feb 13, 2026
    
    // Calculate difference in minutes
    const diffInMinutes = (sessionDateTime.getTime() - currentTime.getTime()) / (1000 * 60);
    
    // Session is joinable if it's within 30 minutes before start time or already started (but not past end time)
    return diffInMinutes <= 30 && diffInMinutes >= -60; // Can join 30 min before and up to 1 hour after start
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with Profile Button */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>Schedule</h1>
            <ProfileButton />
          </div>
        </div>

        {/* Schedule Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 pb-6"
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
          <CalendarMonthView />
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
              {/* Time slots - no scroll */}
              {timeSlots.map((time, index) => {
                const dayEvents = getEventsForDate(currentDate);
                const eventsAtThisTime = dayEvents.filter(event => {
                  const eventStartHour = timeToHour(event.startTime);
                  const slotHour = index + 8; // 8 AM is index 0
                  return Math.floor(eventStartHour) === slotHour;
                });

                return (
                  <div
                    key={time}
                    className="flex"
                    style={{ borderBottom: `1px solid ${colors.borderPrimary}`, minHeight: '70px' }}
                  >
                    {/* Time label */}
                    <div className="w-20 px-3 py-2 text-[13px] font-medium flex-shrink-0" style={{ color: colors.textSecondary }}>
                      {time}
                    </div>
                    
                    {/* Event area */}
                    <div className="flex-1 relative px-2 py-1" style={{ borderLeft: `1px solid ${colors.borderPrimary}` }}>
                      {/* Events will be positioned here */}
                    </div>
                  </div>
                );
              })}

              {/* Event blocks overlaid */}
              <div className="absolute inset-0 pointer-events-none pl-20">
                <div className="relative h-full" style={{ borderLeft: `1px solid ${colors.borderPrimary}` }}>
                  {getEventsForDate(currentDate).map((event, index) => {
                    const style = getEventStyle(event);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`absolute left-2 right-2 rounded-xl p-4 pointer-events-auto cursor-pointer bg-gradient-to-br ${event.color} shadow-lg`}
                        style={style}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="text-white h-full flex flex-col">
                          <div className="text-[15px] font-bold mb-1">
                            {event.title}
                          </div>
                          <div className="text-[13px] opacity-90 mb-2">
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.tutor && (
                            <div className="text-[12px] opacity-90 flex items-center gap-1.5">
                              <span>with {event.tutor}</span>
                            </div>
                          )}
                          {event.participants && (
                            <div className="text-[12px] opacity-90 flex items-center gap-1.5 mt-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{event.participants.join(", ")}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="text-[12px] opacity-90 flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecurringModal(true)}
                className={`flex-1 bg-gradient-to-r ${accentColor.gradient} text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2`}
              >
                <Repeat className="w-4 h-4" />
                Recurring Class
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStudySessionModal(true)}
                className="flex-1 bg-gradient-to-r from-[#14b8a6] to-[#0891b2] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_12px_0px_rgba(20,184,166,0.4)]"
              >
                <Users className="w-4 h-4" />
                Study Session
              </motion.button>
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
              {availableUsers.map((user, index) => (
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
              ))}
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

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
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