import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import type { TutorRequestDoc, TutorRequestStatus } from "../types/firestore";

export interface TutorRequest {
  id: string;
  studentUid: string;
  tutorUid: string;
  status: TutorRequestStatus;
  initialMessage?: string;
  subject?: string;
  createdAt: unknown;
  updatedAt: unknown;
  respondedAt: unknown;
}

interface TutorRequestsContextType {
  /** Requests where current user is the tutor (incoming) */
  incomingRequests: TutorRequest[];
  /** Requests where current user is the student (outgoing) */
  myRequests: TutorRequest[];
  isLoading: boolean;
  error: string | null;
  createRequest: (tutorUid: string, initialMessage?: string, subject?: string) => Promise<string>;
  acceptRequest: (
    requestId: string,
    tutorFirstName: string,
    tutorPhotoURL?: string,
    studentFirstName?: string,
    studentPhotoURL?: string
  ) => Promise<{ connectionId: string; conversationId: string }>;
  rejectRequest: (requestId: string) => Promise<void>;
  getRequestById: (requestId: string) => TutorRequest | undefined;
  hasPendingRequestToTutor: (tutorUid: string) => boolean;
}

const TutorRequestsContext = createContext<TutorRequestsContextType | undefined>(undefined);

function toRequest(
  d: { id: string; data: () => Record<string, unknown> }
): TutorRequest {
  const data = d.data() as TutorRequestDoc & { createdAt?: unknown; updatedAt?: unknown; respondedAt?: unknown };
  return {
    id: d.id,
    studentUid: data.studentUid,
    tutorUid: data.tutorUid,
    status: data.status,
    initialMessage: data.initialMessage,
    subject: data.subject,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    respondedAt: data.respondedAt,
  };
}

export function TutorRequestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<TutorRequest[]>([]);
  const [myRequests, setMyRequests] = useState<TutorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = user?.id ?? null;

  useEffect(() => {
    if (!uid || !db) {
      setIncomingRequests([]);
      setMyRequests([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setError(null);
    (async () => {
      await firestoreReady;
      if (cancelled || !db) return;
      try {
        const [incomingSnap, mySnap] = await Promise.all([
          getDocs(
            query(
              collection(db, "tutorRequests"),
              where("tutorUid", "==", uid),
              where("status", "==", "pending")
            )
          ),
          getDocs(
            query(
              collection(db, "tutorRequests"),
              where("studentUid", "==", uid)
            )
          ),
        ]);
        if (cancelled) return;
        setIncomingRequests(incomingSnap.docs.map(toRequest));
        setMyRequests(mySnap.docs.map(toRequest));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load requests");
          setIncomingRequests([]);
          setMyRequests([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const createRequest = useCallback(
    async (tutorUid: string, initialMessage?: string, subject?: string): Promise<string> => {
      if (!uid || !db) throw new Error("Not authenticated");
      await firestoreReady;
      const ref = await addDoc(collection(db, "tutorRequests"), {
        studentUid: uid,
        tutorUid,
        status: "pending",
        initialMessage: initialMessage ?? null,
        subject: subject ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        respondedAt: null,
      } as Omit<TutorRequestDoc, "createdAt" | "updatedAt" | "respondedAt"> & {
        createdAt: ReturnType<typeof serverTimestamp>;
        updatedAt: ReturnType<typeof serverTimestamp>;
        respondedAt: null;
      });
      const newReq: TutorRequest = {
        id: ref.id,
        studentUid: uid,
        tutorUid,
        status: "pending",
        initialMessage,
        subject,
        createdAt: null,
        updatedAt: null,
        respondedAt: null,
      };
      setMyRequests((prev) => [newReq, ...prev]);
      return ref.id;
    },
    [uid]
  );

  const acceptRequest = useCallback(
    async (
      requestId: string,
      tutorFirstName: string,
      tutorPhotoURL?: string,
      studentFirstName?: string,
      studentPhotoURL?: string
    ): Promise<{ connectionId: string; conversationId: string }> => {
      if (!uid || !db) throw new Error("Not authenticated");
      await firestoreReady;
      const requestRef = doc(db, "tutorRequests", requestId);
      const requestSnap = await getDoc(requestRef);
      if (!requestSnap.exists()) throw new Error("Request not found");
      const reqData = requestSnap.data() as TutorRequestDoc;
      if (reqData.tutorUid !== uid) throw new Error("Only the tutor can accept this request");
      if (reqData.status !== "pending") throw new Error("Request already responded to");

      const studentUid = reqData.studentUid;
      const convRef = doc(collection(db, "conversations"));
      const conversationId = convRef.id;
      const studentFirst = studentFirstName ?? "Student";
      const studentPhoto = studentPhotoURL;

      await setDoc(convRef, {
        type: "direct",
        participantUids: [studentUid, uid],
        participantSummary: {
          [studentUid]: {
            firstName: studentFirst,
            photoURL: studentPhoto ?? "",
            role: "student",
          },
          [uid]: {
            firstName: tutorFirstName,
            photoURL: tutorPhotoURL ?? "",
            role: "tutor",
          },
        },
        connectionId: null,
        lastMessageText: reqData.initialMessage ?? "",
        lastMessageSenderUid: studentUid,
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const connRef = await addDoc(collection(db, "connections"), {
        studentUid,
        tutorUid: uid,
        requestId,
        status: "active",
        conversationId,
        studentFirstName: studentFirst,
        studentPhotoURL: studentPhotoURL ?? "",
        createdAt: serverTimestamp(),
        endedAt: null,
      });
      await updateDoc(convRef, { connectionId: connRef.id });

      await updateDoc(requestRef, {
        status: "accepted",
        updatedAt: serverTimestamp(),
        respondedAt: serverTimestamp(),
      });

      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" as const } : r))
      );

      return { connectionId: connRef.id, conversationId };
    },
    [uid]
  );

  const rejectRequest = useCallback(
    async (requestId: string): Promise<void> => {
      if (!uid || !db) throw new Error("Not authenticated");
      await firestoreReady;
      const requestRef = doc(db, "tutorRequests", requestId);
      const requestSnap = await getDoc(requestRef);
      if (!requestSnap.exists()) throw new Error("Request not found");
      const reqData = requestSnap.data() as TutorRequestDoc;
      if (reqData.tutorUid !== uid) throw new Error("Only the tutor can reject this request");
      if (reqData.status !== "pending") return;

      await updateDoc(requestRef, {
        status: "rejected",
        updatedAt: serverTimestamp(),
        respondedAt: serverTimestamp(),
      });
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    },
    [uid]
  );

  const getRequestById = useCallback(
    (requestId: string) => {
      return incomingRequests.find((r) => r.id === requestId) ?? myRequests.find((r) => r.id === requestId);
    },
    [incomingRequests, myRequests]
  );

  const hasPendingRequestToTutor = useCallback(
    (tutorUid: string) => {
      return myRequests.some((r) => r.tutorUid === tutorUid && r.status === "pending");
    },
    [myRequests]
  );

  const value: TutorRequestsContextType = {
    incomingRequests,
    myRequests,
    isLoading,
    error,
    createRequest,
    acceptRequest,
    rejectRequest,
    getRequestById,
    hasPendingRequestToTutor,
  };
  return (
    <TutorRequestsContext.Provider value={value}>
      {children}
    </TutorRequestsContext.Provider>
  );
}

export function useTutorRequests(): TutorRequestsContextType {
  const ctx = useContext(TutorRequestsContext);
  if (ctx === undefined) {
    throw new Error("useTutorRequests must be used within a TutorRequestsProvider");
  }
  return ctx;
}
