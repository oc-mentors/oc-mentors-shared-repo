import { motion } from "motion/react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ChevronLeft, Star, MapPin, BookOpen, Calendar, MessageCircle, Clock } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useConversations, Conversation } from "../contexts/ConversationsContext";

export default function TutorDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const tutorId = params.id ? parseInt(params.id) : 1;
  const { hasConversation, addConversation, getConversation } = useConversations();

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

  // Complete tutor data for all tutors
  const tutorsData = [
    {
      id: 1,
      name: "Debra Peterson",
      avatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "Mathematics • Senior",
      subjects: ["Math 2A", "Math 2B", "Calculus", "Linear Algebra"],
      learningStyle: "Visual Learning",
      rating: 4.5,
      reviewCount: 127,
      priceLevel: "$$$",
      pricePerHour: 45,
      bio: "Hi! I'm Debra, a senior Mathematics major at UCI. I've been tutoring for 3 years and I specialize in helping students master calculus concepts. My teaching style focuses on visual learning and breaking down complex problems into simple, understandable steps.",
      availability: ["Mon 2-5pm", "Wed 2-5pm", "Fri 2-5pm"],
      totalSessions: 234,
      responseTime: "< 1 hour",
    },
    {
      id: 2,
      name: "Adam Smith",
      avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "Applied Mathematics • Junior",
      subjects: ["Math 2A", "Math 2B", "Calculus", "Statistics"],
      learningStyle: "Auditory Learning",
      rating: 4.8,
      reviewCount: 203,
      priceLevel: "$$",
      pricePerHour: 35,
      bio: "Hey there! I'm Adam, a junior studying Applied Mathematics. I love helping students understand calculus and statistics through clear explanations and real-world examples. I believe in making math accessible and fun for everyone!",
      availability: ["Tue 3-6pm", "Thu 3-6pm", "Sat 10am-2pm"],
      totalSessions: 312,
      responseTime: "< 2 hours",
    },
    {
      id: 3,
      name: "Maarya Khan",
      avatar: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNjaWVudGlzdCUyMHJlc2VhcmNoZXJ8ZW58MXx8fHwxNzcwOTI5MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "Mathematics & Writing • Senior",
      subjects: ["Math", "Writing", "Calculus", "Academic Writing"],
      learningStyle: "Reading & Writing",
      rating: 5.0,
      reviewCount: 89,
      priceLevel: "$",
      pricePerHour: 25,
      bio: "Hello! I'm Maarya, and I'm passionate about both math and writing. I help students develop strong analytical and communication skills. Whether it's calculus or essay writing, I'm here to help you succeed!",
      availability: ["Mon 4-7pm", "Wed 4-7pm", "Fri 1-4pm"],
      totalSessions: 167,
      responseTime: "< 3 hours",
    },
    {
      id: 4,
      name: "James Chen",
      avatar: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDkwNTA3NHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "Chemistry & Biology • Senior",
      subjects: ["Chemistry", "Biology", "Organic Chemistry", "Cell Biology"],
      learningStyle: "Hands-on Practice",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "$$",
      pricePerHour: 40,
      bio: "Hi! I'm James, a Chemistry and Biology double major. I love helping students understand complex scientific concepts through practical examples and hands-on learning. Let's make science fun together!",
      availability: ["Mon 1-5pm", "Tue 1-5pm", "Thu 1-5pm"],
      totalSessions: 245,
      responseTime: "< 1 hour",
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDg5MjQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "Physics • Graduate Student",
      subjects: ["Physics", "Mechanics", "Electromagnetism", "Quantum Physics"],
      learningStyle: "Visual Learning",
      rating: 4.9,
      reviewCount: 178,
      priceLevel: "$$$",
      pricePerHour: 50,
      bio: "Hello! I'm Emily, a Physics graduate student at UCI. I specialize in making complex physics concepts accessible through visual aids and real-world applications. I'm here to help you master physics!",
      availability: ["Wed 2-6pm", "Fri 2-6pm", "Sun 10am-2pm"],
      totalSessions: 289,
      responseTime: "< 1 hour",
    },
    {
      id: 6,
      name: "Sarah Martinez",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHNtaWxlfGVufDF8fHx8MTc3MDkzNTU5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "English Literature • Senior",
      subjects: ["English", "Writing", "Literature", "Essay Writing"],
      learningStyle: "Reading & Writing",
      rating: 4.6,
      reviewCount: 142,
      priceLevel: "$$",
      pricePerHour: 30,
      bio: "Hi there! I'm Sarah, an English Literature major with a passion for writing and analysis. I help students develop strong writing skills and literary analysis techniques. Let's improve your writing together!",
      availability: ["Tue 2-5pm", "Thu 2-5pm", "Sat 1-4pm"],
      totalSessions: 198,
      responseTime: "< 2 hours",
    },
    {
      id: 7,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NzA5MzU1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      major: "History & English • Junior",
      subjects: ["History", "English", "World History", "US History"],
      learningStyle: "Auditory Learning",
      rating: 4.4,
      reviewCount: 98,
      priceLevel: "$",
      pricePerHour: 28,
      bio: "Hey! I'm David, a History and English double major. I love making history come alive through engaging stories and discussions. Whether it's ancient civilizations or modern history, I'm here to help you excel!",
      availability: ["Mon 3-6pm", "Wed 3-6pm", "Fri 3-6pm"],
      totalSessions: 145,
      responseTime: "< 4 hours",
    },
  ];

  const tutor = tutorsData.find(t => t.id === tutorId) || tutorsData[0];

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
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-3 pb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-[#e8edf5]" />
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
            <ImageWithFallback
              src={tutor.avatar}
              alt={tutor.name}
              className="w-24 h-24 rounded-2xl object-cover shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            />
            <div className="flex-1">
              <h1 className="text-[24px] font-bold text-[#e8edf5] mb-1">{tutor.name}</h1>
              <p className="text-[13px] text-[#a8b3cf] mb-2">{tutor.university}</p>
              <p className="text-[12px] text-[#a8b3cf] mb-3">{tutor.major}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
                <span className="text-[16px] font-bold text-[#e8edf5]">
                  {tutor.rating.toFixed(1)}
                </span>
                <span className="text-[13px] text-[#a8b3cf]">({tutor.reviewCount} reviews)</span>
              </div>
              <span className="text-[18px] font-bold text-[#5b7ceb]">{tutor.priceLevel}</span>
              <span className="text-[13px] text-[#a8b3cf] ml-2">${tutor.pricePerHour}/hr</span>
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
            <div className="bg-[#1e2139] rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <BookOpen className="w-5 h-5 text-[#5b7ceb] mx-auto mb-1" />
              <p className="text-[16px] font-bold text-[#e8edf5]">{tutor.totalSessions}</p>
              <p className="text-[10px] text-[#a8b3cf]">Sessions</p>
            </div>
            <div className="bg-[#1e2139] rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <Clock className="w-5 h-5 text-[#5b7ceb] mx-auto mb-1" />
              <p className="text-[14px] font-bold text-[#e8edf5]">{tutor.responseTime}</p>
              <p className="text-[10px] text-[#a8b3cf]">Response</p>
            </div>
            <div className="bg-[#1e2139] rounded-xl p-3 text-center shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800] mx-auto mb-1" />
              <p className="text-[16px] font-bold text-[#e8edf5]">{tutor.rating.toFixed(1)}</p>
              <p className="text-[10px] text-[#a8b3cf]">Rating</p>
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Check if conversation exists
                let conversationToUse = getConversation(tutor.id);
                
                // If not, create it
                if (!conversationToUse) {
                  const newConversation: Conversation = {
                    id: tutor.id,
                    name: tutor.name,
                    avatar: tutor.avatar,
                    university: tutor.university,
                    message: "",
                    timestamp: "",
                    unread: false,
                    pinned: false,
                    role: "tutor",
                  };
                  addConversation(newConversation);
                  conversationToUse = newConversation;
                }
                
                // Navigate to the chat
                navigate(`/chat/${tutor.id}`, { 
                  state: { 
                    conversation: conversationToUse,
                  }
                });
              }}
              className="bg-[#2a2f4a] text-[#e8edf5] py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/booking")}
              className="bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
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
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-3">About</h2>
          <p className="text-[14px] text-[#a8b3cf] leading-[21px]">{tutor.bio}</p>
        </motion.div>

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 pb-5"
        >
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-3">Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map((subject) => (
              <span
                key={subject}
                className="bg-[rgba(91,124,235,0.1)] text-[#5b7ceb] text-[13px] font-medium px-3 py-2 rounded-lg"
              >
                {subject}
              </span>
            ))}
            <span className="bg-[rgba(168,179,207,0.1)] text-[#a8b3cf] text-[13px] font-medium px-3 py-2 rounded-lg">
              {tutor.learningStyle}
            </span>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 pb-5"
        >
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-3">Availability</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.availability.map((time) => (
              <span
                key={time}
                className="bg-[#1e2139] text-[#e8edf5] text-[13px] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)]"
              >
                {time}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="px-6 pb-6"
        >
          <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-3">
            Reviews ({tutor.reviewCount})
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#1e2139] rounded-xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-[#e8edf5]">
                    {review.student}
                  </span>
                  <span className="text-[11px] text-[#a8b3cf]">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
                  ))}
                </div>
                <p className="text-[13px] text-[#a8b3cf] leading-[19.5px]">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}