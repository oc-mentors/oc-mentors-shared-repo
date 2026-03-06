import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, MapPin, Clock, Calendar, Video, MessageSquare, DollarSign } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCalendar } from "../contexts/CalendarContext";

interface Tutor {
  id: number;
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

export default function SubjectTutorsPage() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const { addSession, addCalendarEvent } = useCalendar();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "2026-02-20",
    time: "14:00",
    duration: "1 hour",
    topic: "",
    sessionType: "Video Call",
    location: "Online"
  });

  // Capitalize subject for display
  const subjectDisplay = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "";

  // All tutors data
  const allTutors: Tutor[] = [
    {
      id: 1,
      name: "Debra Peterson",
      avatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviews: 127,
      subjects: ["Math", "Physics"],
      hourlyRate: 45,
      experience: "5 years",
      bio: "PhD in Mathematics with expertise in calculus and linear algebra. I focus on building strong foundational understanding.",
      availability: "Weekdays 2-8 PM",
      responseTime: "Usually responds in 2 hours",
      location: "Remote & In-Person",
    },
    {
      id: 2,
      name: "Adam Smith",
      avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviews: 89,
      subjects: ["Physics", "Math"],
      hourlyRate: 50,
      experience: "7 years",
      bio: "Former NASA engineer specializing in mechanics and thermodynamics. Love making physics intuitive and fun!",
      availability: "Flexible schedule",
      responseTime: "Usually responds in 1 hour",
      location: "Remote only",
    },
    {
      id: 3,
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHNjaWVudGlzdHxlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5.0,
      reviews: 203,
      subjects: ["Chemistry", "Biology"],
      hourlyRate: 55,
      experience: "10 years",
      bio: "Chemistry professor with a passion for organic chemistry and biochemistry. Published researcher and dedicated educator.",
      availability: "Evenings & weekends",
      responseTime: "Usually responds in 3 hours",
      location: "Remote & In-Person",
    },
    {
      id: 4,
      name: "Michael Torres",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviews: 95,
      subjects: ["Biology", "Chemistry"],
      hourlyRate: 40,
      experience: "4 years",
      bio: "Medical student specializing in biology and anatomy. I break down complex topics into digestible concepts.",
      availability: "Weekday mornings",
      responseTime: "Usually responds in 4 hours",
      location: "Remote only",
    },
    {
      id: 5,
      name: "Jennifer Lee",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHRlYWNoZXJ8ZW58MXx8fHwxNzcwOTI5MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviews: 156,
      subjects: ["Writing"],
      hourlyRate: 38,
      experience: "8 years",
      bio: "Published author and writing coach. Expert in academic writing, essays, and creative writing techniques.",
      availability: "Afternoons & evenings",
      responseTime: "Usually responds in 2 hours",
      location: "Remote & In-Person",
    },
    {
      id: 6,
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviews: 112,
      subjects: ["Math"],
      hourlyRate: 42,
      experience: "6 years",
      bio: "Statistics expert and data scientist. I help students master probability, statistics, and mathematical modeling.",
      availability: "Flexible schedule",
      responseTime: "Usually responds in 1 hour",
      location: "Remote only",
    },
  ];

  // Filter tutors by subject
  const tutors = allTutors.filter((tutor) =>
    tutor.subjects.some((s) => s.toLowerCase() === subject?.toLowerCase())
  );

  const handleBookSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedTutor) return;

    // Parse the booking data
    const [year, month, day] = bookingData.date.split('-').map(Number);
    const [hours, minutes] = bookingData.time.split(':').map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const startTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    // Calculate end time based on duration
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

    // Create calendar event
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

    // Create session entry
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

    // Add to context (which will save to localStorage automatically)
    addCalendarEvent(calendarEvent);
    addSession(session);

    setShowBookingModal(false);
    navigate("/schedule", { state: { showBookingSuccess: true } });
  };

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-2">
            <Link to="/book-session">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#e8edf5] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
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
          {tutors.length > 0 ? (
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
                  <ImageWithFallback
                    src={tutor.avatar}
                    alt={tutor.name}
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
                <div className="mb-4">
                  <p className="text-[14px] text-[#a8b3cf] leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[13px]">
                    <MapPin className="w-3.5 h-3.5 text-[#a8b3cf]" />
                    <span className="text-[#e8edf5]">{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <Calendar className="w-3.5 h-3.5 text-[#a8b3cf]" />
                    <span className="text-[#e8edf5]">{tutor.availability}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <Clock className="w-3.5 h-3.5 text-[#a8b3cf]" />
                    <span className="text-[#a8b3cf]">{tutor.responseTime}</span>
                  </div>
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
          ) : (
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
          )}
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
                <ImageWithFallback
                  src={selectedTutor.avatar}
                  alt={selectedTutor.name}
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