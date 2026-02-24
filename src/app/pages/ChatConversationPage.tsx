import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation, useParams } from "react-router";
import { ArrowLeft, Send, Paperclip, Smile, Calendar, ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-7ytfg5hjyn";
import { useConversations, type Message, type Conversation } from "../contexts/ConversationsContext";

export default function ChatConversationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { getConversation, getMessages, addMessage, setMessagesForConversation, updateConversation } = useConversations();
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      };
      
      // Add message to context
      addMessage(conversationId, newMessage);
      
      // Update local state
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setTimeout(scrollToBottom, 100);
    }
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
    <div className="min-h-screen bg-[#1a1d29] flex flex-col">
      <div className="max-w-md mx-auto flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="px-6 pt-3 pb-4 relative">
          {/* Back Button - Left Side */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="absolute left-6 top-3 w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-[#e8edf5]" />
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
              <h2 className="text-[18px] font-semibold text-[#e8edf5]">{currentConversation.name}</h2>
              <span className="text-[12px] text-[#a8b3cf] capitalize">{currentConversation.role}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[245px] rounded-2xl px-3 py-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] ${
                    message.isSent
                      ? "bg-gradient-to-br from-[#4361d9] to-[#5b7ceb]"
                      : "bg-[#1e2139]"
                  }`}
                >
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
                  <p
                    className={`text-[14px] leading-[20px] mb-0.5 ${
                      message.isSent ? "text-white" : "text-[#e8edf5]"
                    }`}
                  >
                    {message.text}
                  </p>
                  <p
                    className={`text-[10px] ${
                      message.isSent ? "text-white/70" : "text-[#a8b3cf]"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Book a Lesson Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/booking")}
            className="w-full bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] rounded-xl py-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2"
          >
            <Calendar className="w-[18px] h-[18px] text-white" />
            <span className="text-[15px] font-semibold text-white">Book a Lesson</span>
          </motion.button>
        </motion.div>

        {/* Input Area */}
        <div className="bg-[#1a1d29] border-t border-[rgba(255,255,255,0.12)] px-5 py-4">
          <div className="flex items-center gap-3">
            {/* Attach Button */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-11 h-11 bg-[#2a2f4a] rounded-full flex items-center justify-center"
              >
                <Paperclip className="w-5 h-5 text-[#a8b3cf]" />
              </motion.button>

              {/* Attach Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-[#2a2f4a] rounded-xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.08)] overflow-hidden"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(91, 124, 235, 0.1)" }}
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-3 flex items-center gap-3 whitespace-nowrap"
                    >
                      <ImageIcon className="w-5 h-5 text-[#5b7ceb]" />
                      <span className="text-[14px] text-[#e8edf5]">Send Image</span>
                    </motion.button>
                    <div className="h-px bg-[rgba(255,255,255,0.08)]" />
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(91, 124, 235, 0.1)" }}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 flex items-center gap-3 whitespace-nowrap"
                    >
                      <Paperclip className="w-5 h-5 text-[#5b7ceb]" />
                      <span className="text-[14px] text-[#e8edf5]">Send File</span>
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
            <div className="flex-1 bg-[#2a2f4a] rounded-full px-5 py-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full bg-transparent text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none"
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="w-11 h-11 bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] rounded-full shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-center"
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

        {/* Click outside to close attach menu */}
        {showAttachMenu && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowAttachMenu(false)}
          />
        )}
      </div>
    </div>
  );
}