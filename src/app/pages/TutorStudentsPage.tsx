import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Search, TrendingUp, Calendar, MessageSquare, Star } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { useAuth } from "../contexts/AuthContext";
import { useConnections } from "../contexts/ConnectionsContext";
import type { Conversation } from "../contexts/ConversationsContext";

export default function TutorStudentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { connections } = useConnections();

  const uid = user?.id ?? "";
  const myStudents = connections.filter(
    (c) => c.tutorUid === uid && c.status === "active" && c.conversationId
  );

  const filteredStudents = myStudents.filter(
    (c) =>
      (c.studentFirstName ?? "Student").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">My Students</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a8b3cf]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full bg-[#1e2139] rounded-2xl py-3 pl-12 pr-4 text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none border-2 border-transparent focus:border-[#5b7ceb] transition-colors"
            />
          </div>
        </div>

        {/* Student Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <p className="text-[#a8b3cf] text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-[#e8edf5]">{myStudents.length}</p>
            </div>
            <div className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <p className="text-[#a8b3cf] text-sm mb-1">Connected</p>
              <p className="text-3xl font-bold text-[#e8edf5]">{myStudents.length}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="px-6">
          <div className="space-y-3">
            {filteredStudents.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-start gap-4">
                  <AvatarWithInitials
                    src={connection.studentPhotoURL || undefined}
                    name={connection.studentFirstName ?? "Student"}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-[#e8edf5]">
                          {connection.studentFirstName ?? "Student"}
                        </h3>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Link to="/schedule" className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] text-white text-sm font-semibold py-2 rounded-xl"
                        >
                          Schedule
                        </motion.button>
                      </Link>
                      <Link
                        to={`/chat/${connection.conversationId}`}
                        state={{
                          conversation: {
                            id: connection.conversationId,
                            name: connection.studentFirstName ?? "Student",
                            avatar: connection.studentPhotoURL ?? "",
                            university: "",
                            message: "",
                            timestamp: "",
                            unread: false,
                            pinned: false,
                            role: "student",
                          } as Conversation,
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-[#2a2f45] rounded-xl flex items-center justify-center"
                        >
                          <MessageSquare className="w-5 h-5 text-[#5b7ceb]" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#a8b3cf]">
                {myStudents.length === 0
                  ? "No students yet. When students request you and you accept, they’ll appear here."
                  : "No students match your search."}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentPage="tutors" />
    </div>
  );
}
