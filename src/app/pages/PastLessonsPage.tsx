import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Star, MessageSquare } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface Session {
  id: number;
  subject: string;
  tutor: string;
  tutorAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: "completed";
}

const pastSessions: Session[] = [
  {
    id: 3,
    subject: "Math 2A - Derivatives",
    tutor: "Debra Peterson",
    tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Nov 5, 2025",
    time: "2:00 PM",
    duration: "1 hour",
    status: "completed",
  },
  {
    id: 4,
    subject: "Chemistry - Organic Reactions",
    tutor: "Dr. Sarah Johnson",
    tutorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlYWNoZXJ8ZW58MXx8fHwxNzM5NDg1MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Oct 28, 2025",
    time: "3:30 PM",
    duration: "1.5 hours",
    status: "completed",
  },
  {
    id: 5,
    subject: "Physics - Thermodynamics",
    tutor: "Adam Smith",
    tutorAvatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Oct 25, 2025",
    time: "10:00 AM",
    duration: "1 hour",
    status: "completed",
  },
  {
    id: 6,
    subject: "Writing 39B - Essay Structure",
    tutor: "Jennifer Lee",
    tutorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlYWNoZXJ8ZW58MXx8fHwxNzM5NDg1MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Oct 20, 2025",
    time: "1:00 PM",
    duration: "1 hour",
    status: "completed",
  },
  {
    id: 7,
    subject: "Biology - Cell Biology",
    tutor: "Dr. Martinez",
    tutorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBtYW4lMjB0ZWFjaGVyfGVufDF8fHx8MTczOTQ4NTA4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Oct 18, 2025",
    time: "4:00 PM",
    duration: "1 hour",
    status: "completed",
  },
];

export default function PastLessonsPage() {
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.bgCard }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </motion.button>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Past Lessons</h1>
          </div>
        </div>

        {/* Past Lessons List */}
        <div className="px-6 space-y-4">
          {pastSessions.length > 0 ? (
            pastSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
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
                      <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                        {session.subject}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}>
                        completed
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>with {session.tutor}</p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/rate-session", {
                    state: {
                      session: {
                        tutor: session.tutor,
                        subject: session.subject,
                      },
                    },
                  })}
                  className="w-full bg-transparent py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border-2"
                  style={{ color: accentColor.primary, borderColor: accentColor.primary }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Leave a Review
                </motion.button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-8 border text-center"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
            >
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No past lessons found
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}