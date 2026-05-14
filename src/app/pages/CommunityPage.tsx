import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { motion } from "motion/react";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { db, firestoreReady, isFirebaseConfigured } from "../lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type Post = {
  id: string;
  authorUid: string;
  authorName: string;
  authorRole: string;
  content: string;
  likes: number;
  createdAt: { seconds: number } | null;
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    let unsub: (() => void) | undefined;
    (async () => {
      await firestoreReady;
      if (!db) return;
      const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"), limit(50));
      unsub = onSnapshot(
        q,
        (snap) => {
          setPosts(
            snap.docs.map((d) => {
              const data = d.data();
              const ts = data.createdAt;
              return {
                id: d.id,
                authorUid: String(data.authorUid ?? ""),
                authorName: String(data.authorName ?? "Member"),
                authorRole: String(data.authorRole ?? "student"),
                content: String(data.content ?? ""),
                likes: typeof data.likes === "number" ? data.likes : 0,
                createdAt:
                  ts && typeof ts.seconds === "number" ? { seconds: ts.seconds } : null,
              };
            })
          );
        },
        (err) => console.warn("[Community] snapshot:", err)
      );
    })();
    return () => unsub?.();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !user || !db) {
      toast.message("Sign in and connect to Firebase to post.");
      return;
    }
    setSubmitting(true);
    try {
      await firestoreReady;
      await addDoc(collection(db, "communityPosts"), {
        authorUid: user.id,
        authorName: user.name || user.firstName || "Member",
        authorRole: user.role,
        content: text,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setDraft("");
      toast.success("Posted to the community.");
    } catch (err) {
      console.error(err);
      toast.error("Could not post. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const likePost = async (postId: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "communityPosts", postId), { likes: increment(1) });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-3 flex items-center justify-between">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
          <div className="flex-1 text-center mr-10">
            <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Community
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
              Socratic OC
            </p>
          </div>
          <ProfileButton />
        </div>

        <div className="px-6 space-y-6">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Share wins and questions on Socratic OC. Posts are visible to signed-in members.
          </p>

          <form
            onSubmit={handlePost}
            className="rounded-2xl p-4 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Share something with the community…"
              className="w-full rounded-xl px-3 py-2 text-sm mb-3 outline-none resize-none border"
              style={{
                backgroundColor: colors.bgTertiary,
                color: colors.textPrimary,
                borderColor: colors.borderSecondary,
              }}
              required
            />
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: accentColor.primary, opacity: submitting ? 0.7 : 1 }}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting…" : "Post"}
            </motion.button>
          </form>

          <div className="space-y-4">
            {posts.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: colors.textTertiary }}>
                No posts yet. Be the first to share!
              </p>
            )}
            {posts.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl p-4 border"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    {(p.authorName || "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {p.authorName}
                    </p>
                    <p className="text-xs capitalize" style={{ color: colors.textTertiary }}>
                      {p.authorRole}
                      {p.createdAt ? ` · ${new Date(p.createdAt.seconds * 1000).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: colors.textSecondary }}>
                  {p.content}
                </p>
                <div className="flex gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => likePost(p.id)}
                    className="inline-flex items-center gap-1 text-xs"
                    style={{ color: colors.textTertiary }}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    {p.likes}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="text-xs pb-4" style={{ color: colors.textTertiary }}>
            <Link to="/privacy" className="underline">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
