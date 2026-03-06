import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, Star, MapPin, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTheme } from "../contexts/ThemeContext";

interface Tutor {
  id: number;
  name: string;
  avatar: string;
  university: string;
  subjects: string[];
  learningStyle: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  review: string;
}

const subjects = ["All", "Math", "Science", "English", "History", "Writing", "Chemistry", "Physics", "Biology"];

export default function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const { colors, accentColor } = useTheme();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showTopFade, setShowTopFade] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleListScroll = () => {
    if (listContainerRef.current) {
      setShowTopFade(listContainerRef.current.scrollTop > 0);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftFade(scrollLeft > 0);
      // Use a small buffer (e.g. 1px) to account for potential rounding issues
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    // Re-check on resize
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Debra Peterson",
      avatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["Math"],
      learningStyle: "Visual Learning",
      rating: 4.5,
      reviewCount: 127,
      priceLevel: "$$$",
      review: "Debra is the best Math tutor I ever had! She helped me pass Math 2A!",
    },
    {
      id: 2,
      name: "Adam Smith",
      avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["Math"],
      learningStyle: "Auditory Learning",
      rating: 4.8,
      reviewCount: 203,
      priceLevel: "$$",
      review: "Adam explains complex concepts clearly and is very patient!",
    },
    {
      id: 3,
      name: "Maarya Khan",
      avatar: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNjaWVudGlzdCUyMHJlc2VhcmNoZXJ8ZW58MXx8fHwxNzcwOTI5MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["Math", "Writing"],
      learningStyle: "Reading & Writing",
      rating: 5.0,
      reviewCount: 89,
      priceLevel: "$",
      review: "Very affordable and helpful! Great for calculus students.",
    },
    {
      id: 4,
      name: "James Chen",
      avatar: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDkwNTA3NHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["Science", "Chemistry", "Biology"],
      learningStyle: "Hands-on Practice",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "$$",
      review: "Fantastic tutor for Chemistry and Biology!",
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDg5MjQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["Science", "Physics"],
      learningStyle: "Visual Learning",
      rating: 4.9,
      reviewCount: 178,
      priceLevel: "$$$",
      review: "Amazing at explaining complex concepts!",
    },
    {
      id: 6,
      name: "Sarah Martinez",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHNtaWxlfGVufDF8fHx8MTc3MDkzNTU5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["English", "Writing"],
      learningStyle: "Reading & Writing",
      rating: 4.6,
      reviewCount: 142,
      priceLevel: "$$",
      review: "Great for essay writing and literature analysis!",
    },
    {
      id: 7,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NzA5MzU1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      university: "University of California, Irvine",
      subjects: ["History", "English"],
      learningStyle: "Auditory Learning",
      rating: 4.4,
      reviewCount: 98,
      priceLevel: "$",
      review: "Excellent history tutor with engaging teaching style!",
    },
  ];

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSubject =
      selectedSubject === "All" || tutor.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full h-full flex flex-col relative">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 relative z-10" style={{ backgroundColor: colors.bgPrimary }}>
          {/* Header with Profile Button */}
          <div className="px-6 pt-12 pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>Find Tutors</h1>
              <ProfileButton />
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-6 pt-4 pb-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-12 pr-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                style={{
                  backgroundColor: colors.bgTertiary,
                  color: colors.textPrimary,
                  borderColor: 'transparent'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = accentColor.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              />
            </div>
          </motion.div>

          {/* Subject Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="px-6 pb-5"
          >
            <div className="relative">
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              >
                {subjects.map((subject, index) => (
                  <motion.button
                    key={subject}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(subject)}
                    className="px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                    style={{
                      backgroundColor: selectedSubject === subject ? accentColor.primary : colors.bgTertiary,
                      color: selectedSubject === subject ? 'white' : colors.textSecondary,
                      boxShadow: selectedSubject === subject ? `0px 4px 12px 0px ${accentColor.primary}40` : 'none'
                    }}
                  >
                    {subject}
                  </motion.button>
                ))}
              </div>
              {/* Gradient Fades */}
              <AnimatePresence>
                {showLeftFade && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 top-0 bottom-2 w-12 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${colors.bgPrimary}, transparent)` }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showRightFade && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none"
                    style={{ background: `linear-gradient(to left, ${colors.bgPrimary}, transparent)` }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Tutors List */}
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
            ref={listContainerRef}
            onScroll={handleListScroll}
            className="h-full overflow-y-auto px-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <AnimatePresence mode="popLayout">
              {filteredTutors.map((tutor, index) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  layout
                  className="mb-4"
                >
                  <Link to={`/tutor/${tutor.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border cursor-pointer"
                      style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                    >
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <ImageWithFallback
                          src={tutor.avatar}
                          alt={tutor.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Price */}
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
                              {tutor.name}
                            </h3>
                            <span className="text-[11px] font-semibold flex-shrink-0 ml-2" style={{ color: accentColor.primary }}>
                              {tutor.priceLevel}
                            </span>
                          </div>

                          {/* University */}
                          <p className="text-[11px] mb-2" style={{ color: colors.textSecondary }}>
                            {tutor.university}
                          </p>

                          {/* Subjects & Learning Style */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {tutor.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="text-[10px] px-2 py-1 rounded"
                                style={{ backgroundColor: `${accentColor.primary}20`, color: accentColor.primary }}
                              >
                                {subject}
                              </span>
                            ))}
                            <span className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: `${colors.textSecondary}20`, color: colors.textSecondary }}>
                              • {tutor.learningStyle}
                            </span>
                          </div>

                          {/* Review */}
                          <p className="text-[13px] italic line-clamp-2 mb-2" style={{ color: colors.textSecondary }}>
                            "{tutor.review}"
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                            <span className="text-[13px] font-semibold" style={{ color: colors.textPrimary }}>
                              {tutor.rating.toFixed(1)}
                            </span>
                            <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                              ({tutor.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredTutors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-[15px] mb-2" style={{ color: colors.textSecondary }}>No tutors found</p>
                <p className="text-[13px]" style={{ color: colors.textSecondary, opacity: 0.7 }}>
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <BottomNav currentPage="tutors" />
    </div>
  );
}