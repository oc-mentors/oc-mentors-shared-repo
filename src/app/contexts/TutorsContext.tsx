import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import type { TutorProfileDoc } from "../types/firestore";
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
}

function mapTutorProfileToTutor(docId: string, d: TutorProfileDoc): Tutor {
  return {
    id: docId,
    name: ([d.firstName, d.lastName].filter(Boolean).join(" ") || d.firstName) ?? d.uid,
    avatar: d.photoURL ?? "",
    university: d.university ?? "",
    major: d.major,
    subjects: Array.isArray(d.subjects) ? d.subjects : [],
    learningStyle: d.experienceLabel ?? "",
    rating: d.ratingAvg ?? 0,
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
  };
}

interface TutorsContextType {
  tutors: Tutor[];
  isLoading: boolean;
  error: string | null;
}

const TutorsContext = createContext<TutorsContextType | undefined>(undefined);

export function TutorsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setTutors([]);
    setIsLoading(true);

    (async () => {
      await firestoreReady;
      if (cancelled || !db) return;
      try {
        const tutorProfilesSnap = await getDocs(collection(db, "tutorProfiles"));
        if (cancelled) return;

        const fromProfiles: Tutor[] = tutorProfilesSnap.docs
          .filter((d) => {
            const data = d.data() as TutorProfileDoc;
            return data.isActive !== false;
          })
          .map((d) => mapTutorProfileToTutor(d.id, d.data() as TutorProfileDoc));

        let list: Tutor[] = [...fromProfiles].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        // Ensure student-linked tutors are still visible, even if their tutorProfile is missing.
        const uid = user?.id;
        if (uid && user?.role !== "tutor" && user?.role !== "admin") {
          const connectionsSnap = await getDocs(
            query(
              collection(db, "connections"),
              where("studentUid", "==", uid),
              where("status", "==", "active")
            )
          );
          const connectedTutorIds = Array.from(
            new Set(
              connectionsSnap.docs
                .map((d) => d.data() as Record<string, unknown>)
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
                    rating: 0,
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
        }

        const uidList = list.map((t) => t.id);
        const userPhotos = await Promise.all(
          uidList.map(async (uid) => {
            try {
              const uSnap = await getDoc(doc(db, "users", uid));
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
              return [uid, url] as const;
            } catch {
              return [uid, ""] as const;
            }
          })
        );
        const userPhotoMap = Object.fromEntries(userPhotos);
        list = list.map((t) => {
          const fromProfile =
            t.avatar && t.avatar.trim() !== "" ? t.avatar : "";
          const fromUser = userPhotoMap[t.id] ?? "";
          const best = fromProfile || fromUser;
          return best ? { ...t, avatar: best } : t;
        });

        if (!cancelled) setTutors(list);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load tutors");
          setTutors([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  const value: TutorsContextType = { tutors, isLoading, error };
  return (
    <TutorsContext.Provider value={value}>
      {children}
    </TutorsContext.Provider>
  );
}

export function useTutors(): TutorsContextType {
  const ctx = useContext(TutorsContext);
  if (ctx === undefined) {
    throw new Error("useTutors must be used within a TutorsProvider");
  }
  return ctx;
}
