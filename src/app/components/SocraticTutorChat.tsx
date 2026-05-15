import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  sendSocraticTutorMessage,
  type SocraticChatMessage,
} from "../lib/socraticChat";
import { toast } from "sonner";

const WELCOME: SocraticChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your Socratic study mentor. I'll ask questions and build on what you say—I won't just hand you the final answer. Tell me what you're studying or paste the problem you're stuck on.",
};

function newId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SocraticTutorChat() {
  const { colors, accentColor } = useTheme();
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<SocraticChatMessage[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [usedCloud, setUsedCloud] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: SocraticChatMessage = { id: newId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ id: m.id, role: m.role, content: m.content }));
      const { reply, usedCloud: cloud } = await sendSocraticTutorMessage({
        message: text,
        topic: topic.trim() || undefined,
        history: [...historyForApi, userMsg],
      });
      setUsedCloud(cloud);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", content: reply },
      ]);
    } catch {
      toast.error("Could not reach the mentor. Try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setUsedCloud(null);
    toast.message("New Socratic session");
  };

  const firstName =
    user?.firstName || user?.name?.split(" ")[0] || "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backgroundColor: colors.bgCard,
        borderColor: colors.borderPrimary,
        minHeight: "min(70vh, 520px)",
        maxHeight: "min(75vh, 560px)",
      }}
    >
      <div
        className="px-4 py-3 border-b flex items-start justify-between gap-2"
        style={{ borderColor: colors.borderSecondary, backgroundColor: `${accentColor.primary}18` }}
      >
        <div>
          <motion.div className="flex items-center gap-2" layout={false}>
            <Sparkles className="w-4 h-4" style={{ color: accentColor.primary }} />
            <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              Socratic tutor
            </h3>
          </motion.div>
          <p className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>
            Questions, not answers — built for how you learn, {firstName}.
          </p>
        </div>
        <button
          type="button"
          onClick={resetChat}
          className="p-2 rounded-lg shrink-0"
          style={{ backgroundColor: colors.bgTertiary }}
          aria-label="Start new session"
        >
          <RotateCcw className="w-4 h-4" style={{ color: colors.textSecondary }} />
        </button>
      </div>

      <div className="px-4 py-2 border-b" style={{ borderColor: colors.borderSecondary }}>
        <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
          Studying (optional)
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Chem 1A — stoichiometry"
          className="mt-1 w-full rounded-lg px-3 py-2 text-xs border outline-none"
          style={{
            backgroundColor: colors.bgTertiary,
            color: colors.textPrimary,
            borderColor: colors.borderSecondary,
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                className="max-w-[88%] rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed"
                style={{
                  backgroundColor: isUser ? accentColor.primary : colors.bgTertiary,
                  color: isUser ? "#fff" : colors.textPrimary,
                }}
              >
                {msg.content}
              </motion.div>
            </div>
          );
        })}
        {loading && (
          <p className="text-xs italic" style={{ color: colors.textTertiary }}>
            Mentor is thinking…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {usedCloud === false && messages.length > 2 && (
        <p className="px-4 text-[10px]" style={{ color: colors.textTertiary }}>
          Offline mentor mode. Add <code className="text-[9px]">VITE_GEMINI_API_KEY</code> to .env.local or deploy Cloud Functions with GEMINI_API_KEY for full AI.
        </p>
      )}

      <div
        className="p-3 border-t flex gap-2 items-end"
        style={{ borderColor: colors.borderSecondary }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask or explain what you're stuck on…"
          rows={2}
          disabled={loading}
          className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none resize-none disabled:opacity-60"
          style={{
            backgroundColor: colors.bgTertiary,
            color: colors.textPrimary,
            borderColor: colors.borderSecondary,
          }}
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          disabled={loading || !input.trim()}
          onClick={handleSend}
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
          style={{ backgroundColor: accentColor.primary }}
          aria-label="Send"
        >
          <Send className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}
