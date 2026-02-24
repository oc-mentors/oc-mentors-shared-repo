import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Calendar, Star, Clock, Video, MessageSquare, X, ChevronLeft, ChevronRight, Plus, Repeat, Users } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface Session {
  id: number;
  subject: string;
  tutor: string;
  tutorAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed";
}

interface User {
  id: number;
  name: string;
  avatar: string;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 13)); // Feb 13, 2026 (Friday)
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showStudySessionModal, setShowStudySessionModal] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
  const [removedSessionIds, setRemovedSessionIds] = useState<number[]>([]);
  const [studySessionData, setStudySessionData] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "1 hour",
  });

  // Available users to invite
  const availableUsers: User[] = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    {
      id: 2,
      name: "Michael Torres",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      id: 3,
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      id: 4,
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
  ];

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

  const sessions: Session[] = [
    {
      id: 1,
      subject: "Math 2A - Matrices",
      tutor: "Debra Peterson",
      tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Feb 15, 2026",
      time: "2:00 PM",
      duration: "1 hour",
      status: "upcoming",
    },
    {
      id: 2,
      subject: "Physics - Mechanics",
      tutor: "Adam Smith",
      tutorAvatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Feb 18, 2026",
      time: "10:00 AM",
      duration: "1 hour",
      status: "upcoming",
    },
    {
      id: 3,
      subject: "Math 2A - Derivatives",
      tutor: "Debra Peterson",
      tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 5, 2025",
      time: "2:00 PM",
      duration: "1 hour",
      status: "completed",
    },
  ];

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

  // Sample events for the calendar
  interface CalendarEvent {
    id: number;
    type: "class" | "study";
    title: string;
    startTime: string; // e.g., "10:00 AM"
    endTime: string;   // e.g., "11:00 AM"
    day: number;       // Day of week (0-6)
    date: Date;
    tutor?: string;
    participants?: string[];
    color?: string;
  }

  const calendarEvents: CalendarEvent[] = [
    {
      id: 1,
      type: "class",
      title: "Math 2A",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      day: 5, // Friday
      date: new Date(2026, 1, 13), // Feb 13, 2026
      tutor: "Debra Peterson",
      color: "from-[#5b7ceb] to-[#7c3aed]",
    },
    {
      id: 2,
      type: "class",
      title: "Physics",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      day: 2, // Tuesday
      date: new Date(2026, 1, 17), // Feb 17, 2026
      tutor: "Adam Smith",
      color: "from-[#14b8a6] to-[#0891b2]",
    },
    {
      id: 3,
      type: "study",
      title: "Chemistry Study",
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      day: 5, // Friday
      date: new Date(2026, 1, 13), // Feb 13, 2026
      participants: ["Sarah Chen", "Michael Torres"],
      color: "from-[#14b8a6] to-[#06b6d4]",
    },
    {
      id: 4,
      type: "class",
      title: "Writing 39B",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      day: 1, // Monday
      date: new Date(2026, 1, 16), // Feb 16, 2026
      tutor: "Jennifer Lee",
      color: "from-[#8b5cf6] to-[#a855f7]",
    },
    {
      id: 5,
      type: "class",
      title: "Biology Lab",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      day: 4, // Thursday
      date: new Date(2026, 1, 19), // Feb 19, 2026
      tutor: "Dr. Martinez",
      color: "from-[#ec4899] to-[#f43f5e]",
    },
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
      setRemovedSessionIds([...removedSessionIds, sessionToCancel.id]);
      
      // Close modal and reset
      setTimeout(() => {
        setShowCancelModal(false);
        setCancelReason("");
        setSessionToCancel(null);
      }, 300); // Delay to allow slide-out animation
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
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with Profile Button */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-[#e8edf5]">Schedule</h1>
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
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-4">Upcoming</h2>

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
                      className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)]"
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
                            <h3 className="text-[16px] font-semibold text-[#e8edf5]">
                              {session.subject}
                            </h3>
                            <span className="bg-[#5b7ceb] text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0">
                              upcoming
                            </span>
                          </div>
                          <p className="text-[13px] text-[#a8b3cf]">with {session.tutor}</p>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex items-center gap-4 mb-4 text-[13px] text-[#a8b3cf]">
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
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {/* Join Session Button */}
                        <motion.button
                          whileHover={isSessionJoinable(session.date, session.time) ? { scale: 1.01 } : {}}
                          whileTap={isSessionJoinable(session.date, session.time) ? { scale: 0.99 } : {}}
                          onClick={() => isSessionJoinable(session.date, session.time) && navigate("/video-session")}
                          disabled={!isSessionJoinable(session.date, session.time)}
                          className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                            isSessionJoinable(session.date, session.time)
                              ? "bg-[#5b7ceb] text-white shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)] cursor-pointer"
                              : "bg-[rgba(91,124,235,0.3)] text-[rgba(232,237,245,0.5)] cursor-not-allowed"
                          }`}
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
                  <div className="bg-[#1e2139] rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)] text-center">
                    <p className="text-[#a8b3cf] mb-4">No upcoming sessions</p>
                    <Link to="/book-session">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 px-6 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)] inline-flex items-center justify-center gap-2"
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

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 pb-6"
        >
          <div className="bg-gradient-to-br from-[#1e2139] to-[#252a47] rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-bold text-[#e8edf5]">Calendar</h2>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevDay}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#e8edf5] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <span className="text-[15px] font-semibold text-[#e8edf5] min-w-[180px] text-center">
                  {dayNamesFull[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextDay}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#e8edf5] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
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
                    className="flex border-b border-[rgba(255,255,255,0.05)]"
                    style={{ minHeight: '70px' }}
                  >
                    {/* Time label */}
                    <div className="w-20 px-3 py-2 text-[13px] text-[#a8b3cf] font-medium flex-shrink-0">
                      {time}
                    </div>
                    
                    {/* Event area */}
                    <div className="flex-1 relative border-l border-[rgba(255,255,255,0.08)] px-2 py-1">
                      {/* Events will be positioned here */}
                    </div>
                  </div>
                );
              })}

              {/* Event blocks overlaid */}
              <div className="absolute inset-0 pointer-events-none pl-20">
                <div className="relative h-full border-l border-[rgba(255,255,255,0.08)]">
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
                className="flex-1 bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
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
          transition={{ delay: 0.25 }}
          className="px-6 pb-6"
        >
          <Link to="/past-lessons">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-[#1e2139] to-[#252a47] rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(91,124,235,0.2)] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#5b7ceb]" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#e8edf5] mb-1">Past Lessons</h3>
                  <p className="text-sm text-[#a8b3cf]">View your completed sessions</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#a8b3cf] rotate-180" />
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
            className="bg-[#1e2139] rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-[#e8edf5]">Add Recurring Class</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowRecurringModal(false)}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Subject/Class
                </label>
                <input
                  type="text"
                  placeholder="e.g., Math 2A - Calculus"
                  className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Day of Week
                </label>
                <select className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors">
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
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Duration
                  </label>
                  <select className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors">
                    <option>30 mins</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Location/Link
                </label>
                <input
                  type="text"
                  placeholder="Add Zoom link or location"
                  className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecurringModal(false)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-semibold"
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
                className="flex-1 bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
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
            className="bg-[#1e2139] rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-[#e8edf5]">Create Study Session</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowStudySessionModal(false)}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Subject/Topic
                </label>
                <input
                  type="text"
                  placeholder="What will you study?"
                  value={studySessionData.subject}
                  onChange={(e) => setStudySessionData({ ...studySessionData, subject: e.target.value })}
                  className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={studySessionData.date}
                    onChange={(e) => setStudySessionData({ ...studySessionData, date: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={studySessionData.time}
                    onChange={(e) => setStudySessionData({ ...studySessionData, time: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Duration
                </label>
                <select
                  value={studySessionData.duration}
                  onChange={(e) => setStudySessionData({ ...studySessionData, duration: e.target.value })}
                  className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                >
                  <option>30 mins</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Library, online, etc."
                  className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStudySessionModal(false)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-semibold"
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
            className="bg-[#1e2139] rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-[#e8edf5]">Invite Study Partner</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserSelectModal(false)}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <p className="text-[14px] text-[#a8b3cf] mb-4">
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
                  className="w-full flex items-center gap-3 bg-[#2a2f4a] rounded-xl p-4 hover:bg-[#323751] transition-colors"
                >
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-semibold text-[#e8edf5]">{user.name}</p>
                    <p className="text-[13px] text-[#a8b3cf]">Online now</p>
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
              className="w-full mt-4 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-semibold"
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
            className="bg-[#1e2139] rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-[#e8edf5]">Cancel Session</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <p className="text-[14px] text-[#a8b3cf] mb-4">
              Are you sure you want to cancel this session?
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation (optional)"
                className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-semibold"
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
    </div>
  );
}