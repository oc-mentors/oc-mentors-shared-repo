import { motion } from "motion/react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ChevronLeft, Star, MapPin, BookOpen, Calendar, MessageCircle, Clock } from "lucide-react";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { useConversations, Conversation } from "../contexts/ConversationsContext";
import { useConnections } from "../contexts/ConnectionsContext";
import { useTutorRequests } from "../contexts/TutorRequestsContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useTutors } from "../contexts/TutorsContext";

export default function TutorDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const tutorId = params.id ?? "";
  const { addConversation, getConversation } = useConversations();
  const { getOrCreateConnectionWithTutor, getConnectionWithTutor } = useConnections();
  const { createRequest, hasPendingRequestToTutor } = useTutorRequests();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const { tutors, isLoading, error } = useTutors();

  const connection = getConnectionWithTutor(tutorId);
  const hasConnection = !!connection?.conversationId;
  const pendingRequest = hasPendingRequestToTutor(tutorId);
  const isViewingAsStudent = user?.role === "student" || !user?.role;

  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  // Determine where to go back to based on sessionStorage
  const handleBack = () => {
    const navSource = sessionStorage.getItem('tutorNavSource');
    const chatId = sessionStorage.getItem('tutorNavChatId');
    
    // Clear the stored values
    sessionStorage.removeItem('tutorNavSource');
    sessionStorage.removeItem('tutorNavChatId');
    
    if (navSource === 'chat' && chatId) {
      // Navigate back to the specific chat conversation
      // Use replace: true to avoid adding to history stack
      navigate(`/chat/${chatId}`, { replace: true });
    } else {
      // Default to tutors page
      navigate("/tutors");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <p style={{ color: colors.textSecondary }}>Loading…</p>
      </div>
    );
  }
  if (error || !tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.bgPrimary }}>
        <p style={{ color: colors.textSecondary }}>{error ?? "Tutor not found."}</p>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      student: "Alex Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Debra is the best Math tutor I ever had! She helped me pass Math 2A with an A!",
    },
    {
      id: 2,
      student: "Maria Garcia",
      rating: 4,
      date: "1 month ago",
      comment: "Very patient and explains concepts clearly. Highly recommend!",
    },
    {
      id: 3,
      student: "Kevin Lee",
      rating: 5,
      date: "1 month ago",
      comment: "Amazing tutor! Really knows how to break down complex topics.",
    },
  ];

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-3 pb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: colors.borderPrimary }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 pb-6"
        >
          <div className="flex items-start gap-5 mb-4">
            <AvatarWithInitials
              src={tutor.avatar}
              name={tutor.name}
              className="w-24 h-24 rounded-2xl object-cover shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            />
            <div className="flex-1">
              <h1 className="text-[24px] font-bold mb-1" style={{ color: colors.textPrimary }}>{tutor.name}</h1>
              <p className="text-[13px] mb-2" style={{ color: colors.textSecondary }}>{tutor.university}</p>
              <p className="text-[12px] mb-3" style={{ color: colors.textSecondary }}>{tutor.major}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
                <span className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>
                  {tutor.rating.toFixed(1)}
                </span>
                <span className="text-[13px]" style={{ color: colors.textSecondary }}>({tutor.reviewCount} reviews)</span>
              </div>
              <span className="text-[18px] font-bold" style={{ color: accentColor.primary }}>{tutor.priceLevel}</span>
              <span className="text-[13px] ml-2" style={{ color: colors.textSecondary }}>${tutor.pricePerHour}/hr</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 pb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" style={{ backgroundColor: colors.bgCard }}>
              <BookOpen className="w-5 h-5 mx-auto mb-1" style={{ color: accentColor.primary }} />
              <p className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>{tutor.totalSessions}</p>
              <p className="text-[10px]" style={{ color: colors.textSecondary }}>Sessions</p>
            </div>
            <div className="rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" style={{ backgroundColor: colors.bgCard }}>
              <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: accentColor.primary }} />
              <p className="text-[14px] font-bold" style={{ color: colors.textPrimary }}>{tutor.responseTime}</p>
              <p className="text-[10px]" style={{ color: colors.textSecondary }}>Response</p>
            </div>
            <div className="rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" style={{ backgroundColor: colors.bgCard }}>
              <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800] mx-auto mb-1" />
              <p className="text-[16px] font-bold" style={{ color: colors.textPrimary }}>{tutor.rating.toFixed(1)}</p>
              <p className="text-[10px]" style={{ color: colors.textSecondary }}>Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="px-6 pb-6"
        >
          <div className="grid grid-cols-2 gap-3">
            {isViewingAsStudent && (
              <>
                {hasConnection ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        const conversationId = connection!.conversationId;
                        let conversationToUse = getConversation(conversationId);
                        if (!conversationToUse) {
                          const newConversation: Conversation = {
                            id: conversationId,
                            name: tutor.name,
                            avatar: tutor.avatar,
                            university: tutor.university,
                            message: "",
                            timestamp: "",
                            unread: false,
                            pinned: false,
                            role: "tutor",
                            tutorId: tutor.id,
                          };
                          addConversation(newConversation);
                          conversationToUse = newConversation;
                        }
                        navigate(`/chat/${conversationId}`, {
                          state: { conversation: conversationToUse },
                        });
                      } catch (e) {
                        console.error("[TutorDetail] Message failed:", e);
                      }
                    }}
                    className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </motion.button>
                ) : pendingRequest ? (
                  <motion.div
                    className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] opacity-80"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Request sent
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        await createRequest(tutor.id, undefined, tutor.subjects?.[0]);
                        // UI will re-render and show "Request sent" via pendingRequest
                      } catch (e) {
                        console.error("[TutorDetail] Request failed:", e);
                      }
                    }}
                    className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Request tutor
                  </motion.button>
                )}
              </>
            )}
            {user?.role === "tutor" && user?.id !== tutorId && hasConnection && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    const conversationId = connection!.conversationId;
                    let conversationToUse = getConversation(conversationId);
                    if (!conversationToUse) {
                      conversationToUse = {
                        id: conversationId,
                        name: tutor.name,
                        avatar: tutor.avatar,
                        university: tutor.university,
                        message: "",
                        timestamp: "",
                        unread: false,
                        pinned: false,
                        role: "tutor",
                        tutorId: tutor.id,
                      };
                      addConversation(conversationToUse);
                    }
                    navigate(`/chat/${conversationId}`, { state: { conversation: conversationToUse } });
                  } catch (e) {
                    console.error("[TutorDetail] Message failed:", e);
                  }
                }}
                className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
              >
                <MessageCircle className="w-5 h-5" />
                Message
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/booking")}
              className={`bg-gradient-to-br ${accentColor.gradient} text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer`}
            >
              <Calendar className="w-5 h-5" />
              Book Lesson
            </motion.button>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 pb-5"
        >
          <h2 className="text-[18px] font-semibold mb-3" style={{ color: colors.textPrimary }}>About</h2>
          <p className="text-[14px] leading-[21px]" style={{ color: colors.textSecondary }}>{tutor.bio}</p>
        </motion.div>

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 pb-5"
        >
          <h2 className="text-[18px] font-semibold mb-3" style={{ color: colors.textPrimary }}>Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map((subject) => (
              <span
                key={subject}
                className="text-[13px] font-medium px-3 py-2 rounded-lg"
                style={{ backgroundColor: accentColor.primary + "1a", color: accentColor.primary }}
              >
                {subject}
              </span>
            ))}
            <span className="text-[13px] font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: colors.borderPrimary, color: colors.textSecondary }}>
              {tutor.learningStyle}
            </span>
          </div>
        </motion.div>

        {/* Availability (only if tutor has set availability) */}
        {(tutor.availability?.length ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-6 pb-5"
          >
            <h2 className="text-[18px] font-semibold mb-3" style={{ color: colors.textPrimary }}>Availability</h2>
            <div className="flex flex-wrap gap-2">
              {(tutor.availability ?? []).map((time) => (
                <span
                  key={time}
                  className="text-[13px] px-3 py-2 rounded-lg border"
                  style={{ backgroundColor: colors.bgCard, color: colors.textPrimary, borderColor: colors.borderPrimary }}
                >
                  {time}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="px-6 pb-6"
        >
          <h2 className="text-[18px] font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Reviews ({tutor.reviewCount})
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>
                    {review.student}
                  </span>
                  <span className="text-[11px]" style={{ color: colors.textSecondary }}>{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
                  ))}
                </div>
                <p className="text-[13px] leading-[19.5px]" style={{ color: colors.textSecondary }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}