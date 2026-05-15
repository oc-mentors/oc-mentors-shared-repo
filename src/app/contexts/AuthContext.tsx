import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDocFromServer, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { auth, db, firestoreReady, isFirebaseConfigured } from "../lib/firebase";
import { LEARNING_STYLE_QUIZ_QUESTIONS, getQuizAnswerText } from "../lib/learningStyleQuiz";

export type UserRole = "student" | "tutor" | "admin";

export type LearningStyle = "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic" | "Mixed";

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
  learningStyle?: LearningStyle;
  /** Option index (0–3) per question; length = number of quiz questions */
  learningStyleAnswers?: number[];
  /** Human-readable Q&A stored in DB (question text + selected answer text) */
  learningStyleQuestionAnswers?: { question: string; answer: string }[];
  learningStyleCompletedAt?: unknown; // Firestore Timestamp when persisted
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  changePassword: (email: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  profileLoaded: boolean;
  showLoginAnimation: boolean;
  clearLoginAnimation: () => void;
  showLogoutAnimation: boolean;
  clearLogoutAnimation: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function assertFirebaseAuth(): asserts auth is NonNullable<typeof auth> {
  if (!isFirebaseConfigured || !auth) {
    const err = new Error("Firebase is not configured") as Error & { code: string };
    err.code = "app/firebase-not-configured";
    throw err;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);

  const isAuthenticated = !!user;

  const clearLoginAnimation = () => setShowLoginAnimation(false);
  const clearLogoutAnimation = () => setShowLogoutAnimation(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        setProfileLoaded(false);
        return;
      }

      // Set minimal user immediately so redirect/login doesn't wait on Firestore
      const minimalUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || "",
        role: "student",
      };
      setUser(minimalUser);
      setIsLoading(false);

      try {
        await firestoreReady;
        if (!db) return;
        const userRef = doc(db, "users", firebaseUser.uid);
        console.log("[Auth] Loading user profile from Firestore (default)...", firebaseUser.uid);
        const snap = await getDocFromServer(userRef);
        if (snap.exists()) {
          const data = snap.data() as User;
          setUser({ ...data, id: firebaseUser.uid });
          console.log("[Auth] Profile loaded:", data.email ?? data.name);
          // One-time migration: replace numeric learningStyleAnswers with literal Q&A in Firestore
          const indices = data.learningStyleAnswers;
          if (Array.isArray(indices) && indices.length > 0 && !(data.learningStyleQuestionAnswers?.length)) {
            const questionAnswers = LEARNING_STYLE_QUIZ_QUESTIONS.slice(0, indices.length).map((q, i) => ({
              question: q.question,
              answer: getQuizAnswerText(i, indices[i] ?? -1) || "—",
            }));
            try {
              await updateDoc(userRef, {
                learningStyleQuestionAnswers: questionAnswers,
                learningStyleAnswers: deleteField(),
              });
              setUser((prev) => prev ? { ...prev, learningStyleQuestionAnswers: questionAnswers, learningStyleAnswers: undefined } : null);
            } catch (e) {
              console.warn("[Auth] Quiz answers migration failed:", e);
            }
          }
        } else {
          console.log("[Auth] No profile yet, creating...");
          await setDoc(userRef, minimalUser);
          console.log("[Auth] Profile created in Firestore (default) users collection");
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[Auth] Profile load/create failed:", msg, error);
      } finally {
        setProfileLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, _role: UserRole) => {
    assertFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
    setShowLoginAnimation(true);
  };

  const loginWithGoogle = async (role: UserRole) => {
    assertFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    await firestoreReady;
    const userRef = doc(db, "users", fbUser.uid);
    const snap = await getDocFromServer(userRef);
    if (!snap.exists()) {
      const name = fbUser.displayName || fbUser.email?.split("@")[0] || "User";
      const newUser: User = {
        id: fbUser.uid,
        name,
        email: fbUser.email || "",
        role,
        avatar: fbUser.photoURL || undefined,
      };
      await setDoc(userRef, newUser);
      console.log("[Auth] Google sign-up profile saved to Firestore.");
    }
    setShowLoginAnimation(true);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    assertFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Parse full name into first + last for initials avatar (no photo until they upload one)
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") ?? "";

    const newUser: User = {
      id: uid,
      name,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email,
      role,
      // No avatar on signup – show initials with colored background; user can add photo later
    };

    await firestoreReady;
    if (db) {
      await setDoc(doc(db, "users", uid), newUser);
    }
    console.log("[Auth] Profile saved to Firestore.");
    setUser(newUser);
    setShowLoginAnimation(true);
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    setShowLogoutAnimation(true);
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      const firestoreUpdates: Record<string, unknown> = { ...updates };
      if (updates.learningStyleQuestionAnswers != null && updates.learningStyleQuestionAnswers.length > 0) {
        firestoreUpdates.learningStyleAnswers = deleteField();
      }
      if (db) {
        try {
          updateDoc(doc(db, "users", user.id), firestoreUpdates);
        } catch (err) {
          console.error("[Auth] updateUser failed:", err);
        }
      }
    }
  };

  const changePassword = async (email: string, newPassword: string) => {
    assertFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user");
    }
    // Email param kept for compatibility; Firebase uses currentUser instead
    await firebaseUpdatePassword(currentUser, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
        changePassword,
        isLoading,
        profileLoaded,
        showLoginAnimation,
        clearLoginAnimation,
        showLogoutAnimation,
        clearLogoutAnimation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}