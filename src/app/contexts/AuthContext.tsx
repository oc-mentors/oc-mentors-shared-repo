import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
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
import { loadUserDocWithRetry } from "../lib/firestoreNative";
import {
  roleFromUserDoc,
  resolveRoleWithProfileFallback,
  rolesToRole,
} from "../lib/resolveUserRole";
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

const FIRESTORE_READ_MS = 25_000;

type PendingProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
};

function applyPendingProfile(uid: string, user: User, pending: PendingProfile | null): User {
  if (!pending || pending.uid !== uid) return user;
  return {
    ...user,
    firstName: pending.firstName || user.firstName,
    lastName: pending.lastName || user.lastName,
    name: pending.name || user.name,
    role: pending.role || user.role,
  };
}

function nameFromAuthDisplay(firebaseUser: { displayName: string | null; email: string | null }): {
  firstName: string;
  lastName: string;
  name: string;
} {
  const raw = (firebaseUser.displayName || "").trim();
  if (raw && raw !== "User") {
    const parts = raw.split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName, name: raw };
  }
  const local = (firebaseUser.email || "").split("@")[0]?.replace(/[._+]/g, " ").trim() || "";
  const firstName = local.split(/\s+/)[0] ?? "";
  return { firstName, lastName: "", name: firstName || "User" };
}

/** Logs + avoids infinite spinner if Firestore never settles on mobile WebView. */
async function firestoreRead<T>(promise: Promise<T>, label: string): Promise<T> {
  console.log(`[Socratic OC] ${label} … start`);
  try {
    const result = await Promise.race([
      promise,
      new Promise<never>((_, rej) =>
        setTimeout(
          () =>
            rej(
              new Error(
                `[Socratic OC] Firestore timed out after ${FIRESTORE_READ_MS}ms (${label}). Check network / rules / Safari → Develop → iPhone → Console.`
              )
            ),
          FIRESTORE_READ_MS
        )
      ),
    ]);
    console.log(`[Socratic OC] ${label} … ok`);
    return result;
  } catch (e) {
    console.error(`[Socratic OC] ${label} … failed`, e);
    throw e;
  }
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
  const [loginAnimationMode, setLoginAnimationMode] = useState<"login" | "signup">("login");
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const pendingProfileRef = useRef<PendingProfile | null>(null);
  /** Role chosen on login screen — used when Firestore profile read fails on TV. */
  const loginRoleRef = useRef<UserRole | null>(null);

  const isAuthenticated = !!user;

  const commitUser = (uid: string, next: User) => {
    setUser(applyPendingProfile(uid, next, pendingProfileRef.current));
  };

  const clearLoginAnimation = () => setShowLoginAnimation(false);
  const clearLogoutAnimation = () => setShowLogoutAnimation(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("[Socratic OC] Auth: Firebase not configured or auth missing — spinner off.");
      setIsLoading(false);
      return;
    }

    let sawAuthCallback = false;
    const noCallbackTimer = window.setTimeout(() => {
      if (!sawAuthCallback) {
        console.warn(
          "[Socratic OC] Auth: onAuthStateChanged still has not fired after 20s. Open Safari → Develop → your iPhone → pick this app → Console. Check network and Firebase Auth (authorized domains include capacitor://localhost)."
        );
      }
    }, 20_000);

    console.log("[Socratic OC] Auth: listening for onAuthStateChanged …");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      sawAuthCallback = true;
      console.log("[Socratic OC] Auth: state changed", {
        signedIn: !!firebaseUser,
        uid: firebaseUser?.uid ?? null,
      });

      if (!firebaseUser) {
        console.log("[Socratic OC] Auth: no user — hiding loading spinner.");
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
        console.log("[Socratic OC] Auth: waiting for firestoreReady …");
        await firestoreReady;
        console.log("[Socratic OC] Auth: firestoreReady finished");
        if (!db) {
          console.error("[Socratic OC] Auth: db is null after firestoreReady — using login role fallback.");
          const authNames = nameFromAuthDisplay(firebaseUser);
          commitUser(firebaseUser.uid, {
            ...minimalUser,
            name: authNames.name,
            firstName: authNames.firstName || undefined,
            lastName: authNames.lastName || undefined,
            role: loginRoleRef.current ?? "student",
          });
          return;
        }
        const uid = firebaseUser.uid;
        const userRef = doc(db, "users", uid);
        console.log("[Socratic OC] Auth: loading Firestore user doc …");
        const snap = await loadUserDocWithRetry(userRef, `users/${uid}`);

        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          const isNewSchema = typeof data.roles === "object" && data.roles !== null;

          if (isNewSchema) {
            const userData = data as UserDoc & { name?: string; learningSupport?: LearningSupport };
            const roles = userData.roles as UserRoles;
            const role =
              roleFromUserDoc(data) ??
              rolesToRole(roles) ??
              (await resolveRoleWithProfileFallback(
                db,
                uid,
                loginRoleRef.current ?? pendingProfileRef.current?.role
              ));
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
            if (firstName) pendingProfileRef.current = null;
            commitUser(uid, merged);
            if (role === "student") {
              try {
                const studentRef = doc(db, "studentProfiles", uid);
                const studentSnap = await loadUserDocWithRetry(
                  studentRef,
                  `studentProfiles/${uid}`
                );
                if (studentSnap.exists()) {
                  const sp = studentSnap.data() as StudentProfileDoc;
                  if (!firstName && sp.firstName?.trim()) firstName = sp.firstName.trim();
                  if (!lastName && sp.lastName?.trim()) lastName = sp.lastName.trim();
                  if ((!firstName || merged.name === "User") && sp.displayName?.trim()) {
                    const spName = sp.displayName.trim();
                    const spParts = spName.split(/\s+/);
                    if (!firstName) firstName = spParts[0] ?? "";
                    if (!lastName) lastName = spParts.slice(1).join(" ");
                    merged.name = spName;
                  } else if (firstName || lastName) {
                    merged.name = [firstName, lastName].filter(Boolean).join(" ").trim() || merged.name;
                  }
                  merged.firstName = firstName || merged.firstName;
                  merged.lastName = lastName || merged.lastName;
                  merged.learningStyle = sp.learningStyle as LearningStyle | undefined;
                  merged.learningStyleQuestionAnswers = sp.learningStyleQuestionAnswers;
                  const spMissingName = !(sp.firstName && String(sp.firstName).trim());
                  if (spMissingName && (firstName || lastName)) {
                    setDoc(
                      studentRef,
                      {
                        firstName: firstName || "",
                        lastName: lastName || "",
                        displayName: name,
                        updatedAt: serverTimestamp(),
                      },
                      { merge: true }
                    ).catch((err) => console.warn("[Auth] Backfill studentProfiles name:", err));
                  }
                  commitUser(uid, merged);
                }
              } catch (e) {
                console.warn("[Auth] studentProfiles enrichment skipped:", e);
              }
            }
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
            const role =
              roleFromUserDoc(legacy) ??
              (await resolveRoleWithProfileFallback(
                db,
                uid,
                loginRoleRef.current ?? pendingProfileRef.current?.role
              ));
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
              try {
                const studentRef = doc(db, "studentProfiles", uid);
                await firestoreRead(
                  setDoc(
                    studentRef,
                    {
                      uid,
                      firstName: merged.firstName || "",
                      lastName: merged.lastName || "",
                      displayName: merged.name,
                      learningStyle: merged.learningStyle,
                      learningStyleQuestionAnswers: merged.learningStyleQuestionAnswers,
                      createdAt: serverTimestamp(),
                      updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                  ),
                  `setDoc studentProfiles/${uid} (legacy merge)`
                );
              } catch (e) {
                console.warn("[Auth] studentProfiles legacy merge skipped:", e);
              }
            }
            if (legacyFirst) pendingProfileRef.current = null;
            commitUser(uid, merged);
            if (role === "tutor" && (merged.avatar ?? null) != null) {
              setDoc(
                doc(db, "tutorProfiles", uid),
                { photoURL: merged.avatar ?? null, updatedAt: serverTimestamp() },
                { merge: true }
              ).catch((err) => console.warn("[Auth] Sync tutorProfiles photoURL on load (legacy):", err));
            }
          }
        } else {
          const pending = pendingProfileRef.current;
          const fromAuthName = pending?.uid === uid ? pending.name : nameFromAuthDisplay(firebaseUser).name;
          const first =
            pending?.uid === uid ? pending.firstName : nameFromAuthDisplay(firebaseUser).firstName;
          const last =
            pending?.uid === uid ? pending.lastName : nameFromAuthDisplay(firebaseUser).lastName;
          console.log("[Socratic OC] Auth: no users doc — creating profile docs …");
          const bootstrapRole = await resolveRoleWithProfileFallback(
            db,
            uid,
            pending?.role ?? loginRoleRef.current ?? "student"
          );
          const display = fromAuthName || [first, last].filter(Boolean).join(" ").trim() || first || "User";
          await firestoreRead(
            setDoc(userRef, {
              uid,
              email: firebaseUser.email || "",
              firstName: first,
              lastName: last,
              name: display,
              role: bootstrapRole,
              photoURL: firebaseUser.photoURL || null,
              roles: roleToRoles(bootstrapRole),
              status: "active",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }),
            `setDoc users/${uid} (bootstrap)`
          );
          const name = display;
          if (bootstrapRole === "tutor") {
            await firestoreRead(
              setDoc(doc(db, "tutorProfiles", uid), {
                uid,
                firstName: first || "",
                lastName: last || "",
                displayName: name,
                subjects: ["General"],
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              }),
              `setDoc tutorProfiles/${uid} (bootstrap)`
            );
          } else {
            await firestoreRead(
              setDoc(doc(db, "studentProfiles", uid), {
                uid,
                firstName: first || "",
                lastName: last || "",
                displayName: name,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              }),
              `setDoc studentProfiles/${uid} (bootstrap)`
            );
          }
          commitUser(uid, {
            ...minimalUser,
            name,
            firstName: first || undefined,
            lastName: last || undefined,
            role: bootstrapRole,
          });
          if (first) pendingProfileRef.current = null;
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[Auth] Profile load/create failed:", msg, error);
        if (typeof msg === "string" && msg.includes("insufficient permissions")) {
          console.warn(
            "[Auth] Firestore denied access. Deploy rules: firebase deploy --only firestore:rules (from project root). Ensure you are logged in: firebase login."
          );
        }
        const authNames = nameFromAuthDisplay(firebaseUser);
        const uid = firebaseUser.uid;
        const fallbackRole: UserRole = db
          ? await resolveRoleWithProfileFallback(
              db,
              uid,
              loginRoleRef.current ?? pendingProfileRef.current?.role
            )
          : loginRoleRef.current ?? pendingProfileRef.current?.role ?? "student";
        console.log("[Auth] Profile load failed — resolved role:", fallbackRole);
        commitUser(uid, {
          ...minimalUser,
          name: authNames.name,
          firstName: authNames.firstName || undefined,
          lastName: authNames.lastName || undefined,
          role: fallbackRole,
        });
      } finally {
        loginRoleRef.current = null;
        setProfileLoaded(true);
        setIsLoading(false);
        console.log("[Socratic OC] Auth: profile flow finished — isLoading false");
      }
    });

    return () => {
      window.clearTimeout(noCallbackTimer);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    assertFirebaseAuth();
    loginRoleRef.current = role;
    await signInWithEmailAndPassword(auth, email, password);
    setLoginAnimationMode("login");
    setShowLoginAnimation(true);
  };

  const loginWithGoogle = async (role: UserRole) => {
    assertFirebaseAuth();
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
          firstName: first,
          lastName: last,
          displayName: fromAuth,
          photoURL: fbUser.photoURL || null,
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
    assertFirebaseAuth();
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") ?? "";
    const displayName = [firstName, lastName].filter(Boolean).join(" ").trim() || firstName;

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;
    const uid = fbUser.uid;

    pendingProfileRef.current = { uid, firstName, lastName, name: displayName, role };

    await firestoreReady;
    if (db) {
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        name: displayName,
        role,
        photoURL: null,
        roles: roleToRoles(role),
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (role === "student") {
        await setDoc(doc(db, "studentProfiles", uid), {
          uid,
          firstName: firstName || "",
          lastName: lastName || "",
          displayName,
          photoURL: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "tutorProfiles", uid), {
          uid,
          firstName: firstName || "",
          lastName: lastName || "",
          displayName,
          photoURL: fbUser.photoURL || null,
          subjects: ["General"],
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

    commitUser(uid, {
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
    if (!auth) {
      setUser(null);
      return;
    }
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

    if (
      user.role === "student" &&
      (updates.firstName != null ||
        updates.lastName != null ||
        updates.name != null ||
        updates.avatar != null)
    ) {
      setDoc(
        doc(db, "studentProfiles", uid),
        {
          uid,
          firstName: updatedUser.firstName ?? "",
          lastName: updatedUser.lastName ?? "",
          displayName: updatedUser.name ?? "",
          ...(updates.avatar != null ? { photoURL: updates.avatar } : {}),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((err) => console.error("[Auth] updateUser studentProfiles identity failed:", err));
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
    assertFirebaseAuth();
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
