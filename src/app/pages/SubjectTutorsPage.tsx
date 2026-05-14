import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, MapPin, Clock, Calendar, Video, MessageSquare, DollarSign, BookOpen } from "lucide-react";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Timestamp } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useConnections } from "../contexts/ConnectionsContext";
import { useCalendar } from "../contexts/CalendarContext";
import { useTutors, Tutor as BackendTutor } from "../contexts/TutorsContext";

/** Shape used by this page for list and booking modal. */
interface Tutor {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  subjects: string[];
  hourlyRate: number;
  experience: string;
  bio: string;
  availability: string;
  responseTime: string;
  location: string;
}

function mapBackendToPageTutor(t: BackendTutor): Tutor {
  const normalize = (v?: string): string => {
    if (!v) return "";
    const trimmed = v.trim();
    if (trimmed === "." || trimmed === '""') return "";
    return trimmed;
  };
  return {
    id: t.id,
    name: t.name,
    avatar: t.avatar,
    rating: t.rating,
    reviews: t.reviewCount,
    subjects: t.subjects,
    hourlyRate: t.pricePerHour ?? 0,
    experience: normalize(t.experience),
    bio: normalize(t.bio),
    availability: Array.isArray(t.availability)
      ? t.availability.map(normalize).filter(Boolean).join(", ")
      : normalize(t.availability as string | undefined),
    responseTime: normalize(t.responseTime),
    location: normalize(t.location),
  };
}

export default function SubjectTutorsPage() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const { user } = useAuth();
  const { getConnectionWithTutor } = useConnections();
  const { addSession, addCalendarEvent } = useCalendar();
  const { tutors: backendTutors, isLoading, error } = useTutors();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const todayStr = (() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();
  const [bookingData, setBookingData] = useState({
    date: todayStr,
    time: "14:00",
    duration: "1 hour",
    topic: "",
    sessionType: "Video Call",
    location: "Online"
  });

  // Capitalize subject for display
  const subjectDisplay = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "";

  // Map backend tutors to page shape and filter by subject
  const tutors = backendTutors
    .map(mapBackendToPageTutor)
    .filter((tutor) =>
      tutor.subjects.some((s) => s.toLowerCase() === subject?.toLowerCase())
    );

  const handleBookSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedTutor) return;

    const [year, month, day] = bookingData.date.split('-').map(Number);
    const [hours, minutes] = bookingData.time.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const startTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

    const durationMap: { [key: string]: number } = {
      "1 hour": 1,
      "1.5 hours": 1.5,
      "2 hours": 2
    };
    const durationHours = durationMap[bookingData.duration] || 1;
    const endHours = hours + durationHours;
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const endHours12 = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours;
    const endTime = `${endHours12}:${minutes.toString().padStart(2, '0')} ${endPeriod}`;

    const calendarEvent = {
      id: Date.now(),
      type: "class" as const,
      title: `${subjectDisplay}${bookingData.topic ? ` - ${bookingData.topic}` : ''}`,
      startTime,
      endTime,
      day: new Date(year, month - 1, day).getDay(),
      date: new Date(year, month - 1, day),
      tutor: selectedTutor.name,
      location: bookingData.location,
      color: "from-[#5b7ceb] to-[#7c3aed]",
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const session = {
      id: Date.now() + 1,
      subject: `${subjectDisplay}${bookingData.topic ? ` - ${bookingData.topic}` : ''}`,
      tutor: selectedTutor.name,
      tutorAvatar: selectedTutor.avatar,
      date: `${monthNames[month - 1]} ${day}, ${year}`,
      time: startTime,
      duration: bookingData.duration,
      status: "upcoming" as const,
      location: bookingData.location,
    };

    addCalendarEvent(calendarEvent);
    addSession(session);

    if (user?.id && db) {
      const connection = getConnectionWithTutor(selectedTutor.id);
      if (connection?.id) {
        try {
          await firestoreReady;
          const scheduledAt = new Date(year, month - 1, day, hours, minutes);
          await addDoc(collection(db, "sessions"), {
            connectionId: connection.id,
            studentUid: user.id,
            tutorUid: selectedTutor.id,
            status: "requested",
            scheduledAt: Timestamp.fromDate(scheduledAt),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (_) {
          // Non-blocking; calendar/session UI still updated
        }
      }
    }

    setShowBookingModal(false);
    navigate("/schedule", { state: { showBookingSuccess: true } });
  };

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-2">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#e8edf5] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            {/* ProfileButton removed — subpage */}
          </div>
          <h1 className="text-[28px] font-bold text-[#e8edf5] mb-2">
            {subjectDisplay} Tutors
          </h1>
          <p className="text-[15px] text-[#a8b3cf]">
            {tutors.length} {tutors.length === 1 ? "tutor" : "tutors"} available
          </p>
        </div>

        {/* Tutors List */}
        <div className="px-6 space-y-4">
          {isLoading && (
            <p className="text-[#a8b3cf] text-center py-8">Loading tutors…</p>
          )}
          {error && (
            <p className="text-[#a8b3cf] text-center py-8">{error}</p>
          )}
          {!isLoading && !error && tutors.length > 0 ? (
            tutors.map((tutor, index) => (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1e2139] rounded-2xl p-5 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                {/* Tutor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <AvatarWithInitials
                    src={tutor.avatar}
                    name={tutor.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold text-[#e8edf5] mb-1">
                      {tutor.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
                        <span className="text-[14px] font-semibold text-[#e8edf5]">
                          {tutor.rating}
                        </span>
                      </div>
                      <span className="text-[13px] text-[#a8b3cf]">
                        ({tutor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[#a8b3cf]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tutor.experience} experience</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[18px] font-bold text-[#14b8a6]">
                      <DollarSign className="w-4 h-4" />
                      <span>{tutor.hourlyRate}</span>
                    </div>
                    <span className="text-[11px] text-[#a8b3cf]">per hour</span>
                  </div>
                </div>

                {/* Bio */}
                {tutor.bio && (
                  <div className="mb-4">
                    <p className="text-[14px] text-[#a8b3cf] leading-relaxed">
                      {tutor.bio}
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {tutor.location && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <MapPin className="w-3.5 h-3.5 text-[#a8b3cf]" />
                      <span className="text-[#e8edf5]">{tutor.location}</span>
                    </div>
                  )}
                  {tutor.availability && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <Calendar className="w-3.5 h-3.5 text-[#a8b3cf]" />
                      <span className="text-[#e8edf5]">{tutor.availability}</span>
                    </div>
                  )}
                  {tutor.responseTime && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <Clock className="w-3.5 h-3.5 text-[#a8b3cf]" />
                      <span className="text-[#a8b3cf]">{tutor.responseTime}</span>
                    </div>
                  )}
                  {tutor.subjects.length > 0 && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <BookOpen className="w-3.5 h-3.5 text-[#a8b3cf]" />
                      <span className="text-[#e8edf5]">
                        {tutor.subjects.slice(0, 3).join(", ")}
                        {tutor.subjects.length > 3 && " + more"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Subjects Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.subjects.map((subj) => (
                    <span
                      key={subj}
                      className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                        subj.toLowerCase() === subject?.toLowerCase()
                          ? "bg-[#5b7ceb] text-white"
                          : "bg-[rgba(255,255,255,0.05)] text-[#a8b3cf]"
                      }`}
                    >
                      {subj}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookSession(tutor)}
                    className="flex-1 bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)] flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Book Session
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-medium border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : !isLoading && !error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#1e2139] rounded-2xl p-8 border border-[rgba(255,255,255,0.08)] text-center"
            >
              <p className="text-[#a8b3cf] mb-4">
                No tutors available for {subjectDisplay} at the moment
              </p>
              <Link to="/book-session">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 px-6 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
                >
                  Browse Other Subjects
                </motion.button>
              </Link>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedTutor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1e2139] rounded-2xl p-6 max-w-md w-full shadow-[0px_8px_32px_0px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.08)]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[22px] font-bold text-[#e8edf5]">Book Session</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingModal(false)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 rotate-45" />
                </motion.button>
              </div>

              {/* Tutor Info */}
              <div className="flex items-center gap-3 mb-5 p-4 bg-[#2a2f4a] rounded-xl">
                <AvatarWithInitials
                  src={selectedTutor.avatar}
                  name={selectedTutor.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-[#e8edf5]">
                    {selectedTutor.name}
                  </p>
                  <p className="text-[13px] text-[#a8b3cf]">
                    {subjectDisplay} • ${selectedTutor.hourlyRate}/hr
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                      Duration
                    </label>
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                      className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                    >
                      <option>1 hour</option>
                      <option>1.5 hours</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Topic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="What would you like to focus on?"
                    value={bookingData.topic}
                    onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Session Type
                  </label>
                  <select
                    value={bookingData.sessionType}
                    onChange={(e) => setBookingData({ ...bookingData, sessionType: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  >
                    <option>Video Call</option>
                    <option>In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#a8b3cf] mb-2">
                    Location
                  </label>
                  <select
                    value={bookingData.location}
                    onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                    className="w-full bg-[#2a2f4a] rounded-xl px-4 py-3 text-[14px] text-[#e8edf5] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
                  >
                    <option>Online</option>
                    <option>UCI</option>
                    <option>Santa Ana High School</option>
                    <option>Troy High School</option>
                    <option>Irvine High School</option>
                  </select>
                </div>
              </div>

              {/* Total */}
              <div className="mt-5 p-4 bg-[rgba(91,124,235,0.1)] rounded-xl border border-[rgba(91,124,235,0.2)]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#a8b3cf]">Total</span>
                  <span className="text-[20px] font-bold text-[#5b7ceb]">
                    ${selectedTutor.hourlyRate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-[rgba(255,255,255,0.05)] text-[#e8edf5] py-3 rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmBooking}
                  className="flex-1 bg-gradient-to-r from-[#5b7ceb] to-[#7c3aed] text-white py-3 rounded-xl font-semibold shadow-[0px_4px_12px_0px_rgba(91,124,235,0.4)]"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}