import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Check, X, MessageSquare } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useTutorRequests } from "../contexts/TutorRequestsContext";
import { useAuth } from "../contexts/AuthContext";
import { useConversations } from "../contexts/ConversationsContext";
import { useConnections } from "../contexts/ConnectionsContext";
import { doc, getDoc } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";

export default function TutorRequestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { incomingRequests, isLoading, error, acceptRequest, rejectRequest } = useTutorRequests();
  const { addConversation, getConversation } = useConversations();
  const { refetchConnections } = useConnections();
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    if (!db || incomingRequests.length === 0) return;
    let cancelled = false;
    (async () => {
      await firestoreReady;
      const names: Record<string, string> = {};
      for (const r of incomingRequests) {
        if (cancelled) return;
        try {
          const snap = await getDoc(doc(db, "users", r.studentUid));
          if (snap.exists()) {
          const data = snap.data() as { firstName?: string; lastName?: string };
          names[r.studentUid] = data.firstName ?? "Student";
        }
        } catch {
          names[r.studentUid] = "Student";
        }
      }
      if (!cancelled) setStudentNames(names);
    })();
    return () => {
      cancelled = true;
    };
  }, [incomingRequests]);

  const handleAccept = async (requestId: string) => {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (!req) return;
    setAcceptingId(requestId);
    try {
      const studentName = studentNames[req.studentUid] ?? "Student";
      const { conversationId } = await acceptRequest(
        requestId,
        user?.firstName ?? user?.name ?? "Tutor",
        user?.avatar,
        studentName,
        undefined
      );
      await refetchConnections();
      let conv = getConversation(conversationId);
      if (!conv) {
        addConversation({
          id: conversationId,
          name: studentName,
          avatar: "",
          university: "",
          message: req.initialMessage ?? "",
          timestamp: "",
          unread: false,
          pinned: false,
          role: "student",
          tutorId: undefined,
        });
        conv = getConversation(conversationId);
      }
      navigate(`/chat/${conversationId}`, { state: { conversation: conv } });
    } catch (e) {
      console.error("[TutorRequests] accept failed:", e);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setRejectingId(requestId);
    try {
      await rejectRequest(requestId);
    } catch (e) {
      console.error("[TutorRequests] reject failed:", e);
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1a1d29] overflow-auto pb-20"
      data-testid="tutor-requests-screen"
      id="tutor-requests-screen"
      aria-label="Requests from students"
    >
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
              data-testid="tutor-requests-back"
              id="tutor-requests-back"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">Requests from students</h1>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-red-500/20 text-red-200 text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="px-6 text-[#a8b3cf]">Loading…</div>
        ) : incomingRequests.length === 0 ? (
          <div className="px-6 py-12 text-center text-[#a8b3cf]">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="px-6 space-y-3">
            {incomingRequests.map((req) => {
              const name = studentNames[req.studentUid] ?? "Student";
              return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                data-testid={`tutor-request-card-${req.id}`}
                id={`tutor-request-card-${req.id}`}
                aria-label={`Request from ${name}`}
              >
                <p className="text-[#e8edf5] font-medium mb-1">
                  {name}
                </p>
                {req.subject && (
                  <p className="text-sm text-[#a8b3cf] mb-1">Subject: {req.subject}</p>
                )}
                {req.initialMessage && (
                  <p className="text-sm text-[#a8b3cf] mb-3">"{req.initialMessage}"</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.id)}
                    disabled={acceptingId !== null}
                    className="flex-1 py-2 rounded-xl bg-[#4361d9] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid={`tutor-request-accept-${req.id}`}
                    id={`tutor-request-accept-${req.id}`}
                    aria-label="Accept request"
                  >
                    {acceptingId === req.id ? "…" : <><Check className="w-4 h-4" /> Accept</>}
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={rejectingId !== null}
                    className="py-2 px-4 rounded-xl border border-[rgba(255,255,255,0.2)] text-[#e8edf5] text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid={`tutor-request-reject-${req.id}`}
                    id={`tutor-request-reject-${req.id}`}
                    aria-label="Reject request"
                  >
                    {rejectingId === req.id ? "…" : <><X className="w-4 h-4" /> Reject</>}
                  </button>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav currentPage="tutors" />
    </div>
  );
}
