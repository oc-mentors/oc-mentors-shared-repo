import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useState, useRef } from "react";
import { Search, X, MoreVertical, Pin, PinOff, Mail, MailOpen, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useConversations } from "../contexts/ConversationsContext";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations, updateConversation, deleteConversation } = useConversations();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "tutor" | "professor" | "ta" | "peer">("all");

  const togglePin = (id: number, event?: React.MouseEvent) => {
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

  const toggleUnread = (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      updateConversation(id, { unread: !conv.unread });
    }
    setActiveMenu(null);
  };

  const handleDelete = (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    deleteConversation(id);
    setActiveMenu(null);
  };

  const handleMenuClick = (id: number, event: React.MouseEvent) => {
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

  // Sort: pinned first (sorted by pinnedAt timestamp, oldest first), then by unread status
  const sortedConversations = [...conversations].sort((a, b) => {
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
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with Profile Button */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-[#e8edf5]">Messages</h1>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#a8b3cf]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2f4a] rounded-xl pl-12 pr-4 py-3 text-[14px] text-[#e8edf5] placeholder:text-[#a8b3cf] border border-transparent focus:border-[#5b7ceb] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <X
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#a8b3cf] cursor-pointer"
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
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { value: "all", label: "All" },
              { value: "tutor", label: "Tutors" },
              { value: "professor", label: "Professors" },
              { value: "ta", label: "TAs" },
              { value: "peer", label: "Peers" },
            ].map((filter) => (
              <motion.button
                key={filter.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRoleFilter(filter.value as typeof roleFilter)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                  roleFilter === filter.value
                    ? "bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] text-white shadow-[0px_4px_12px_0px_rgba(67,97,217,0.4)]"
                    : "bg-[#2a2f4a] text-[#a8b3cf] hover:bg-[#363b58]"
                }`}
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

        {/* Conversations List */}
        <div className="px-6 pb-6">
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
                  className={`relative bg-[#1e2139] rounded-2xl p-4 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] ${
                    conversation.pinned
                      ? "border-[#5b7ceb]/30"
                      : "border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  {/* Pinned Indicator */}
                  {conversation.pinned && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <Pin className="w-4 h-4 text-[#5b7ceb] fill-[#5b7ceb]" />
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
                            className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#5b7ceb] rounded-full border-2 border-[#1a1d29]"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3
                            className={`text-[16px] font-medium text-[#e8edf5] ${
                              conversation.unread ? "font-semibold" : ""
                            }`}
                          >
                            {conversation.name}
                          </h3>
                          <span
                            className={`text-[12px] ml-2 flex-shrink-0 ${
                              conversation.unread
                                ? "text-[#5b7ceb] font-semibold"
                                : "text-[#a8b3cf]"
                            }`}
                          >
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#a8b3cf] mb-1 leading-[19.5px]">
                          {conversation.university}
                        </p>
                        <p
                          className={`text-[14px] leading-[21px] line-clamp-1 ${
                            conversation.unread
                              ? "text-[#e8edf5] font-medium"
                              : "text-[#a8b3cf]"
                          }`}
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
                      className="w-8 h-8 rounded-lg hover:bg-[#2a2f4a] flex items-center justify-center transition-colors z-30"
                    >
                      <MoreVertical className="w-5 h-5 text-[#a8b3cf]" />
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
              <p className="text-[#a8b3cf] text-[15px]">No conversations found</p>
            </motion.div>
          )}
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
              className="fixed bg-[#2a2f4a] rounded-xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.08)] overflow-hidden z-50 min-w-[180px]"
              style={{
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`
              }}
            >
              <motion.button
                whileHover={{ backgroundColor: "rgba(91, 124, 235, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => togglePin(activeMenu, e)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
              >
                {conversations.find(c => c.id === activeMenu)?.pinned ? (
                  <PinOff className="w-4 h-4 text-[#e8edf5]" />
                ) : (
                  <Pin className="w-4 h-4 text-[#e8edf5]" />
                )}
                <span className="text-[14px] text-[#e8edf5]">
                  {conversations.find(c => c.id === activeMenu)?.pinned ? "Unpin" : "Pin"}
                </span>
              </motion.button>
              <div className="h-px bg-[rgba(255,255,255,0.08)]" />
              <motion.button
                whileHover={{ backgroundColor: "rgba(91, 124, 235, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => toggleUnread(activeMenu, e)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
              >
                {conversations.find(c => c.id === activeMenu)?.unread ? (
                  <MailOpen className="w-4 h-4 text-[#e8edf5]" />
                ) : (
                  <Mail className="w-4 h-4 text-[#e8edf5]" />
                )}
                <span className="text-[14px] text-[#e8edf5]">
                  Mark as {conversations.find(c => c.id === activeMenu)?.unread ? "read" : "unread"}
                </span>
              </motion.button>
              <div className="h-px bg-[rgba(255,255,255,0.08)]" />
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