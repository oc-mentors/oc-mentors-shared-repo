import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db, firestoreReady } from "../lib/firebase";
import { loadCollectionWithRetry } from "../lib/firestoreNative";
import type { TutorProfileDoc } from "../types/firestore";
import { displayTutorRating } from "../lib/tutorRating";
import { useAuth } from "./AuthContext";

/**
 * Tutor as used in the app (from tutorProfiles/{uid} only).
 * id is Firebase Auth UID (string) from tutorProfiles.
 */
export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major?: string;
  subjects: string[];
  learningStyle: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  pricePerHour?: number;
  review?: string;
  bio?: string;
  availability?: string[];
  totalSessions?: number;
  responseTime?: string;
  experience?: string;
  location?: string;
  supportedLearningDifferences?: string[];
  teachingAdjustments?: string[];
  accessibilityExperience?: string;
  /** Pitch/demo card — not a live Firestore tutor */
  isDemo?: boolean;
}

function mapTutorProfileToTutor(docId: string, d: TutorProfileDoc): Tutor {
  const displayName = d.displayName?.trim() ?? "";
  const fromParts = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
  return {
    id: docId,
    name: fromParts || displayName || d.firstName?.trim() || docId,
    avatar: d.photoURL ?? "",
    university: d.university ?? "",
    major: d.major,
    subjects: Array.isArray(d.subjects) ? d.subjects : [],
    learningStyle: d.experienceLabel ?? "",
    rating: displayTutorRating(d.ratingAvg),
    reviewCount: d.ratingCount ?? 0,
    priceLevel: d.priceLevel ?? "",
    pricePerHour: d.pricePerHour,
    review: d.review,
    bio: d.bio,
    availability: d.availability,
    totalSessions: d.totalSessions,
    responseTime: d.responseTime ?? (d.responseTimeMinutes != null ? `< ${d.responseTimeMinutes} min` : undefined),
    experience: d.experience ?? d.experienceLabel,
    location: d.location,
    supportedLearningDifferences: Array.isArray(d.supportedLearningDifferences)
      ? d.supportedLearningDifferences
      : [],
    teachingAdjustments: Array.isArray(d.teachingAdjustments) ? d.teachingAdjustments : [],
    accessibilityExperience: d.accessibilityExperience,
  };
}

interface TutorsContextType {
  tutors: Tutor[];
  isLoading: boolean;
  error: string | null;
  refreshTutors: () => void;
}

const TutorsContext = createContext<TutorsContextType | undefined>(undefined);

export function TutorsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTutors = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const authUid = auth?.currentUser?.uid ?? null;
    const signedIn = isAuthenticated || !!authUid;

    if (!signedIn) {
      setTutors([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setError(null);
    setTutors([]);
    setIsLoading(true);

    (async () => {
      await firestoreReady;
      if (cancelled || !db) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      let list: Tutor[] = [];

      try {
        const tutorProfilesSnap = await loadCollectionWithRetry(
          collection(db, "tutorProfiles"),
          "tutorProfiles"
        );
        if (cancelled) return;

        list = tutorProfilesSnap.docs
          .filter((d) => {
            const data = d.data() as TutorProfileDoc;
            return data.isActive !== false;
          })
          .map((d) => mapTutorProfileToTutor(d.id, d.data() as TutorProfileDoc))
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log("[Tutors] loaded", list.length, "tutor profile(s)");
      } catch (e) {
        console.error("[Tutors] tutorProfiles load failed:", e);
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load tutors");
          setTutors([]);
          setIsLoading(false);
        }
        return;
      }

      // Optional: connected tutors (must not fail the main list — missing index on TV is common)
      const uid = user?.id ?? authUid;
      const role = user?.role;
      if (uid && role !== "tutor" && role !== "admin") {
        try {
          const connectionsSnap = await getDocs(
            query(collection(db, "connections"), where("studentUid", "==", uid))
          );
          const connectedTutorIds = Array.from(
            new Set(
              connectionsSnap.docs
                .map((d) => d.data() as Record<string, unknown>)
                .filter((d) => d.status !== "inactive" && d.status !== "declined")
                .map((d) => (typeof d.tutorUid === "string" ? d.tutorUid : ""))
                .filter(Boolean)
            )
          );
          const existingIds = new Set(list.map((t) => t.id));
          const missingConnectedIds = connectedTutorIds.filter((id) => !existingIds.has(id));
          if (missingConnectedIds.length > 0) {
            const connectedTutors = await Promise.all(
              missingConnectedIds.map(async (tutorUid) => {
                try {
                  const userSnap = await getDoc(doc(db, "users", tutorUid));
                  if (!userSnap.exists()) return null;
                  const data = userSnap.data() as Record<string, unknown>;
                  const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
                  const lastName = typeof data.lastName === "string" ? data.lastName.trim() : "";
                  const displayName =
                    [firstName, lastName].filter(Boolean).join(" ") ||
                    (typeof data.name === "string" ? data.name.trim() : "") ||
                    "Tutor";
                  return {
                    id: tutorUid,
                    name: displayName,
                    avatar: typeof data.photoURL === "string" ? data.photoURL : "",
                    university: typeof data.university === "string" ? data.university : "",
                    subjects: [],
                    learningStyle: "",
                    rating: displayTutorRating(0),
                    reviewCount: 0,
                    priceLevel: "",
                  } as Tutor;
                } catch {
                  return null;
                }
              })
            );
            list = [...list, ...connectedTutors.filter(Boolean) as Tutor[]].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          }
        } catch (e) {
          console.warn("[Tutors] connections enrichment skipped:", e);
        }
      }

      // Optional: merge avatars from users/{uid}
      try {
        const uidList = list.map((t) => t.id);
        const userPhotos = await Promise.all(
          uidList.map(async (tutorUid) => {
            try {
              const uSnap = await getDoc(doc(db, "users", tutorUid));
              const data = uSnap.exists() ? uSnap.data() : null;
              const photoURL =
                data &&
                typeof data === "object" &&
                data !== null &&
                "photoURL" in data
                  ? (data as { photoURL?: string | null }).photoURL
                  : undefined;
              const url =
                typeof photoURL === "string" && photoURL.trim() !== ""
                  ? photoURL
                  : "";
              return [tutorUid, url] as const;
            } catch {
              return [tutorUid, ""] as const;
            }
          })
        );
        const userPhotoMap = Object.fromEntries(userPhotos);
        list = list.map((t) => {
          const fromProfile = t.avatar?.trim() ? t.avatar : "";
          const fromUser = userPhotoMap[t.id] ?? "";
          const best = fromProfile || fromUser;
          return best ? { ...t, avatar: best } : t;
        });
      } catch (e) {
        console.warn("[Tutors] avatar enrichment skipped:", e);
      }

      if (!cancelled) {
        setTutors(list);
        setError(null);
      }
    })().finally(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id, user?.role, refreshKey, auth?.currentUser?.uid]);

  const value: TutorsContextType = { tutors, isLoading, error, refreshTutors };
  return <TutorsContext.Provider value={value}>{children}</TutorsContext.Provider>;
}

export function useTutors(): TutorsContextType {
  const ctx = useContext(TutorsContext);
  if (ctx === undefined) {
    throw new Error("useTutors must be used within a TutorsProvider");
  }
  return ctx;
}
