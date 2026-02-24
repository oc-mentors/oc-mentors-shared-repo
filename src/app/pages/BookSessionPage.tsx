import { Link, useNavigate } from "react-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { ProfileButton } from "../components/ProfileButton";

interface Course {
  id: string;
  name: string;
  code: string;
  subject: string;
  color: string;
  description: string;
}

export default function BookSessionPage() {
  const navigate = useNavigate();

  const enrolledCourses: Course[] = [
    {
      id: "1",
      name: "General Chemistry",
      code: "CHEM 1A",
      subject: "Chemistry",
      color: "from-[#14b8a6] to-[#0891b2]",
      description: "Atomic structure, bonding, reactions",
    },
    {
      id: "2",
      name: "Calculus I",
      code: "MATH 2A",
      subject: "Math",
      color: "from-[#5b7ceb] to-[#7c3aed]",
      description: "Limits, derivatives, integrals",
    },
    {
      id: "3",
      name: "Classical Mechanics",
      code: "PHYS 7C",
      subject: "Physics",
      color: "from-[#8b5cf6] to-[#a855f7]",
      description: "Newton's laws, energy, momentum",
    },
    {
      id: "4",
      name: "Academic Writing",
      code: "WRIT 39B",
      subject: "Writing",
      color: "from-[#ec4899] to-[#f43f5e]",
      description: "Essay composition and critical analysis",
    },
    {
      id: "5",
      name: "DNA to Organisms",
      code: "BIO SCI 93",
      subject: "Biology",
      color: "from-[#10b981] to-[#14b8a6]",
      description: "Genetics, evolution, cellular biology",
    },
  ];

  const handleCourseSelect = (subject: string) => {
    navigate(`/book-session/${subject.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-2">
            <Link to="/schedule">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#e8edf5] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <ProfileButton />
          </div>
          <h1 className="text-[28px] font-bold text-[#e8edf5] mb-2">Book a Session</h1>
          <p className="text-[15px] text-[#a8b3cf]">
            Select a class to find available tutors
          </p>
        </div>

        {/* Enrolled Courses */}
        <div className="px-6 space-y-4">
          {enrolledCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCourseSelect(course.subject)}
              className="cursor-pointer"
            >
              <div className="bg-[#1e2139] rounded-2xl p-5 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.2)] transition-all">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-[#a8b3cf]">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-[#e8edf5] mb-1">
                      {course.name}
                    </h3>
                    <p className="text-[13px] text-[#a8b3cf]">
                      {course.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-[#a8b3cf] flex-shrink-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 mt-6"
        >
          <div className="bg-[rgba(91,124,235,0.1)] rounded-xl p-4 border border-[rgba(91,124,235,0.2)]">
            <p className="text-[13px] text-[#a8b3cf] leading-relaxed">
              💡 <span className="font-semibold text-[#5b7ceb]">Tip:</span> Select a
              course to see tutors who specialize in that subject. You can book
              sessions with tutors who match your learning style and schedule.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}