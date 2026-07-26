import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import type { ConnectionDoc } from "../types/firestore";

export interface Connection {
  id: string;
  studentUid: string;
  tutorUid: string;
  requestId: string;
  status: string;
  conversationId: string;
  studentFirstName?: string;
  studentPhotoURL?: string;
  createdAt: unknown;
  endedAt: unknown;
}

interface ConnectionsContextType {
  connections: Connection[];
  isLoading: boolean;
  error: string | null;
  refetchConnections: () => Promise<void>;
  getConnectionWithTutor: (tutorUid: string) => Connection | undefined;
  getOrCreateConnectionWithTutor: (
    tutorUid: string,
    tutorFirstName: string,
    tutorPhotoURL?: string,
    studentFirstName?: string,
    studentPhotoURL?: string
  ) => Promise<{ connection: Connection; conversationId: string }>;
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = user?.id ?? null;

  const loadConnections = useCallback(async () => {
    if (!uid || !db) {
      setConnections([]);
      return;
    }
    setError(null);
    try {
      const [studentSnap, tutorSnap] = await Promise.all([
        getDocs(query(collection(db, "connections"), where("studentUid", "==", uid))),
        getDocs(query(collection(db, "connections"), where("tutorUid", "==", uid))),
      ]);
      const seen = new Set<string>();
      const list: Connection[] = [];
      for (const d of tutorSnap.docs) {
        if (seen.has(d.id)) continue;
        seen.add(d.id);
        const data = d.data();
        list.push({
          id: d.id,
          studentUid: data.studentUid,
          tutorUid: data.tutorUid,
          requestId: data.requestId ?? "",
          status: data.status,
          conversationId: data.conversationId ?? "",
          studentFirstName: data.studentFirstName ?? data.studentDisplayName,
          studentPhotoURL: data.studentPhotoURL,
          createdAt: data.createdAt,
          endedAt: data.endedAt,
        } as Connection);
      }
      for (const d of studentSnap.docs) {
        if (seen.has(d.id)) continue;
        seen.add(d.id);
        const data = d.data();
        list.push({
          id: d.id,
          studentUid: data.studentUid,
          tutorUid: data.tutorUid,
          requestId: data.requestId ?? "",
          status: data.status,
          conversationId: data.conversationId ?? "",
          studentFirstName: data.studentFirstName ?? data.studentDisplayName,
          studentPhotoURL: data.studentPhotoURL,
          createdAt: data.createdAt,
          endedAt: data.endedAt,
        } as Connection);
      }
      setConnections(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load connections");
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (!uid || !db) {
      setConnections([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setError(null);
    (async () => {
      await firestoreReady;
      if (cancelled || !db) return;
      try {
        const [studentSnap, tutorSnap] = await Promise.all([
          getDocs(query(collection(db, "connections"), where("studentUid", "==", uid))),
          getDocs(query(collection(db, "connections"), where("tutorUid", "==", uid))),
        ]);
        if (cancelled) return;
        const seen = new Set<string>();
        const list: Connection[] = [];
        for (const d of tutorSnap.docs) {
          if (seen.has(d.id)) continue;
          seen.add(d.id);
          const data = d.data();
          list.push({
            id: d.id,
            studentUid: data.studentUid,
            tutorUid: data.tutorUid,
            requestId: data.requestId ?? "",
            status: data.status,
            conversationId: data.conversationId ?? "",
            studentFirstName: data.studentFirstName ?? data.studentDisplayName,
            studentPhotoURL: data.studentPhotoURL,
            createdAt: data.createdAt,
            endedAt: data.endedAt,
          } as Connection);
        }
        for (const d of studentSnap.docs) {
          if (seen.has(d.id)) continue;
          seen.add(d.id);
          const data = d.data();
          list.push({
            id: d.id,
            studentUid: data.studentUid,
            tutorUid: data.tutorUid,
            requestId: data.requestId ?? "",
            status: data.status,
            conversationId: data.conversationId ?? "",
            studentFirstName: data.studentFirstName ?? data.studentDisplayName,
            studentPhotoURL: data.studentPhotoURL,
            createdAt: data.createdAt,
            endedAt: data.endedAt,
          } as Connection);
        }
        if (!cancelled) setConnections(list);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load connections");
          setConnections([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const refetchConnections = useCallback(async () => {
    await firestoreReady;
    await loadConnections();
  }, [loadConnections]);

  const getConnectionWithTutor = useCallback(
    (tutorUid: string) => {
      return connections.find(
        (c) => (c.studentUid === uid && c.tutorUid === tutorUid) && c.status === "active"
      );
    },
    [connections, uid]
  );

  const getOrCreateConnectionWithTutor = useCallback(
    async (
      tutorUid: string,
      tutorFirstName: string,
      tutorPhotoURL?: string,
      studentFirstName?: string,
      studentPhotoURL?: string
    ): Promise<{ connection: Connection; conversationId: string }> => {
      if (!uid || !db) throw new Error("Not authenticated");
      await firestoreReady;
      const existing = connections.find(
        (c) => c.studentUid === uid && c.tutorUid === tutorUid && c.status === "active"
      );
      if (existing && existing.conversationId) {
        return { connection: existing, conversationId: existing.conversationId };
      }
      const { getDoc, setDoc } = await import("firebase/firestore");
      const convRef = doc(collection(db, "conversations"));
      const conversationId = convRef.id;
      const studentFirst = studentFirstName ?? user?.firstName ?? user?.name?.split(" ")[0] ?? "Student";
      const studentPhoto = studentPhotoURL ?? user?.avatar;
      await setDoc(convRef, {
        type: "direct",
        participantUids: [uid, tutorUid],
        participantSummary: {
          [uid]: {
            firstName: studentFirst,
            ...(studentPhoto ? { photoURL: studentPhoto } : {}),
            role: "student",
          },
          [tutorUid]: {
            firstName: tutorFirstName,
            ...(tutorPhotoURL ? { photoURL: tutorPhotoURL } : {}),
            role: "tutor",
          },
        },
        lastMessageText: "",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const connRef = await addDoc(collection(db, "connections"), {
        studentUid: uid,
        tutorUid,
        requestId: "",
        status: "active",
        conversationId,
        studentFirstName: studentFirst,
        studentPhotoURL: studentPhoto ?? null,
        createdAt: serverTimestamp(),
        endedAt: null,
      } as Omit<ConnectionDoc, "requestId"> & { requestId: string });
      const newConnection: Connection = {
        id: connRef.id,
        studentUid: uid,
        tutorUid,
        requestId: "",
        status: "active",
        conversationId,
        studentFirstName: studentFirst,
        studentPhotoURL: studentPhoto ?? undefined,
        createdAt: null,
        endedAt: null,
      };
      setConnections((prev) => [...prev.filter((c) => c.id !== connRef.id), newConnection]);
      return { connection: newConnection, conversationId };
    },
    [uid, user?.firstName, user?.name, user?.avatar, connections]
  );

  const value: ConnectionsContextType = {
    connections,
    isLoading,
    error,
    refetchConnections,
    getConnectionWithTutor,
    getOrCreateConnectionWithTutor,
  };
  return (
    <ConnectionsContext.Provider value={value}>
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections(): ConnectionsContextType {
  const ctx = useContext(ConnectionsContext);
  if (ctx === undefined) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return ctx;
}
