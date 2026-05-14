import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Video, VideoOff, Mic, MicOff, Monitor, Users, MessageSquare, Settings, MoreVertical, PhoneOff, Shield, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const tutorPipPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='160' viewBox='0 0 128 160'%3E%3Crect fill='%232c3042' width='128' height='160'/%3E%3Ccircle cx='64' cy='58' r='22' fill='%23475569'/%3E%3Cpath d='M32 132c8-28 56-28 64 0' fill='%23475569'/%3E%3C/svg%3E";

export default function VideoSessionPage() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleLeave = () => {
    const confirm = window.confirm("Are you sure you want to leave the session?");
    if (confirm) {
      navigate("/rate-session", {
        state: {
          session: {
            tutor: "Tutor",
            subject: "Tutoring session",
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#2c3042] relative overflow-hidden">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Top Bar */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageWithFallback
              src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8H8V6Z' fill='%234F4F4F'/%3E%3Cpath d='M6 8H18C19.1046 8 20 8.89543 20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V10C4 8.89543 4.89543 8 6 8Z' fill='%234F4F4F'/%3E%3C/svg%3E"
              alt="Video icon"
              className="w-6 h-6"
            />
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-[#4ade80]" />
              <span className="text-[#4F4F4F] text-[14px] font-medium">Zoom</span>
              <ChevronDown className="w-4 h-4 text-[#4F4F4F]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="bg-[#ef4444] text-white px-4 py-1.5 rounded-md text-[14px] font-medium"
            >
              Leave
            </motion.button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 px-4 pb-4 relative">
          <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative shadow-[0px_8px_24px_0px_rgba(0,0,0,0.8)]">
            {/* Shared Screen Content - Math Equations */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758685734312-5134968399a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoJTIwZXF1YXRpb25zJTIwY2hhbGtib2FyZCUyMGZvcm11bGFzfGVufDF8fHx8MTc3MDkzMDQyMXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Math equations"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tutor Video Overlay (Picture-in-Picture) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 right-4 w-32 h-40 rounded-xl overflow-hidden shadow-[0px_4px_16px_0px_rgba(0,0,0,0.8)] border-2 border-[rgba(255,255,255,0.2)]"
            >
              <ImageWithFallback
                src={tutorPipPlaceholder}
                alt="Tutor"
                className="w-full h-full object-cover"
              />
              {/* Name Label */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,0.7)] text-white text-[10px] px-2 py-1 rounded-md">
                Tutor
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#f5f5f5] rounded-t-3xl p-4 shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-around">
            {/* Mute/Unmute */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                isMuted ? "bg-[#ef4444]" : "bg-white"
              }`}>
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-[#1f2937]" />
                )}
              </div>
              <span className="text-[11px] text-[#1f2937]">{isMuted ? "Unmute" : "Mute"}</span>
            </motion.button>

            {/* Video On/Off */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                !isVideoOn ? "bg-[#ef4444]" : "bg-white"
              }`}>
                {isVideoOn ? (
                  <Video className="w-6 h-6 text-[#1f2937]" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-[11px] text-[#1f2937]">Video</span>
            </motion.button>

            {/* Share Screen */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 bg-[#4ade80] rounded-xl flex items-center justify-center shadow-[0px_4px_12px_0px_rgba(74,222,128,0.4)]">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-[#1f2937]">Share Screen</span>
            </motion.button>

            {/* Participants */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#1f2937]" />
              </div>
              <span className="text-[11px] text-[#1f2937]">People</span>
            </motion.button>

            {/* More Options */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <MoreVertical className="w-6 h-6 text-[#1f2937]" />
              </div>
              <span className="text-[11px] text-[#1f2937]">More</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}