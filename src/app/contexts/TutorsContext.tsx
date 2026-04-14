import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import type { TutorProfileDoc } from "../types/firestore";

/**
 * Tutor as used in the app (blueprint: from tutorProfiles/{uid}, fallback legacy tutors).
 * id is Firebase Auth UID (string) for tutorProfiles, or legacy numeric id as string.
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
        const [tutorProfilesSnap, legacySnap] = await Promise.all([
          getDocs(collection(db, "tutorProfiles")),
          getDocs(collection(db, "tutors")),
        ]);
        if (cancelled) return;

        const fromProfiles: Tutor[] = tutorProfilesSnap.docs
          .filter((d) => {
            const data = d.data() as TutorProfileDoc;
            return data.isActive !== false;
          })
          .map((d) => mapTutorProfileToTutor(d.id, d.data() as TutorProfileDoc));

        const fromLegacy: Tutor[] = legacySnap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              name: (data.name as string) ?? "",
              avatar: (data.avatar as string) ?? "",
              university: (data.university as string) ?? "",
              major: data.major as string | undefined,
              subjects: Array.isArray(data.subjects) ? (data.subjects as string[]) : [],
              learningStyle: (data.learningStyle as string) ?? "",
              rating: (data.rating as number) ?? 0,
              reviewCount: (data.reviewCount as number) ?? 0,
              priceLevel: (data.priceLevel as string) ?? "",
              pricePerHour: data.pricePerHour as number | undefined,
              review: data.review as string | undefined,
              bio: data.bio as string | undefined,
              availability: data.availability as string[] | undefined,
              totalSessions: data.totalSessions as number | undefined,
              responseTime: data.responseTime as string | undefined,
              experience: data.experience as string | undefined,
              location: data.location as string | undefined,
            } as Tutor;
          });

        const profileIds = new Set(fromProfiles.map((t) => t.id));
        const legacyOnly = fromLegacy.filter((t) => !profileIds.has(t.id));
        let list: Tutor[] = [...fromProfiles, ...legacyOnly].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

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
  }, []);

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
