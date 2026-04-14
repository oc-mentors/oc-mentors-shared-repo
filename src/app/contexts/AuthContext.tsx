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
import {
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, firestoreReady, isFirebaseConfigured } from "../lib/firebase";
import { LEARNING_STYLE_QUIZ_QUESTIONS, getQuizAnswerText } from "../lib/learningStyleQuiz";
import type { UserDoc, UserRoles, StudentProfileDoc } from "../types/firestore";

export type UserRole = "student" | "tutor" | "admin";

export type LearningStyle = "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic" | "Mixed";

export interface LearningSupport {
  dscSupportLevel: "yes" | "maybe" | "no";
  conditions: string[];
  accommodations: string[];
  learningPreferences: string[];
  tutoringPreferences: string[];
  learningChallenges: string[];
}

/** UI-facing user: merged from users + studentProfiles/tutorProfiles (blueprint). */
export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
  /** e.g. "Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other" */
  year?: string;
  /** One or more majors */
  major?: string[];
  learningStyle?: LearningStyle;
  learningStyleAnswers?: number[];
  learningStyleQuestionAnswers?: { question: string; answer: string }[];
  learningStyleCompletedAt?: unknown;
  learningSupport?: LearningSupport;
  /** True when the tutor has finished the 10-question tutor onboarding quiz. */
  tutorOnboardingCompleted?: boolean;
}

function rolesToRole(roles: UserRoles): UserRole {
  if (roles.admin) return "admin";
  if (roles.tutor) return "tutor";
  return "student";
}

function roleToRoles(role: UserRole): UserRoles {
  return {
    student: role === "student",
    tutor: role === "tutor",
    admin: role === "admin",
  };
}

/** Read a string from Firestore doc trying common key variants (Firestore keys are case-sensitive). */
function getStringFromDoc(docData: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = docData[k];
    if (v != null && typeof v === "string") return v.trim();
    if (v != null && typeof v === "number") return String(v).trim();
  }
  return "";
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
  loginAnimationMode: "login" | "signup";
  showLogoutAnimation: boolean;
  clearLogoutAnimation: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [loginAnimationMode, setLoginAnimationMode] = useState<"login" | "signup">("login");
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

      const minimalUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        role: "student",
      };
      // Do not set user or clear loading here: wait for Firestore so we never show "User"
      // (signup sets the real name; if we set minimalUser now we overwrite it before Firestore loads)

      try {
        await firestoreReady;
        if (!db) return;
        const uid = firebaseUser.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDocFromServer(userRef);

        let snap = userSnap;
        // Right after signup, our setDoc may not be visible to getDoc yet. Retry once so we don't overwrite with "User".
        if (!snap.exists()) {
          await new Promise((r) => setTimeout(r, 400));
          snap = await getDocFromServer(userRef);
        }

        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          const isNewSchema = typeof data.roles === "object" && data.roles !== null;

          if (isNewSchema) {
            const userData = data as UserDoc & { name?: string; learningSupport?: LearningSupport };
            const roles = userData.roles as UserRoles;
            const role = rolesToRole(roles);
            let firstName = getStringFromDoc(data, "firstName", "first_name", "FirstName", "firstname");
            let lastName = getStringFromDoc(data, "lastName", "last_name", "LastName", "lastname");
            const docName = getStringFromDoc(data, "name", "Name");
            if (!firstName && docName && docName !== "User") {
              const parts = docName.split(/\s+/);
              firstName = parts[0] ?? "";
              lastName = parts.slice(1).join(" ") ?? lastName;
            }
            console.log("[Auth] Profile loaded (new schema)", {
              schema: "new",
              docKeys: Object.keys(data),
              raw: {
                firstName: data.firstName,
                first_name: data.first_name,
                name: data.name,
              },
              resolved: { firstName: firstName || "(empty)", lastName: lastName || "(empty)" },
            });
            if (!firstName && Object.keys(data).length > 0) {
              console.warn("[Auth] users doc has no readable firstName. Doc keys:", Object.keys(data), "Sample:", JSON.stringify(data).slice(0, 200));
            }
            const name = [firstName, lastName].filter(Boolean).join(" ").trim() || firstName || "User";
            const majorArr = userData.major;
            const majorList = Array.isArray(majorArr) ? majorArr.filter((m): m is string => typeof m === "string") : undefined;
            let merged: User = {
              id: uid,
              name: name || "User",
              firstName: firstName || undefined,
              lastName: lastName || undefined,
              email: userData.email,
              role,
              avatar: userData.photoURL,
              university: userData.university,
              year: userData.year,
              major: majorList?.length ? majorList : undefined,
              learningSupport: userData.learningSupport,
              tutorOnboardingCompleted: userData.tutorOnboardingCompleted,
            };
            if (role === "student") {
              const studentRef = doc(db, "studentProfiles", uid);
              const studentSnap = await getDocFromServer(studentRef);
              if (studentSnap.exists()) {
                const sp = studentSnap.data() as StudentProfileDoc;
                merged.learningStyle = sp.learningStyle as LearningStyle | undefined;
                merged.learningStyleQuestionAnswers = sp.learningStyleQuestionAnswers;
              }
            }
            setUser(merged);
            if (role === "tutor" && (merged.avatar ?? null) != null) {
              setDoc(
                doc(db, "tutorProfiles", uid),
                { photoURL: merged.avatar ?? null, updatedAt: serverTimestamp() },
                { merge: true }
              ).catch((err) => console.warn("[Auth] Sync tutorProfiles photoURL on load:", err));
            }

            // One-time sync: ensure Firebase Auth has a display name from firstName for minimal user fallback
            if (!firebaseUser.displayName && (firstName || lastName)) {
              try {
                const { updateProfile } = await import("firebase/auth");
                const authName = [firstName, lastName].filter(Boolean).join(" ").trim();
                if (authName) await updateProfile(firebaseUser, { displayName: authName });
              } catch (e) {
                console.warn("[Auth] Failed to sync displayName from firstName:", e);
              }
            }
          } else {
            const legacy = data as Record<string, unknown> & { learningSupport?: LearningSupport; tutorOnboardingCompleted?: boolean };
            const role = (legacy.role as UserRole) || "student";
            let legacyFirst = getStringFromDoc(legacy, "firstName", "first_name", "FirstName", "firstname");
            let legacyLast = getStringFromDoc(legacy, "lastName", "last_name", "LastName", "lastname");
            const legacyName = getStringFromDoc(legacy, "name", "Name");
            if (!legacyFirst && legacyName && legacyName !== "User") {
              const parts = legacyName.split(/\s+/);
              legacyFirst = parts[0] ?? "";
              legacyLast = parts.slice(1).join(" ") ?? legacyLast;
            }
            console.log("[Auth] Profile loaded (legacy schema)", {
              schema: "legacy",
              docKeys: Object.keys(legacy),
              raw: {
                firstName: legacy.firstName,
                first_name: legacy.first_name,
                name: legacy.name,
              },
              resolved: { firstName: legacyFirst || "(empty)", lastName: legacyLast || "(empty)" },
            });
            if (!legacyFirst && Object.keys(legacy).length > 0) {
              console.warn("[Auth] users doc (legacy) has no readable firstName. Doc keys:", Object.keys(legacy));
            }
            const legacyMajor = legacy.major;
            const legacyMajorList = Array.isArray(legacyMajor) ? legacyMajor.filter((m): m is string => typeof m === "string") : undefined;
            let merged: User = {
              id: uid,
              name: legacyName || [legacyFirst, legacyLast].filter(Boolean).join(" ").trim() || minimalUser.name,
              firstName: legacyFirst || undefined,
              lastName: legacyLast || undefined,
              email: (legacy.email as string) || "",
              role,
              avatar: legacy.avatar as string | undefined,
              university: legacy.university as string | undefined,
              year: legacy.year as string | undefined,
              major: legacyMajorList?.length ? legacyMajorList : undefined,
              learningStyle: legacy.learningStyle as LearningStyle | undefined,
              learningStyleQuestionAnswers: legacy.learningStyleQuestionAnswers as
                | { question: string; answer: string }[]
                | undefined,
              learningStyleAnswers: legacy.learningStyleAnswers as number[] | undefined,
              learningSupport: legacy.learningSupport,
              tutorOnboardingCompleted: legacy.tutorOnboardingCompleted as boolean | undefined,
            };
            const indices = merged.learningStyleAnswers;
            if (
              Array.isArray(indices) &&
              indices.length > 0 &&
              !(merged.learningStyleQuestionAnswers?.length)
            ) {
              const questionAnswers = LEARNING_STYLE_QUIZ_QUESTIONS.slice(0, indices.length).map(
                (q, i) => ({
                  question: q.question,
                  answer: getQuizAnswerText(i, indices[i] ?? -1) || "—",
                })
              );
              try {
                await updateDoc(userRef, {
                  learningStyleQuestionAnswers: questionAnswers,
                  learningStyleAnswers: deleteField(),
                });
                merged = { ...merged, learningStyleQuestionAnswers: questionAnswers, learningStyleAnswers: undefined };
              } catch (e) {
                console.warn("[Auth] Quiz answers migration failed:", e);
              }
            }
            if (role === "student") {
              const studentRef = doc(db, "studentProfiles", uid);
              await setDoc(
                studentRef,
                {
                  uid,
                  learningStyle: merged.learningStyle,
                  learningStyleQuestionAnswers: merged.learningStyleQuestionAnswers,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                },
                { merge: true }
              );
            }
            setUser(merged);
            if (role === "tutor" && (merged.avatar ?? null) != null) {
              setDoc(
                doc(db, "tutorProfiles", uid),
                { photoURL: merged.avatar ?? null, updatedAt: serverTimestamp() },
                { merge: true }
              ).catch((err) => console.warn("[Auth] Sync tutorProfiles photoURL on load (legacy):", err));
            }
          }
        } else {
          const fromAuth = (firebaseUser.displayName || minimalUser.name).trim();
          const first = fromAuth.split(/\s+/)[0] || "";
          const last = fromAuth.split(/\s+/).slice(1).join(" ") || "";
          await setDoc(userRef, {
            uid,
            email: firebaseUser.email || "",
            firstName: first,
            lastName: last,
            photoURL: firebaseUser.photoURL || null,
            roles: { student: true, tutor: false, admin: false },
            status: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          await setDoc(doc(db, "studentProfiles", uid), {
            uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          const name = [first, last].filter(Boolean).join(" ").trim() || first || "User";
          setUser({
            ...minimalUser,
            name,
            firstName: first || undefined,
            lastName: last || undefined,
          });
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[Auth] Profile load/create failed:", msg, error);
        if (typeof msg === "string" && msg.includes("insufficient permissions")) {
          console.warn(
            "[Auth] Firestore denied access. Deploy rules: firebase deploy --only firestore:rules (from project root). Ensure you are logged in: firebase login."
          );
        }
        setUser(minimalUser);
      } finally {
        setProfileLoaded(true);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, _role: UserRole) => {
    await signInWithEmailAndPassword(auth, email, password);
    setLoginAnimationMode("login");
    setShowLoginAnimation(true);
  };

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    await firestoreReady;
    if (!db) return;
    const userRef = doc(db, "users", fbUser.uid);
    const snap = await getDocFromServer(userRef);
    if (!snap.exists()) {
      const fromAuth = (fbUser.displayName || "User").trim();
      const first = fromAuth.split(/\s+/)[0] || "";
      const last = fromAuth.split(/\s+/).slice(1).join(" ") || "";
      await setDoc(userRef, {
        uid: fbUser.uid,
        email: fbUser.email || "",
        firstName: first,
        lastName: last,
        photoURL: fbUser.photoURL || null,
        roles: roleToRoles(role),
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (role === "student") {
        await setDoc(doc(db, "studentProfiles", fbUser.uid), {
          uid: fbUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "tutorProfiles", fbUser.uid), {
          uid: fbUser.uid,
          firstName: first,
          lastName: last,
          photoURL: fbUser.photoURL || null,
          subjects: [],
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setLoginAnimationMode("signup");
    } else {
      setLoginAnimationMode("login");
    }
    setShowLoginAnimation(true);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;
    const uid = fbUser.uid;
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") ?? "";
    const displayName = [firstName, lastName].filter(Boolean).join(" ").trim() || firstName;

    await firestoreReady;
    if (db) {
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        photoURL: null,
        roles: roleToRoles(role),
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (role === "student") {
        await setDoc(doc(db, "studentProfiles", uid), {
          uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "tutorProfiles", uid), {
          uid,
          firstName: firstName || "",
          lastName: lastName || "",
          photoURL: fbUser.photoURL || null,
          subjects: [],
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    try {
      if (fbUser && displayName) {
        const { updateProfile } = await import("firebase/auth");
        await updateProfile(fbUser, { displayName });
      }
    } catch (e) {
      console.warn("[Auth] Failed to sync displayName on signup:", e);
    }

    setUser({
      id: uid,
      name: displayName,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email,
      role,
    });
    setLoginAnimationMode("signup");
    setShowLoginAnimation(true);
  };

  const logout = async () => {
    setShowLogoutAnimation(true);
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user || !db) return;
    const uid = user.id;
    const updatedUser = { ...user, ...updates };
    const first = updatedUser.firstName ?? "";
    const last = updatedUser.lastName ?? "";
    if (first || last) updatedUser.name = [first, last].filter(Boolean).join(" ").trim() || updatedUser.name;
    setUser(updatedUser);

    const userUpdates: Record<string, unknown> = {};
    if (updates.firstName != null) userUpdates.firstName = updates.firstName;
    if (updates.lastName != null) userUpdates.lastName = updates.lastName;
    if (updates.name != null) {
      const parts = String(updates.name).trim().split(/\s+/);
      userUpdates.firstName = parts[0] ?? "";
      userUpdates.lastName = parts.slice(1).join(" ") ?? "";
    }
    if (updates.avatar != null) userUpdates.photoURL = updates.avatar;
    if (updates.university != null) userUpdates.university = updates.university;
    if (updates.year != null) userUpdates.year = updates.year;
    if (updates.major != null) userUpdates.major = Array.isArray(updates.major) ? updates.major.filter(Boolean) : [];
    if (updates.learningStyle != null) userUpdates.learningStyle = updates.learningStyle;
    if (updates.learningStyleQuestionAnswers != null)
      userUpdates.learningStyleQuestionAnswers = updates.learningStyleQuestionAnswers;
    if (updates.learningSupport != null) userUpdates.learningSupport = updates.learningSupport;
    if (Object.keys(userUpdates).length > 0) {
      userUpdates.updatedAt = serverTimestamp();
      updateDoc(doc(db, "users", uid), userUpdates).catch((err) =>
        console.error("[Auth] updateUser users failed:", err)
      );
    }
    if (updates.avatar != null && user.role === "tutor") {
      setDoc(
        doc(db, "tutorProfiles", uid),
        { photoURL: updates.avatar, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch((err) => console.error("[Auth] updateUser tutorProfiles photoURL failed:", err));
    }

    const studentKeys = ["learningStyle", "learningStyleQuestionAnswers"];
    const hasStudentUpdates = studentKeys.some((k) => k in updates);
    if (hasStudentUpdates && user.role === "student") {
      const spUpdates: Record<string, unknown> = {};
      if (updates.learningStyle != null) spUpdates.learningStyle = updates.learningStyle;
      if (updates.learningStyleQuestionAnswers != null)
        spUpdates.learningStyleQuestionAnswers = updates.learningStyleQuestionAnswers;
      if (updates.learningStyleQuestionAnswers != null && updates.learningStyleQuestionAnswers.length > 0) {
        spUpdates.learningStyleAnswers = deleteField();
      }
      spUpdates.updatedAt = serverTimestamp();
      setDoc(
        doc(db, "studentProfiles", uid),
        { uid, ...spUpdates },
        { merge: true }
      ).catch((err) => console.error("[Auth] updateUser studentProfiles failed:", err));
    }
  };

  const changePassword = async (_email: string, newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");
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
        loginAnimationMode,
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
