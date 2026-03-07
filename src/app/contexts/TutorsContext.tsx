import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";

/** Tutor document as stored in Firestore and used across TutorsPage, TutorDetailPage, SubjectTutorsPage. */
export interface Tutor {
  id: number;
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
      if (cancelled) return;
      try {
        const snap = await getDocs(collection(db, "tutors"));
        if (cancelled) return;
        const list = snap.docs
          .map((d) => d.data() as Tutor)
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setTutors(list);
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
    throw new Error("useTutors must be used within TutorsProvider");
  }
  return ctx;
}
