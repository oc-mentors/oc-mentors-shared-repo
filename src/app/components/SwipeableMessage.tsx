import { motion, PanInfo } from "motion/react";
import { useState, useRef } from "react";
import { Reply, Paperclip } from "lucide-react";
import { Message } from "../contexts/ConversationsContext";
import { useTheme } from "../contexts/ThemeContext";

interface SwipeableMessageProps {
  message: Message;
  index: number;
  onReply: (message: Message) => void;
}

export function SwipeableMessage({ message, index, onReply }: SwipeableMessageProps) {
  const [dragX, setDragX] = useState(0);
  const constraintsRef = useRef(null);
  const threshold = 60;
  const { colors, accentColor } = useTheme();

  const handleDragEnd = (_: any, info: PanInfo) => {
    // Only trigger reply if swiped right past threshold
    if (info.offset.x > threshold) {
      onReply(message);
    }
    setDragX(0);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    // Limit drag to right direction only and cap at max distance
    const x = Math.max(0, Math.min(info.offset.x, 80));
    setDragX(x);
  };

  return (
    <div
      ref={constraintsRef}
      className={`flex ${message.isSent ? "justify-end" : "justify-start"} relative`}
    >
      {/* Reply Icon Background - shows when swiping */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2"
        animate={{
          opacity: dragX > 20 ? 1 : 0,
          scale: dragX > 20 ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor.primary + "33" }}>
          <Reply className="w-4 h-4" style={{ color: accentColor.primary }} />
        </div>
      </motion.div>

      {/* Message Bubble - draggable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 80 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="touch-pan-y"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className={`max-w-[245px] rounded-2xl px-3 py-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] ${
            message.isSent
              ? `bg-gradient-to-br ${accentColor.gradient}`
              : ""
          }`}
          style={!message.isSent ? { backgroundColor: colors.bgCard } : undefined}
        >
          {/* Reply preview */}
          {message.replyTo && (
            <div
              className={`mb-2 border-l-2 pl-2 py-1 rounded-r text-xs opacity-75 ${
                message.isSent
                  ? "border-white/40 bg-white/10"
                  : ""
              }`}
              style={!message.isSent ? { borderColor: accentColor.primary + "99", backgroundColor: accentColor.primary + "1a" } : undefined}
            >
              <p
                className={`text-[11px] line-clamp-2 ${
                  message.isSent ? "text-white/90" : ""
                }`}
                style={!message.isSent ? { color: colors.textPrimary + "cc" } : undefined}
              >
                {message.replyTo.text}
              </p>
            </div>
          )}

          {/* Attachments */}
          {message.attachments?.map((attachment, idx) => (
            <div key={idx} className="mb-2">
              {attachment.type === "image" ? (
                <img
                  src={attachment.url}
                  alt="Attachment"
                  className="rounded-lg max-w-full mb-2"
                />
              ) : (
                <div className="bg-[rgba(255,255,255,0.1)] rounded-lg p-2 mb-2 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-white" />
                  <span className="text-[12px] text-white truncate">
                    {attachment.name}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Message text */}
          <p
            className={`text-[14px] leading-[20px] mb-0.5 ${
              message.isSent ? "text-white" : ""
            }`}
            style={!message.isSent ? { color: colors.textPrimary } : undefined}
          >
            {message.text}
          </p>

          {/* Timestamp */}
          <p
            className={`text-[10px] ${
              message.isSent ? "text-white/70" : ""
            }`}
            style={!message.isSent ? { color: colors.textSecondary } : undefined}
          >
            {message.time}
          </p>
        </div>
      </motion.div>
    </div>
  );
}