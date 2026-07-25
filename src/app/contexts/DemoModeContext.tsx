import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { collection, doc, getDocs, query, setDoc, where, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { useLearningComfort } from "./LearningComfortContext";
import { auth, db, firestoreReady, isFirebaseConfigured } from "../lib/firebase";
import {
  DEMO_EXPO_STEPS,
  DEMO_NOTES_TAB_KEY,
  DEMO_PASSWORD,
  DEMO_SOCRATIC_MESSAGE,
  DEMO_STORAGE_KEY,
  DEMO_STUDENT_EMAIL,
  DEMO_STUDENT_PROFILE,
  DEMO_TUTOR_EMAIL,
  resolveDemoPath,
  type DemoExpoStep,
} from "../lib/demoExpoConfig";

type DemoModeContextValue = {
  isDemoMode: boolean;
  isStarting: boolean;
  stepIndex: number;
  step: DemoExpoStep;
  totalSteps: number;
  demoTutorUid: string | null;
  demoConversationId: string | null;
  socraticMessage: string;
  startExpoDemo: () => Promise<void>;
  exitExpoDemo: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

function formatSessionDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function seedDemoCalendar() {
  const d = new Date();
  const tomorrow = new Date(d);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const sessions = [
    {
      id: 9001,
      subject: "Chemistry",
      tutor: "James Chen",
      tutorAvatar:
        "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      student: "Maya Chen",
      date: formatSessionDate(tomorrow),
      time: "3:00 PM",
      duration: "60 min",
      status: "upcoming" as const,
      location: "Remote · Zoom",
    },
  ];
  localStorage.setItem("sessions_v3", JSON.stringify(sessions));
  localStorage.setItem("removedSessions_v3", JSON.stringify([]));
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { login, logout, updateUser, isAuthenticated, user, profileLoaded } = useAuth();
  const {
    setDyslexiaFriendlyFont,
    setReadingAssistEnabled,
    setReduceDistractions,
  } = useLearningComfort();

  const [isDemoMode, setIsDemoMode] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(DEMO_STORAGE_KEY) === "1"
  );
  const [isStarting, setIsStarting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [demoTutorUid, setDemoTutorUid] = useState<string | null>(null);
  const [demoConversationId, setDemoConversationId] = useState<string | null>(null);

  const step = DEMO_EXPO_STEPS[stepIndex] ?? DEMO_EXPO_STEPS[0];
  const totalSteps = DEMO_EXPO_STEPS.length;

  const resolveIds = useCallback(
    () => ({ tutorUid: demoTutorUid, conversationId: demoConversationId }),
    [demoTutorUid, demoConversationId]
  );

  const scrollDemoPageToTop = () => {
    requestAnimationFrame(() => {
      document.querySelector("[data-demo-scroll-root]")?.scrollTo({ top: 0, behavior: "instant" });
    });
  };

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, DEMO_EXPO_STEPS.length - 1));
      setStepIndex(clamped);
      const s = DEMO_EXPO_STEPS[clamped];
      if (s.id === "study-tutor") {
        sessionStorage.setItem(DEMO_NOTES_TAB_KEY, "tutor");
      } else if (s.id === "study-notes") {
        sessionStorage.setItem(DEMO_NOTES_TAB_KEY, "notes");
      } else if (s.id === "study-flashcards") {
        sessionStorage.setItem(DEMO_NOTES_TAB_KEY, "flashcards");
      } else {
        sessionStorage.removeItem(DEMO_NOTES_TAB_KEY);
      }
      const path = resolveDemoPath(s.path, resolveIds());
      if (!path || path.includes("__")) {
        if (s.id === "tutor") navigate("/tutors");
        else if (s.id === "chat") navigate("/chat");
        scrollDemoPageToTop();
        return;
      }
      navigate(path);
      scrollDemoPageToTop();
    },
    [navigate, resolveIds]
  );

  const lookupDemoIds = useCallback(async (studentUid: string) => {
    if (!db) return;
    await firestoreReady;
    let tutorUid: string | null = null;
    let conversationId: string | null = null;
    try {
      const tutorSnap = await getDocs(
        query(collection(db, "tutorProfiles"), where("displayName", "==", "James Chen"))
      );
      if (!tutorSnap.empty) tutorUid = tutorSnap.docs[0].id;
    } catch {
      /* fallback below */
    }
    const connQ = query(collection(db, "connections"), where("studentUid", "==", studentUid));
    const connSnap = await getDocs(connQ);
    if (!connSnap.empty) {
      const data = connSnap.docs[0].data();
      tutorUid = (data.tutorUid as string) || tutorUid;
      conversationId = (data.conversationId as string) || null;
    }
    if (!conversationId) {
      const convQ = query(
        collection(db, "conversations"),
        where("participantUids", "array-contains", studentUid)
      );
      const convSnap = await getDocs(convQ);
      if (!convSnap.empty) conversationId = convSnap.docs[0].id;
    }
    if (tutorUid) setDemoTutorUid(tutorUid);
    if (conversationId) setDemoConversationId(conversationId);
  }, []);

  const applyClientDemoState = useCallback(async () => {
    updateUser({
      firstName: DEMO_STUDENT_PROFILE.firstName,
      lastName: DEMO_STUDENT_PROFILE.lastName,
      name: DEMO_STUDENT_PROFILE.name,
      university: DEMO_STUDENT_PROFILE.university,
      year: DEMO_STUDENT_PROFILE.year,
      major: DEMO_STUDENT_PROFILE.major,
      learningStyle: DEMO_STUDENT_PROFILE.learningStyle,
      learningStyleQuestionAnswers: DEMO_STUDENT_PROFILE.learningStyleQuestionAnswers,
      learningSupport: DEMO_STUDENT_PROFILE.learningSupport,
    });
    // Learning Comfort stays off until the presenter toggles them on Settings (step 2).
    setDyslexiaFriendlyFont(false);
    setReadingAssistEnabled(false);
    setReduceDistractions(false);
    seedDemoCalendar();
  }, [
    updateUser,
    setDyslexiaFriendlyFont,
    setReadingAssistEnabled,
    setReduceDistractions,
  ]);

  const waitForAuthUid = async (maxMs = 12000): Promise<string> => {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const uid = auth?.currentUser?.uid;
      if (uid) return uid;
      await new Promise((r) => setTimeout(r, 150));
    }
    throw new Error("Demo login timed out");
  };

  const persistDemoProfile = useCallback(async (uid: string) => {
    if (!db) return;
    await firestoreReady;
    await setDoc(
      doc(db, "users", uid),
      {
        firstName: DEMO_STUDENT_PROFILE.firstName,
        lastName: DEMO_STUDENT_PROFILE.lastName,
        name: DEMO_STUDENT_PROFILE.name,
        university: DEMO_STUDENT_PROFILE.university,
        year: DEMO_STUDENT_PROFILE.year,
        major: DEMO_STUDENT_PROFILE.major,
        learningStyle: DEMO_STUDENT_PROFILE.learningStyle,
        learningStyleQuestionAnswers: DEMO_STUDENT_PROFILE.learningStyleQuestionAnswers,
        learningSupport: DEMO_STUDENT_PROFILE.learningSupport,
        roles: { student: true, tutor: false, admin: false },
        role: "student",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "studentProfiles", uid),
      {
        uid,
        firstName: DEMO_STUDENT_PROFILE.firstName,
        lastName: DEMO_STUDENT_PROFILE.lastName,
        displayName: DEMO_STUDENT_PROFILE.name,
        learningStyle: DEMO_STUDENT_PROFILE.learningStyle,
        learningStyleQuestionAnswers: DEMO_STUDENT_PROFILE.learningStyleQuestionAnswers,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, []);

  const demoBootstrappedRef = useRef(false);

  const startExpoDemo = useCallback(async () => {
    if (!isFirebaseConfigured) {
      toast.error("Firebase not configured — add .env.local to run the expo demo.");
      return;
    }
    setIsStarting(true);
    demoBootstrappedRef.current = false;
    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, "1");
      setIsDemoMode(true);
      setStepIndex(0);
      await login(DEMO_STUDENT_EMAIL, DEMO_PASSWORD, "student");
      const uid = await waitForAuthUid();
      await persistDemoProfile(uid);
      await applyClientDemoState();
      await lookupDemoIds(uid);
      demoBootstrappedRef.current = true;
      toast.success("Demo ready — scroll down for the guide", { duration: 3000 });
      goToStep(0);
    } catch (e) {
      console.error("[Demo] start failed:", e);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setIsDemoMode(false);
      toast.error(
        "Could not start demo. Run: npm run seed-demo-expo (needs service-account.json)."
      );
    } finally {
      setIsStarting(false);
    }
  }, [login, persistDemoProfile, applyClientDemoState, lookupDemoIds, goToStep]);

  useEffect(() => {
    if (!isDemoMode || !isAuthenticated || !profileLoaded || !user?.id || demoBootstrappedRef.current) {
      return;
    }
    demoBootstrappedRef.current = true;
    lookupDemoIds(user.id);
    applyClientDemoState();
  }, [isDemoMode, isAuthenticated, profileLoaded, user?.id, lookupDemoIds, applyClientDemoState]);

  const exitExpoDemo = useCallback(() => {
    sessionStorage.removeItem(DEMO_STORAGE_KEY);
    sessionStorage.removeItem(DEMO_NOTES_TAB_KEY);
    setIsDemoMode(false);
    setStepIndex(0);
    toast.message("Expo demo ended");
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const nextStep = useCallback(() => {
    if (stepIndex >= DEMO_EXPO_STEPS.length - 1) {
      exitExpoDemo();
      return;
    }
    goToStep(stepIndex + 1);
  }, [stepIndex, goToStep, exitExpoDemo]);

  const prevStep = useCallback(() => {
    goToStep(stepIndex - 1);
  }, [stepIndex, goToStep]);

  const value = useMemo<DemoModeContextValue>(
    () => ({
      isDemoMode,
      isStarting,
      stepIndex,
      step,
      totalSteps,
      demoTutorUid,
      demoConversationId,
      socraticMessage: DEMO_SOCRATIC_MESSAGE,
      startExpoDemo,
      exitExpoDemo,
      goToStep,
      nextStep,
      prevStep,
    }),
    [
      isDemoMode,
      isStarting,
      stepIndex,
      step,
      totalSteps,
      demoTutorUid,
      demoConversationId,
      startExpoDemo,
      exitExpoDemo,
      goToStep,
      nextStep,
      prevStep,
    ]
  );

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}

export function useDemoModeOptional() {
  return useContext(DemoModeContext);
}
