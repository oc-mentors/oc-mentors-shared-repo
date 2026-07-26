import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Layers, Plus, Trash2, ClipboardCheck, X, HelpCircle } from "lucide-react";
import { SocraticTutorChat } from "../components/SocraticTutorChat";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { db, firestoreReady, isFirebaseConfigured } from "../lib/firebase";
import { toast } from "sonner";

type Tab = "notes" | "flashcards" | "guides" | "tutor";

type NoteDoc = { id: string; title: string; body: string; tag?: string };
type FlashDoc = { id: string; question: string; answer: string };
type GuideDoc = { id: string; title: string; description: string; url: string };

const DEFAULT_GUIDES: Omit<GuideDoc, "id">[] = [
  {
    title: "Calculus with Pre-Calc Study Guide",
    description: "Calculus fundamentals and pre-calculus concepts.",
    url: "https://tr.ee/Pdceop",
  },
  {
    title: "Daniyal Rauf Physics Study Guide",
    description: "Mechanics, energy, and motion.",
    url: "https://tr.ee/j2zlYn",
  },
  {
    title: "Chemistry Study Guide",
    description: "Concepts, reactions, and problem-solving.",
    url: "https://tr.ee/v0PHqc",
  },
];

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function NotesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const [tab, setTab] = useState<Tab>("notes");
  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [flashcards, setFlashcards] = useState<FlashDoc[]>([]);
  const [guides, setGuides] = useState<GuideDoc[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [fq, setFq] = useState("");
  const [fa, setFa] = useState("");
  const [gTitle, setGTitle] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [gUrl, setGUrl] = useState("");
  const [showGuideForm, setShowGuideForm] = useState(false);

  const uid = user?.id;

  const displayFlashcards: FlashDoc[] = flashcards;

  const loadSubs = useCallback(() => {
    if (!isFirebaseConfigured || !db || !uid) return () => {};
    const unsubs: (() => void)[] = [];
    (async () => {
      await firestoreReady;
      if (!db) return;
      const nq = query(collection(db, "users", uid, "studyNotes"), orderBy("createdAt", "desc"));
      unsubs.push(
        onSnapshot(nq, (s) =>
          setNotes(
            s.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                title: String(x.title ?? ""),
                body: String(x.body ?? ""),
                tag: x.tag != null ? String(x.tag) : undefined,
              };
            })
          )
        )
      );
      const flashQ = query(collection(db, "users", uid, "userFlashcards"), orderBy("createdAt", "desc"));
      unsubs.push(
        onSnapshot(flashQ, (s) =>
          setFlashcards(
            s.docs.map((d) => {
              const x = d.data();
              return { id: d.id, question: String(x.question ?? ""), answer: String(x.answer ?? "") };
            })
          )
        )
      );
      const gq = query(collection(db, "users", uid, "studyGuides"), orderBy("createdAt", "desc"));
      unsubs.push(
        onSnapshot(gq, (s) =>
          setGuides(
            s.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                title: String(x.title ?? ""),
                description: String(x.description ?? ""),
                url: String(x.url ?? ""),
              };
            })
          )
        )
      );
    })();
    return () => unsubs.forEach((u) => u());
  }, [uid]);

  useEffect(() => {
    const off = loadSubs();
    return off;
  }, [loadSubs]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !uid || !noteTitle.trim() || !noteBody.trim()) return;
    await firestoreReady;
    await addDoc(collection(db, "users", uid, "studyNotes"), {
      title: noteTitle.trim(),
      body: noteBody.trim(),
      createdAt: serverTimestamp(),
    });
    setNoteTitle("");
    setNoteBody("");
    toast.success("Note saved");
  };

  const delNote = async (id: string) => {
    if (!db || !uid) return;
    await deleteDoc(doc(db, "users", uid, "studyNotes", id));
  };

  const addFlash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !uid || !fq.trim() || !fa.trim()) return;
    await firestoreReady;
    await addDoc(collection(db, "users", uid, "userFlashcards"), {
      question: fq.trim(),
      answer: fa.trim(),
      createdAt: serverTimestamp(),
    });
    setFq("");
    setFa("");
    toast.success("Flashcard added");
  };

  const delFlash = async (id: string) => {
    if (!db || !uid) return;
    await deleteDoc(doc(db, "users", uid, "userFlashcards", id));
  };

  const addGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !uid || !gTitle.trim() || !gUrl.trim()) return;
    await firestoreReady;
    await addDoc(collection(db, "users", uid, "studyGuides"), {
      title: gTitle.trim(),
      description: gDesc.trim(),
      url: gUrl.trim(),
      createdAt: serverTimestamp(),
    });
    setGTitle("");
    setGDesc("");
    setGUrl("");
    setShowGuideForm(false);
    toast.success("Study guide added");
  };

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizDeck, setQuizDeck] = useState<FlashDoc[]>([]);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const startQuiz = () => {
    const source = displayFlashcards;
    if (source.length === 0) {
      toast.message("No flashcards yet.");
      return;
    }
    const picked = source.slice(0, Math.min(5, source.length));
    setQuizDeck(picked);
    setQuizIdx(0);
    setQuizAnswer("");
    setQuizScore(0);
    setQuizDone(false);
    setQuizOpen(true);
  };

  const submitQuizAnswer = () => {
    const cur = quizDeck[quizIdx];
    if (!cur) return;
    const ok = norm(quizAnswer) === norm(cur.answer) || norm(cur.answer).includes(norm(quizAnswer));
    if (ok) setQuizScore((s) => s + 1);
    if (quizIdx >= quizDeck.length - 1) {
      setQuizDone(true);
    } else {
      setQuizIdx((i) => i + 1);
      setQuizAnswer("");
    }
  };

  const mergedGuides = useMemo(() => {
    const builtIn: GuideDoc[] = DEFAULT_GUIDES.map((g, i) => ({
      ...g,
      id: `builtin-${i}`,
    }));
    const seen = new Set(guides.map((g) => g.url));
    return [...guides, ...builtIn.filter((b) => !seen.has(b.url))];
  }, [guides]);

  if (!isFirebaseConfigured || !uid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.bgPrimary }}>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          Sign in with Firebase configured to use Socratic OC Study hub (notes and flashcards).
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: colors.bgPrimary }}
      data-testid="notes-screen"
      id="notes-screen"
      aria-label="Notes"
    >
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-3 flex items-center justify-between">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bgTertiary }}
            data-testid="notes-back"
            id="notes-back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
          <div className="flex-1 text-center mr-10">
            <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Study hub
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
              Socratic OC
            </p>
          </div>
          <ProfileButton />
        </div>

        <div className="px-6 flex gap-2 mb-6 flex-wrap">
          {(
            [
              { id: "tutor" as const, label: "Tutor", Icon: HelpCircle },
              { id: "notes" as const, label: "Notes", Icon: BookOpen },
              { id: "flashcards" as const, label: "Cards", Icon: Layers },
              { id: "guides" as const, label: "Guides", Icon: ClipboardCheck },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-label={label}
              className="flex-1 min-w-[88px] rounded-xl py-2.5 text-xs font-semibold border flex items-center justify-center gap-1"
              style={{
                backgroundColor: tab === id ? accentColor.primary : colors.bgCard,
                color: tab === id ? "#fff" : colors.textSecondary,
                borderColor: colors.borderPrimary,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <motion.div className="px-6 space-y-4 pb-8">
          {tab === "tutor" && <SocraticTutorChat />}

          {tab === "notes" && (
            <>
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl p-4 border"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex justify-between gap-2">
                    <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }} aria-label={n.title}>
                      {n.title}
                    </h3>
                    <button type="button" onClick={() => delNote(n.id)} aria-label="Delete note">
                      <Trash2 className="w-4 h-4" style={{ color: colors.textTertiary }} />
                    </button>
                  </div>
                  <p className="text-xs mt-1 whitespace-pre-wrap" style={{ color: colors.textSecondary }}>
                    {n.body}
                  </p>
                </div>
              ))}
              <form
                onSubmit={addNote}
                className="rounded-2xl p-4 border space-y-2"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                aria-label="Add note"
              >
                <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  Add note
                </h3>
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Title"
                  aria-label="Note title"
                  data-testid="notes-title-input"
                  id="notes-title-input"
                  className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                  style={{
                    backgroundColor: colors.bgTertiary,
                    color: colors.textPrimary,
                    borderColor: colors.borderSecondary,
                  }}
                  required
                />
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Content"
                  aria-label="Note content"
                  data-testid="notes-content-input"
                  id="notes-content-input"
                  rows={3}
                  className="w-full rounded-xl px-3 py-2 text-sm border outline-none resize-none"
                  style={{
                    backgroundColor: colors.bgTertiary,
                    color: colors.textPrimary,
                    borderColor: colors.borderSecondary,
                  }}
                  required
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: accentColor.primary }}
                  data-testid="notes-save"
                  id="notes-save"
                  aria-label="Save note"
                >
                  <Plus className="w-4 h-4" />
                  Save
                </motion.button>
              </form>
            </>
          )}

          {tab === "flashcards" && (
            <>
              <div className="flex gap-2 mb-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  className="flex-1 rounded-xl py-2 text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor.primary }}
                >
                  Quiz (up to 5 cards)
                </motion.button>
              </div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Tap a card to flip (preview). Use quiz to type answers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayFlashcards.map((c) => (
                  <details
                    key={c.id}
                    className="rounded-2xl border overflow-hidden group"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                  >
                    <summary
                      className="cursor-pointer p-4 text-sm font-medium list-none"
                      style={{ color: colors.textPrimary }}
                    >
                      {c.question}
                    </summary>
                    <div className="px-4 pb-4 text-xs border-t" style={{ color: colors.textSecondary, borderColor: colors.borderSecondary }}>
                      {c.answer}
                      {!c.id.startsWith("demo-") && (
                        <button
                          type="button"
                          className="block mt-2 text-[11px]"
                          style={{ color: colors.textTertiary }}
                          onClick={(e) => {
                            e.preventDefault();
                            delFlash(c.id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </details>
                ))}
              </div>
              <form
                onSubmit={addFlash}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
              >
                <div className="px-4 py-3" style={{ backgroundColor: accentColor.primary }}>
                  <h3 className="font-semibold text-sm" style={{ color: "#ffffff" }}>
                    New flashcard
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <input
                    value={fq}
                    onChange={(e) => setFq(e.target.value)}
                    placeholder="Question"
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderSecondary,
                    }}
                    required
                  />
                  <textarea
                    value={fa}
                    onChange={(e) => setFa(e.target.value)}
                    placeholder="Answer"
                    rows={2}
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none resize-none"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderSecondary,
                    }}
                    required
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>
              </form>
            </>
          )}

          {tab === "guides" && (
            <>
              {mergedGuides.map((g) => (
                <a
                  key={g.id}
                  href={g.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl p-4 border"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <h3 className="font-semibold text-sm" style={{ color: accentColor.primary }}>
                    {g.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    {g.description}
                  </p>
                </a>
              ))}
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGuideForm((v) => !v)}
                className="w-full rounded-xl py-2 text-sm font-semibold border"
                style={{ borderColor: colors.borderSecondary, color: colors.textPrimary }}
              >
                {showGuideForm ? "Close form" : "Add study guide link"}
              </motion.button>
              {showGuideForm && (
                <form
                  onSubmit={addGuide}
                  className="rounded-2xl p-4 border space-y-2"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <input
                    value={gTitle}
                    onChange={(e) => setGTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderSecondary,
                    }}
                    required
                  />
                  <textarea
                    value={gDesc}
                    onChange={(e) => setGDesc(e.target.value)}
                    placeholder="Description"
                    rows={2}
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none resize-none"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderSecondary,
                    }}
                  />
                  <input
                    value={gUrl}
                    onChange={(e) => setGUrl(e.target.value)}
                    placeholder="https://…"
                    type="url"
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                      borderColor: colors.borderSecondary,
                    }}
                    required
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    Save guide
                  </motion.button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>

      {quizOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 border max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: colors.textPrimary }}>
                {quizDone ? "Quiz done" : `Question ${quizIdx + 1} / ${quizDeck.length}`}
              </h2>
              <button type="button" onClick={() => setQuizOpen(false)} aria-label="Close">
                <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </button>
            </div>
            {quizDone ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Score: <strong style={{ color: accentColor.primary }}>{quizScore}</strong> / {quizDeck.length}
              </p>
            ) : (
              <>
                <p className="text-sm mb-3" style={{ color: colors.textPrimary }}>
                  {quizDeck[quizIdx]?.question}
                </p>
                <input
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="w-full rounded-xl px-3 py-2 text-sm border mb-3 outline-none"
                  style={{
                    backgroundColor: colors.bgTertiary,
                    color: colors.textPrimary,
                    borderColor: colors.borderSecondary,
                  }}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={submitQuizAnswer}
                  className="w-full rounded-xl py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: accentColor.primary }}
                >
                  Check &amp; next
                </motion.button>
              </>
            )}
            {quizDone && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setQuizOpen(false)}
                className="mt-4 w-full rounded-xl py-2 text-sm font-semibold border"
                style={{ borderColor: colors.borderSecondary, color: colors.textPrimary }}
              >
                Close
              </motion.button>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
