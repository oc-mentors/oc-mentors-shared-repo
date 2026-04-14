import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useState, useRef } from "react";
import { Search, X, MoreVertical, Pin, PinOff, Mail, MailOpen, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useConversations } from "../contexts/ConversationsContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations, updateConversation, deleteConversation } = useConversations();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "tutor" | "professor" | "ta" | "peer" | "student">("all");
  const { colors, accentColor } = useTheme();
  const isTutor = user?.role === "tutor" || user?.role === "admin";
  const [showTopFade, setShowTopFade] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleListScroll = () => {
    if (listContainerRef.current) {
      setShowTopFade(listContainerRef.current.scrollTop > 0);
    }
  };

  const togglePin = (id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      if (!conv.pinned) {
        // Pinning: set pinnedAt to current timestamp
        updateConversation(id, { pinned: true, pinnedAt: Date.now() });
      } else {
        // Unpinning: remove pinnedAt
        updateConversation(id, { pinned: false, pinnedAt: undefined });
      }
    }
    setActiveMenu(null);
  };

  const toggleUnread = (id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      updateConversation(id, { unread: !conv.unread });
    }
    setActiveMenu(null);
  };

  const handleDelete = (id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    deleteConversation(id);
    setActiveMenu(null);
  };

  const handleMenuClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (activeMenu === id) {
      setActiveMenu(null);
      setMenuPosition(null);
    } else {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      });
      setActiveMenu(id);
    }
  };

  const unreadCount = conversations.filter((c) => c.unread).length;

  // Tutors don't have peers; exclude peer conversations from the list for tutors
  const conversationsForList = isTutor
    ? conversations.filter((c) => c.role !== "peer")
    : conversations;

  // Sort: pinned first (sorted by pinnedAt timestamp, oldest first), then by unread status
  const sortedConversations = [...conversationsForList].sort((a, b) => {
    // Both pinned - sort by pinnedAt (oldest first)
    if (a.pinned && b.pinned) {
      return (a.pinnedAt || 0) - (b.pinnedAt || 0);
    }
    // Only a is pinned
    if (a.pinned && !b.pinned) return -1;
    // Only b is pinned
    if (!a.pinned && b.pinned) return 1;
    // Neither pinned - sort by unread status
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return 0;
  });

  const filteredConversations = sortedConversations.filter(
    (conv) =>
      (conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.message.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (roleFilter === "all" || conv.role === roleFilter)
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full h-full flex flex-col relative">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 relative z-10" style={{ backgroundColor: colors.bgPrimary }}>
          {/* Header with Profile Button */}
          <div className="px-6 pt-12 pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>Messages</h1>
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
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-12 pr-4 py-3 text-[14px] border border-transparent focus:outline-none transition-colors"
                style={{
                  backgroundColor: colors.bgTertiary,
                  color: colors.textPrimary
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = accentColor.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              />
              {searchQuery && (
                <X
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] cursor-pointer"
                  style={{ color: colors.textSecondary }}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          </motion.div>

          {/* Role Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="px-6 pb-4"
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar justify-between">
              {[
                { value: "all", label: "All" },
                ...(isTutor ? [{ value: "student" as const, label: "Students" }] : []),
                { value: "tutor", label: "Tutors" },
                { value: "professor", label: "Professors" },
                { value: "ta", label: "TAs" },
                ...(isTutor ? [] : [{ value: "peer" as const, label: "Peers" }]),
              ].map((filter) => (
                <motion.button
                  key={filter.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRoleFilter(filter.value as typeof roleFilter)}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: roleFilter === filter.value ? accentColor.primary : colors.bgTertiary,
                    color: roleFilter === filter.value ? 'white' : colors.textSecondary,
                    boxShadow: roleFilter === filter.value ? `0px 4px 12px 0px ${accentColor.primary}40` : 'none'
                  }}
                >
                  {filter.label}
                  {filter.value !== "all" && roleFilter === filter.value && (
                    <span className="ml-1.5 text-[11px] opacity-80">
                      ({conversations.filter(c => c.role === filter.value).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conversations List */}
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
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  layout
                  className="relative mb-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative rounded-2xl p-4 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                    style={{
                      backgroundColor: colors.bgCard,
                      borderColor: conversation.pinned ? `${accentColor.primary}50` : colors.borderPrimary
                    }}
                  >
                    {/* Pinned Indicator */}
                    {conversation.pinned && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <Pin className="w-4 h-4" style={{ color: accentColor.primary }} fill={accentColor.primary} />
                      </motion.div>
                    )}

                    <Link to={`/chat/${conversation.id}`} state={{ conversation }} className="block">
                      <div className="flex items-start gap-4">
                        {/* Avatar with Unread Badge */}
                        <div className="relative flex-shrink-0">
                          <ImageWithFallback
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-[60px] h-[60px] rounded-full object-cover"
                          />
                          {conversation.unread && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-0 right-0 w-[14px] h-[14px] rounded-full border-2"
                              style={{ backgroundColor: accentColor.primary, borderColor: colors.bgPrimary }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3
                              className={`text-[16px] ${conversation.unread ? 'font-semibold' : 'font-medium'}`}
                              style={{ color: colors.textPrimary }}
                            >
                              {conversation.name}
                            </h3>
                            <span
                              className="text-[12px] ml-2 flex-shrink-0"
                              style={{
                                color: conversation.unread ? accentColor.primary : colors.textSecondary,
                                fontWeight: conversation.unread ? 600 : 400
                              }}
                            >
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-[13px] mb-1 leading-[19.5px]" style={{ color: colors.textSecondary }}>
                            {conversation.role === "tutor" ? "Tutor" : conversation.role === "professor" ? "Professor" : conversation.role === "ta" ? "TA" : conversation.role === "student" ? "Student" : "Peer"}
                          </p>
                          <p
                            className={`text-[14px] leading-[21px] line-clamp-1 ${conversation.unread ? 'font-medium' : ''}`}
                            style={{ color: conversation.unread ? colors.textPrimary : colors.textSecondary }}
                          >
                            {conversation.message}
                          </p>
                        </div>

                        {/* Spacer for menu button */}
                        <div className="w-8 flex-shrink-0" />
                      </div>
                    </Link>

                    {/* Menu Button - Outside Link */}
                    <div className="absolute top-4 right-4 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleMenuClick(conversation.id, e)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-30"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgTertiary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <MoreVertical className="w-5 h-5" style={{ color: colors.textSecondary }} />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredConversations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-[15px]" style={{ color: colors.textSecondary }}>No conversations found</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Click outside to close menu */}
        {activeMenu !== null && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => {
              setActiveMenu(null);
              setMenuPosition(null);
            }}
          />
        )}

        {/* Floating Dropdown Menu */}
        <AnimatePresence>
          {activeMenu !== null && menuPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="fixed rounded-xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.6)] border overflow-hidden z-50 min-w-[180px]"
              style={{
                backgroundColor: colors.bgCard,
                borderColor: colors.borderPrimary,
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`
              }}
            >
              <motion.button
                whileHover={{ backgroundColor: `${accentColor.primary}20` }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => togglePin(activeMenu, e)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
              >
                {conversations.find(c => c.id === activeMenu)?.pinned ? (
                  <PinOff className="w-4 h-4" style={{ color: colors.textPrimary }} />
                ) : (
                  <Pin className="w-4 h-4" style={{ color: colors.textPrimary }} />
                )}
                <span className="text-[14px]" style={{ color: colors.textPrimary }}>
                  {conversations.find(c => c.id === activeMenu)?.pinned ? "Unpin" : "Pin"}
                </span>
              </motion.button>
              <div className="h-px" style={{ backgroundColor: colors.borderPrimary }} />
              <motion.button
                whileHover={{ backgroundColor: `${accentColor.primary}20` }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => toggleUnread(activeMenu, e)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
              >
                {conversations.find(c => c.id === activeMenu)?.unread ? (
                  <MailOpen className="w-4 h-4" style={{ color: colors.textPrimary }} />
                ) : (
                  <Mail className="w-4 h-4" style={{ color: colors.textPrimary }} />
                )}
                <span className="text-[14px]" style={{ color: colors.textPrimary }}>
                  Mark as {conversations.find(c => c.id === activeMenu)?.unread ? "read" : "unread"}
                </span>
              </motion.button>
              <div className="h-px" style={{ backgroundColor: colors.borderPrimary }} />
              <motion.button
                whileHover={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleDelete(activeMenu, e)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#ff0000]" />
                <span className="text-[14px] text-[#ff0000]">
                  Delete
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav currentPage="chat" />
    </div>
  );
}