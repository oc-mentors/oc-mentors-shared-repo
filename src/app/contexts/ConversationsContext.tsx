import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import type { ConversationDoc, MessageDoc } from "../types/firestore";

export interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  attachments?: { type: "image" | "file"; url: string; name?: string }[];
  replyTo?: { id: string; text: string; isSent: boolean };
}

/** UI shape: id is Firestore conversation doc id (string). */
export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  university: string;
  message: string;
  timestamp: string;
  unread: boolean;
  pinned: boolean;
  pinnedAt?: number;
  role: "tutor" | "professor" | "ta" | "peer" | "student";
  tutorId?: string;
}

function formatMessageTime(ts: Timestamp | null): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date((ts as unknown as { seconds: number }).seconds * 1000);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diff < 86400000 * 2) return "Yesterday";
  if (diff < 86400000 * 7) return `${Math.floor(diff / 86400000)} days ago`;
  return d.toLocaleDateString();
}

interface ConversationsContextType {
  conversations: Conversation[];
  loaded: boolean;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  hasConversation: (id: string) => boolean;
  getMessages: (conversationId: string) => Message[];
  setMessagesForConversation: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Omit<Message, "id" | "time">) => Promise<void>;
  loadMessagesForConversation: (conversationId: string) => Promise<void>;
  subscribeToMessages: (conversationId: string) => Unsubscribe;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});
  const [loaded, setLoaded] = useState(false);

  const uid = user?.id ?? null;

  useEffect(() => {
    if (!uid || !db) {
      setConversations([]);
      setConversationMessages({});
      setLoaded(true);
      return;
    }

    (async () => {
      await firestoreReady;
      if (!db) return;
      try {
        // Query without orderBy so it works without a composite index (single array-contains is enough)
        const q = query(
          collection(db, "conversations"),
          where("participantUids", "array-contains", uid)
        );
        const snap = await getDocs(q);
        const withTime = snap.docs.map((d) => {
          const data = d.data() as ConversationDoc;
          const otherUid = data.participantUids?.find((p) => p !== uid) ?? "";
          const summary = data.participantSummary?.[otherUid];
          const lastAt = data.lastMessageAt as Timestamp | null;
          const lastMs = lastAt?.toDate?.()?.getTime() ?? 0;
          const conv: Conversation = {
            id: d.id,
            name: summary?.firstName ?? (summary as { displayName?: string })?.displayName ?? "Unknown",
            avatar: summary?.photoURL ?? "",
            university: "",
            message: data.lastMessageText ?? "",
            timestamp: formatMessageTime(lastAt),
            unread: false,
            pinned: false,
            role: (summary?.role as "tutor" | "professor" | "ta" | "peer" | "student") ?? "peer",
            tutorId: summary?.role === "tutor" ? otherUid : undefined,
          };
          return { conv, lastMs };
        });
        withTime.sort((a, b) => b.lastMs - a.lastMs);
        setConversations(withTime.map(({ conv }) => conv));
      } catch (e) {
        console.error("[Conversations] Load failed:", e);
        setConversations([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, [uid]);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      if (prev.some((c) => c.id === conversation.id)) return prev;
      return [conversation, ...prev];
    });
    setConversationMessages((prev) =>
      prev[conversation.id] ? prev : { ...prev, [conversation.id]: [] }
    );
  }, []);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setConversationMessages((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (uid && db) {
      try {
        await firestoreReady;
        const convRef = doc(db, "conversations", id);
        const msgSnap = await getDocs(collection(db, "conversations", id, "messages"));
        const batch = (await import("firebase/firestore")).writeBatch(db);
        msgSnap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        await (await import("firebase/firestore")).deleteDoc(convRef);
      } catch (e) {
        console.error("[Conversations] deleteConversation failed:", e);
      }
    }
  }, [uid]);

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const hasConversation = useCallback(
    (id: string) => conversations.some((c) => c.id === id),
    [conversations]
  );

  const getMessages = useCallback(
    (conversationId: string) => conversationMessages[conversationId] ?? [],
    [conversationMessages]
  );

  const mapDocToMessage = useCallback(
    (d: { id: string; data: () => Record<string, unknown> }): Message => {
      const data = d.data() as MessageDoc & { createdAt?: Timestamp };
      const created = data.createdAt as Timestamp | null;
      return {
        id: d.id,
        text: data.text,
        time: formatMessageTime(created),
        isSent: data.senderUid === uid,
        attachments: data.attachments,
        replyTo: data.replyToMessageId ? undefined : undefined,
      };
    },
    [uid]
  );

  const loadMessagesForConversation = useCallback(
    async (conversationId: string) => {
      if (!uid || !db) return;
      await firestoreReady;
      const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      const msgs: Message[] = snap.docs.map((d) =>
        mapDocToMessage({ id: d.id, data: () => d.data() })
      );
      setConversationMessages((prev) => ({ ...prev, [conversationId]: msgs }));
    },
    [uid, mapDocToMessage]
  );

  const subscribeToMessages = useCallback(
    (conversationId: string): Unsubscribe => {
      if (!db) return () => {};
      const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
      );
      return onSnapshot(q, (snap) => {
        const msgs: Message[] = snap.docs.map((d) =>
          mapDocToMessage({ id: d.id, data: () => d.data() })
        );
        setConversationMessages((prev) => ({ ...prev, [conversationId]: msgs }));
      });
    },
    [mapDocToMessage]
  );

  const addMessage = useCallback(
    async (
      conversationId: string,
      message: Omit<Message, "id" | "time">
    ) => {
      if (!uid || !db) return;
      await firestoreReady;
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      await addDoc(messagesRef, {
        senderUid: uid,
        text: message.text,
        type: "text",
        attachments: message.attachments ?? [],
        replyToMessageId: message.replyTo?.id ?? null,
        createdAt: serverTimestamp(),
      } as Omit<MessageDoc, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> });
      const convRef = doc(db, "conversations", conversationId);
      await updateDoc(convRef, {
        lastMessageText: message.text,
        lastMessageSenderUid: uid,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Do not optimistically append the message here — the real-time subscription
      // (subscribeToMessages) will add it when Firestore updates, or we'd show it twice.
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, message: message.text, timestamp: "Just now" }
            : c
        )
      );
    },
    [uid]
  );

  const setMessagesForConversation = useCallback((conversationId: string, messages: Message[]) => {
    setConversationMessages((prev) => ({ ...prev, [conversationId]: messages }));
  }, []);

  const value: ConversationsContextType = {
    conversations,
    loaded,
    addConversation,
    updateConversation,
    deleteConversation,
    getConversation,
    hasConversation,
    getMessages,
    addMessage,
    setMessagesForConversation,
    loadMessagesForConversation,
    subscribeToMessages,
  };
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
}
