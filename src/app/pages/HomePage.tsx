import { Link } from "react-router";
import { useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-698x0hdriu";
// Placeholder images - replace with actual images when available
const imgDebra = "https://via.placeholder.com/150";
const imgAdam = "https://via.placeholder.com/150";
const imgResource1 = "https://via.placeholder.com/300/200";
const imgResource2 = "https://via.placeholder.com/300/200";
const imgResource3 = "https://via.placeholder.com/300/200";

const subjects = [
  { name: "Chem", gradient: "linear-gradient(135deg, rgb(139, 92, 246) 0%, rgb(124, 58, 237) 100%)", glowColor: "139, 92, 246", icon: "chemistry" },
  { name: "Math", gradient: "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)", glowColor: "59, 130, 246", icon: "math" },
  { name: "Physics", gradient: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(13, 148, 136) 100%)", glowColor: "20, 184, 166", icon: "physics" },
  { name: "Writing", gradient: "linear-gradient(135deg, rgb(236, 72, 153) 0%, rgb(219, 39, 119) 100%)", glowColor: "236, 72, 153", icon: "writing" },
  { name: "Biology", gradient: "linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)", glowColor: "34, 197, 94", icon: "biology" },
];

const meetings = [
  {
    id: 1,
    name: "Debra Peterson",
    subject: "Math 2A • Visual Learning",
    time: "Today at 6:30  PM",
    image: imgDebra,
    isActive: true,
  },
  {
    id: 2,
    name: "Adam Smith",
    subject: "Chemistry 1A • Hands-on Practice",
    time: "Tomorrow at 5:30 PM",
    image: imgAdam,
    isActive: true,
  },
];

const resources = [
  { id: 1, image: "https://images.unsplash.com/photo-1758685734312-5134968399a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWx1cyUyMG1hdGhlbWF0aWNzJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MDkzMTk2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Calculus Basics" },
  { id: 2, image: "https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBsYWIlMjBiZWFrZXJzfGVufDF8fHx8MTc3MDkzMTk2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Chemistry 101" },
  { id: 3, image: "https://images.unsplash.com/photo-1756829007483-414057ed33cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwc2NpZW5jZSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzA4MjM1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Physics Guide" },
];

function SubjectIcon({ type }: { type: string }) {
  switch (type) {
    case "chemistry":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p348d6100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M8.603 19.998H23.393" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M11.332 2.666H20.664" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "math":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.pc719df0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 7.999H21.331" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M21.331 18.664V23.998" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M21.331 13.332H21.344" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 13.332H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 13.332H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 18.664H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 18.664H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 23.997H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 23.997H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "physics":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p1e5ad680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p38050500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p17a90e00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "writing":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p2dc07680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p3e24f6c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p30ef680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p1df66f80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "biology":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p337b5b80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p38e6cc00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.pdbafac0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p2a477d80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p47451c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p1aeaf500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p7900e20} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p2547b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p33a21180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.pda79840} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p25382640} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    default:
      return null;
  }
}

function CircularProgress({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          cx="48"
          cy="48"
          r="44"
          stroke="rgba(91, 124, 235, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="44"
          stroke="rgb(91, 124, 235)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[#e8edf5]">{percentage}%</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-[#a8b3cf] tracking-[1.95px] uppercase">
              OC MENTORS
            </h2>
            <ProfileButton />
          </div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-[44px] font-bold text-[#e8edf5] leading-tight">
              Hi, Daniyal 👋
            </h1>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#a8b3cf]" />
              <p className="text-[#a8b3cf] text-base italic">
                You have Chemistry with Dedra in 2 hours
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <Link to="/progress">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-[17px] shadow-[0px_4px_24px_0px_rgba(91,124,235,0.3)] transition-shadow hover:shadow-[0px_6px_32px_0px_rgba(91,124,235,0.4)] cursor-pointer"
              style={{
                backgroundImage: "linear-gradient(170.7deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)",
              }}
            >
              Start Today's Learning Plan
            </motion.button>
          </Link>
        </motion.div>

        {/* Today's Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-8"
        >
          <h3 className="text-xl font-bold text-[#e8edf5] mb-4">Today's Plan</h3>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-[#1e2139] rounded-3xl p-6 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <CircularProgress percentage={80} />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#e8edf5] mb-1">
                  80% Complete
                </h4>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#a8b3cf]">Next task:</p>
                  <p className="text-sm text-[#a8b3cf]">
                    Finish Math Homework<br />(2 min)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Choose a subject */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-8"
        >
          <h3 className="text-lg font-bold text-[#e8edf5] mb-4">Choose a subject</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-2 px-2">
            {subjects.map((subject, index) => (
              <Link key={subject.name} to="/tutors">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                >
                  <div
                    className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundImage: subject.gradient,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <SubjectIcon type={subject.icon} />
                  </div>
                  <span className="text-[11px] font-medium text-[#a8b3cf]">
                    {subject.name}
                  </span>
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Meeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#e8edf5]">Upcoming Meeting</h3>
            <Link to="/schedule">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[13px] font-semibold text-[#5b7ceb]"
              >
                View All
              </motion.button>
            </Link>
          </div>

          <div className="space-y-3">
            {meetings.map((meeting, index) => (
              <Link key={meeting.id} to="/schedule">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={meeting.image}
                        alt={meeting.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      {meeting.isActive && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#5b7ceb] border-2 border-[#1a1d29] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-semibold text-[#e8edf5] mb-1">
                        {meeting.name}
                      </h4>
                      <p className="text-[13px] text-[#a8b3cf] mb-1">
                        {meeting.subject}
                      </p>
                      <p className="text-xs font-medium text-[#5b7ceb]">
                        {meeting.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recommended Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-6"
        >
          <h3 className="text-lg font-bold text-[#e8edf5] mb-4">Recommended Resources</h3>
          <div className="grid grid-cols-2 gap-3">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-2xl overflow-hidden shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer group"
              >
                <ImageWithFallback
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold">{resource.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav currentPage="home" />

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}