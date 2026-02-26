import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation, useParams } from "react-router";
import { ArrowLeft, Send, Paperclip, Smile, Calendar, ImageIcon, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-7ytfg5hjyn";
import { useConversations, type Message, type Conversation } from "../contexts/ConversationsContext";
import { SwipeableMessage } from "../components/SwipeableMessage";
import { useTheme } from "../contexts/ThemeContext";

export default function ChatConversationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { getConversation, getMessages, addMessage, setMessagesForConversation, updateConversation } = useConversations();
  const { colors, accentColor } = useTheme();
  
  // Get conversation data from location state or find by ID
  const conversationFromState = location.state?.conversation as Conversation | undefined;
  const conversationId = params.id ? parseInt(params.id) : conversationFromState?.id || 1;
  
  // Get the conversation from context
  const currentConversation = conversationFromState || getConversation(conversationId);

  // Get messages from context
  const contextMessages = getMessages(conversationId);
  const [messages, setMessages] = useState<Message[]>(contextMessages);
  
  // Update local messages when context messages change or conversationId changes
  useEffect(() => {
    const newMessages = getMessages(conversationId);
    setMessages(newMessages);
  }, [conversationId, contextMessages.length]);

  // Mark conversation as read when entering the chat
  useEffect(() => {
    if (currentConversation?.unread) {
      updateConversation(conversationId, { unread: false });
    }
  }, [conversationId]);

  const [messageInput, setMessageInput] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);

  const handleMessagesScroll = () => {
    if (messagesContainerRef.current) {
      setShowTopFade(messagesContainerRef.current.scrollTop > 0);
    }
  };

  // If no conversation found, navigate back to messages
  useEffect(() => {
    if (!currentConversation) {
      navigate('/chat', { replace: true });
    }
  }, [currentConversation, navigate]);

  // Early return if no conversation (will redirect via useEffect)
  if (!currentConversation) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        isSent: true,
        ...(replyingTo && {
          replyTo: {
            id: replyingTo.id,
            text: replyingTo.text,
            isSent: replyingTo.isSent,
          },
        }),
      };
      
      // Add message to context
      addMessage(conversationId, newMessage);
      
      // Update local state
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setReplyingTo(null);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const newMessage: Message = {
        id: messages.length + 1,
        text: type === "image" ? "Sent an image" : `Sent a file: ${file.name}`,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        isSent: true,
        attachments: [{ type, url, name: file.name }],
      };
      
      // Add message to context
      addMessage(conversationId, newMessage);
      
      // Update local state
      setMessages([...messages, newMessage]);
      setShowAttachMenu(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto flex flex-col h-full w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-3 pb-4 relative flex-shrink-0">
          {/* Back Button - Left Side */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="absolute left-6 top-3 w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
          </motion.button>
          
          {/* Profile Photo and Name - Centered */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Store navigation context in sessionStorage
                sessionStorage.setItem('tutorNavSource', 'chat');
                sessionStorage.setItem('tutorNavChatId', conversationId.toString());
                navigate(`/tutor/${conversationId}`);
              }}
              className="cursor-pointer"
            >
              <ImageWithFallback
                src={currentConversation.avatar}
                alt={currentConversation.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </motion.button>
            <div className="flex flex-col items-center gap-0.5">
              <h2 className="text-[18px] font-semibold" style={{ color: colors.textPrimary }}>{currentConversation.name}</h2>
              <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                {currentConversation.role === 'ta' ? 'TA' : currentConversation.role.charAt(0).toUpperCase() + currentConversation.role.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
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
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="h-full overflow-y-auto px-5 py-5 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <SwipeableMessage
                  key={message.id}
                  message={message}
                  index={index}
                  onReply={handleReply}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Book a Lesson Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-3 flex-shrink-0"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/booking")}
            className={`w-full bg-gradient-to-br ${accentColor.gradient} rounded-xl py-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2`}
          >
            <Calendar className="w-[18px] h-[18px] text-white" />
            <span className="text-[15px] font-semibold text-white">Book a Lesson</span>
          </motion.button>
        </motion.div>

        {/* Input Area */}
        <div className="border-t px-5 py-4 flex-shrink-0" style={{ backgroundColor: colors.bgPrimary, borderColor: colors.borderSecondary }}>
          {/* Reply Preview Banner */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3 rounded-xl p-3 border"
                style={{ backgroundColor: colors.bgCard, borderColor: accentColor.primary + "4d" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: accentColor.primary }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
                          {replyingTo.text}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setReplyingTo(null)}
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: colors.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3">
            {/* Attach Button */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <Paperclip className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>

              {/* Attach Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 rounded-xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.6)] border overflow-hidden"
                    style={{ backgroundColor: colors.bgTertiary, borderColor: colors.borderPrimary }}
                  >
                    <motion.button
                      whileHover={{ backgroundColor: accentColor.primary + "1a" }}
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-3 flex items-center gap-3 whitespace-nowrap"
                    >
                      <ImageIcon className="w-5 h-5" style={{ color: accentColor.primary }} />
                      <span className="text-[14px]" style={{ color: colors.textPrimary }}>Send Image</span>
                    </motion.button>
                    <div className="h-px" style={{ backgroundColor: colors.borderPrimary }} />
                    <motion.button
                      whileHover={{ backgroundColor: accentColor.primary + "1a" }}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 flex items-center gap-3 whitespace-nowrap"
                    >
                      <Paperclip className="w-5 h-5" style={{ color: accentColor.primary }} />
                      <span className="text-[14px]" style={{ color: colors.textPrimary }}>Send File</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "image")}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "file")}
              />
            </div>

            {/* Text Input */}
            <div className="flex-1 rounded-full px-5 py-3" style={{ backgroundColor: colors.bgTertiary }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: colors.textPrimary }}
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className={`w-11 h-11 bg-gradient-to-br ${accentColor.gradient} rounded-full shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-center`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <g clipPath="url(#clip-send)">
                  <path
                    d={svgPaths.p1181b5c0}
                    stroke="white"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={svgPaths.p12efb0a0}
                    stroke="white"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip-send">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}