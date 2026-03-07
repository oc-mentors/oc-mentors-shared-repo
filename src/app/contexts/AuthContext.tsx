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
import { doc, getDocFromServer, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, firestoreReady } from "../lib/firebase";

export type UserRole = "student" | "tutor" | "admin";

export type LearningStyle = "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic";

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
        const userRef = doc(db, "users", firebaseUser.uid);
        console.log("[Auth] Loading user profile from Firestore (default)...", firebaseUser.uid);
        const snap = await getDocFromServer(userRef);
        if (snap.exists()) {
          const data = snap.data() as User;
          setUser({ ...data, id: firebaseUser.uid });
          console.log("[Auth] Profile loaded:", data.email ?? data.name);
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
    await signInWithEmailAndPassword(auth, email, password);
    setShowLoginAnimation(true);
  };

  const loginWithGoogle = async (role: UserRole) => {
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
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const newUser: User = {
      id: uid,
      name,
      email,
      role,
      avatar:
        role === "student"
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    };

    await firestoreReady;
    await setDoc(doc(db, "users", uid), newUser);
    console.log("[Auth] Profile saved to Firestore.");
    setUser(newUser);
    setShowLoginAnimation(true);
  };

  const logout = async () => {
    setShowLogoutAnimation(true);
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      updateDoc(doc(db, "users", user.id), updates);
    }
  };

  const changePassword = async (email: string, newPassword: string) => {
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