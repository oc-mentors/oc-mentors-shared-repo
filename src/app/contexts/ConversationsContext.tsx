import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "./AuthContext";

export interface Message {
  id: number;
  text: string;
  time: string;
  isSent: boolean;
  attachments?: { type: "image" | "file"; url: string; name?: string }[];
  replyTo?: {
    id: number;
    text: string;
    isSent: boolean;
  };
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  university: string;
  message: string;
  timestamp: string;
  unread: boolean;
  pinned: boolean;
  pinnedAt?: number; // Timestamp when pinned
  role: "tutor" | "professor" | "ta" | "peer"; // Role/relation to student
  tutorId?: number; // ID matching TutorDetailPage tutorsData — only set for role === "tutor"
}

interface ConversationsContextType {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: number, updates: Partial<Conversation>) => void;
  deleteConversation: (id: number) => void;
  getConversation: (id: number) => Conversation | undefined;
  hasConversation: (id: number) => boolean;
  getMessages: (conversationId: number) => Message[];
  addMessage: (conversationId: number, message: Message) => void;
  setMessagesForConversation: (conversationId: number, messages: Message[]) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

const defaultConversations: Conversation[] = [
  {
    id: 1,
    name: "Debra Peterson",
    avatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Perfect! I can definitely help with that. When would you like to schedule a session?",
    timestamp: "10:35 AM",
    unread: true,
    pinned: false,
    role: "tutor",
    tutorId: 1,
  },
  {
    id: 2,
    name: "Dr. Robert Chen",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzb3IlMjBtYWxlJTIwYXNpYW58ZW58MXx8fHwxNzQwNTI4NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Office hours tomorrow are moved to 3-5 PM. See you then!",
    timestamp: "2:15 PM",
    unread: false,
    pinned: false,
    role: "professor",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NDA1Mjg2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "The study guide for the midterm is ready. I'll bring copies to discussion.",
    timestamp: "Yesterday",
    unread: true,
    pinned: false,
    role: "ta",
  },
  {
    id: 4,
    name: "Marcus Williams",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzQwNTI4NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Want to form a study group for the physics exam?",
    timestamp: "Yesterday",
    unread: false,
    pinned: false,
    role: "peer",
  },
  {
    id: 5,
    name: "Adam Smith",
    avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Great session today! Let me know if you need help with anything else.",
    timestamp: "2 days ago",
    unread: false,
    pinned: false,
    role: "tutor",
    tutorId: 2,
  },
  {
    id: 6,
    name: "Maarya Khan",
    avatar: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNjaWVudGlzdCUyMHJlc2VhcmNoZXJ8ZW58MXx8fHwxNzcwOTI5MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Thanks for the great review! Looking forward to our next session.",
    timestamp: "3 days ago",
    unread: false,
    pinned: false,
    role: "tutor",
    tutorId: 3,
  },
  {
    id: 7,
    name: "Sara Johnson",
    avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDg5MjQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Hi! I saw you viewed my profile. Would you like to set up a session?",
    timestamp: "4 days ago",
    unread: false,
    pinned: false,
    role: "tutor",
    tutorId: 5,
  },
];

const defaultMessages: Record<number, Message[]> = {
  // Tutor - Debra Peterson (Math tutoring)
  1: [
    {
      id: 1,
      text: "Hi! I saw your profile and would love to book a session with you.",
      time: "10:30 AM",
      isSent: true,
    },
    {
      id: 2,
      text: "Hello! That would be great. What subject do you need help with?",
      time: "10:32 AM",
      isSent: false,
    },
    {
      id: 3,
      text: "I need help with Math 2A, specifically matrices and derivatives.",
      time: "10:33 AM",
      isSent: true,
    },
    {
      id: 4,
      text: "Perfect! I can definitely help with that. When would you like to schedule a session?",
      time: "10:35 AM",
      isSent: false,
    },
  ],
  // Professor - Dr. Robert Chen (CHEM 1A)
  2: [
    {
      id: 1,
      text: "Hi Professor Chen, I had a question about the lab safety quiz.",
      time: "1:45 PM",
      isSent: true,
    },
    {
      id: 2,
      text: "Of course! What's your question?",
      time: "1:50 PM",
      isSent: false,
    },
    {
      id: 3,
      text: "For question 7, are we supposed to memorize all the chemical symbols or will there be a reference sheet?",
      time: "1:52 PM",
      isSent: true,
    },
    {
      id: 4,
      text: "Good question. You'll have a periodic table reference during the lab sessions, but you should know the common ones like H, O, C, N, etc.",
      time: "1:55 PM",
      isSent: false,
    },
    {
      id: 5,
      text: "That makes sense, thank you!",
      time: "1:56 PM",
      isSent: true,
    },
    {
      id: 6,
      text: "Also, a reminder that I'm changing my office hours for tomorrow.",
      time: "2:10 PM",
      isSent: false,
    },
    {
      id: 7,
      text: "Office hours tomorrow are moved to 3-5 PM. See you then!",
      time: "2:15 PM",
      isSent: false,
    },
  ],
  // TA - Emily Rodriguez (PHYS 7C)
  3: [
    {
      id: 1,
      text: "Hey Emily! Will you be covering rotational dynamics in discussion this week?",
      time: "Yesterday, 9:20 AM",
      isSent: true,
    },
    {
      id: 2,
      text: "Yes! I'm planning to do some practice problems on angular momentum.",
      time: "Yesterday, 9:45 AM",
      isSent: false,
    },
    {
      id: 3,
      text: "That would be super helpful. I'm really struggling with that concept.",
      time: "Yesterday, 9:47 AM",
      isSent: true,
    },
    {
      id: 4,
      text: "No worries, lots of students find it tricky. I'll make sure to explain it step by step.",
      time: "Yesterday, 9:50 AM",
      isSent: false,
    },
    {
      id: 5,
      text: "Also, I'm working on a study guide for the midterm. Should be ready by Friday.",
      time: "Yesterday, 10:15 AM",
      isSent: false,
    },
    {
      id: 6,
      text: "Amazing! That would help so much.",
      time: "Yesterday, 10:18 AM",
      isSent: true,
    },
    {
      id: 7,
      text: "The study guide for the midterm is ready. I'll bring copies to discussion.",
      time: "Yesterday, 11:30 AM",
      isSent: false,
    },
  ],
  // Peer - Marcus Williams (Study group)
  4: [
    {
      id: 1,
      text: "Hey Marcus! I saw you're in PHYS 7C too.",
      time: "Yesterday, 3:15 PM",
      isSent: true,
    },
    {
      id: 2,
      text: "Yeah! Are you in Professor Johnson's section?",
      time: "Yesterday, 3:20 PM",
      isSent: false,
    },
    {
      id: 3,
      text: "Yes! The midterm next week is looking pretty tough.",
      time: "Yesterday, 3:22 PM",
      isSent: true,
    },
    {
      id: 4,
      text: "For real. I was thinking about starting a study group. You interested?",
      time: "Yesterday, 3:25 PM",
      isSent: false,
    },
    {
      id: 5,
      text: "Definitely! That would be really helpful.",
      time: "Yesterday, 3:27 PM",
      isSent: true,
    },
    {
      id: 6,
      text: "Cool! I know a couple other people who might want to join too.",
      time: "Yesterday, 3:30 PM",
      isSent: false,
    },
    {
      id: 7,
      text: "Want to form a study group for the physics exam?",
      time: "Yesterday, 3:35 PM",
      isSent: false,
    },
    {
      id: 8,
      text: "Perfect! When were you thinking?",
      time: "Yesterday, 3:40 PM",
      isSent: true,
    },
  ],
  // Tutor - Adam Smith (Calculus)
  5: [
    {
      id: 1,
      text: "Hi Adam! I heard you're great with calculus.",
      time: "9:15 AM",
      isSent: true,
    },
    {
      id: 2,
      text: "Thanks! Yes, calculus is one of my specialties. How can I help?",
      time: "9:18 AM",
      isSent: false,
    },
    {
      id: 3,
      text: "I'm struggling with integration techniques.",
      time: "9:20 AM",
      isSent: true,
    },
    {
      id: 4,
      text: "Great session today! Let me know if you need help with anything else.",
      time: "2 days ago",
      isSent: false,
    },
  ],
  // Tutor - Maarya Khan (Biology)
  6: [
    {
      id: 1,
      text: "Hey! Are you available for tutoring this week?",
      time: "3 days ago",
      isSent: true,
    },
    {
      id: 2,
      text: "Yes! I have slots on Tuesday and Thursday afternoons.",
      time: "3 days ago",
      isSent: false,
    },
    {
      id: 3,
      text: "Perfect! I'll book Thursday at 3pm.",
      time: "3 days ago",
      isSent: true,
    },
    {
      id: 4,
      text: "Thanks for the great review! Looking forward to our next session.",
      time: "3 days ago",
      isSent: false,
    },
  ],
  // Tutor - Sara Johnson (Writing)
  7: [
    {
      id: 1,
      text: "Hi! I saw you viewed my profile. Would you like to set up a session?",
      time: "4 days ago",
      isSent: false,
    },
    {
      id: 2,
      text: "Yes! I'm interested in getting help with writing.",
      time: "4 days ago",
      isSent: true,
    },
    {
      id: 3,
      text: "Great! I specialize in essay writing and literature analysis.",
      time: "4 days ago",
      isSent: false,
    },
  ],
};

// Firestore: users/{uid}/conversations/{convId}, users/{uid}/conversations/{convId}/messages/{msgId}
// Rules: allow read, write if request.auth != null && request.auth.uid == uid (for users/{uid}/conversations and subcollections)
const CONVERSATIONS_COLLECTION = "conversations";
const MESSAGES_COLLECTION = "messages";

function conversationRef(uid: string, conversationId: number) {
  return doc(db, "users", uid, CONVERSATIONS_COLLECTION, String(conversationId));
}
function messagesRef(uid: string, conversationId: number) {
  return collection(db, "users", uid, CONVERSATIONS_COLLECTION, String(conversationId), MESSAGES_COLLECTION);
}
function messageRef(uid: string, conversationId: number, messageId: number) {
  return doc(db, "users", uid, CONVERSATIONS_COLLECTION, String(conversationId), MESSAGES_COLLECTION, String(messageId));
}

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Record<number, Message[]>>({});
  const [loaded, setLoaded] = useState(false);

  // Load from Firestore when user is ready; seed with defaults if empty
  useEffect(() => {
    if (!user?.id) {
      setConversations([]);
      setConversationMessages({});
      setLoaded(true);
      return;
    }

    const uid = user.id;

    (async () => {
      await firestoreReady;
      try {
        const convSnap = await getDocs(collection(db, "users", uid, CONVERSATIONS_COLLECTION));
        if (convSnap.empty) {
          // Seed: write default conversations and messages to Firestore
          const batch = writeBatch(db);
          for (const c of defaultConversations) {
            const ref = conversationRef(uid, c.id);
            batch.set(ref, { ...c, id: c.id });
          }
          await batch.commit();
          for (const c of defaultConversations) {
            const msgs = defaultMessages[c.id];
            if (msgs?.length) {
              const msgBatch = writeBatch(db);
              for (const m of msgs) {
                msgBatch.set(messageRef(uid, c.id, m.id), { ...m, id: m.id });
              }
              await msgBatch.commit();
            }
          }
          setConversations(defaultConversations);
          setConversationMessages(defaultMessages);
        } else {
          const convs: Conversation[] = [];
          const msgsMap: Record<number, Message[]> = {};
          for (const d of convSnap.docs) {
            const data = d.data() as Conversation;
            convs.push({ ...data, id: data.id });
            const msgSnap = await getDocs(messagesRef(uid, data.id));
            msgsMap[data.id] = msgSnap.docs
              .map(md => ({ ...md.data(), id: (md.data() as Message).id } as Message))
              .sort((a, b) => a.id - b.id);
          }
          convs.sort((a, b) => a.id - b.id);
          setConversations(convs);
          setConversationMessages(msgsMap);
        }
      } catch (e) {
        console.error("[Conversations] Load/seed failed:", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user?.id]);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations(prev => {
      if (prev.some(c => c.id === conversation.id)) return prev;
      return [conversation, ...prev];
    });
    setConversationMessages(prev =>
      prev[conversation.id] ? prev : { ...prev, [conversation.id]: [] }
    );
    if (user?.id) {
      firestoreReady.then(() =>
        setDoc(conversationRef(user.id, conversation.id), { ...conversation, id: conversation.id })
      ).catch(e => console.error("[Conversations] addConversation write failed:", e));
    }
  }, [user?.id]);

  const updateConversation = useCallback((id: number, updates: Partial<Conversation>) => {
    setConversations(prev =>
      prev.map(conv => (conv.id === id ? { ...conv, ...updates } : conv))
    );
    if (user?.id) {
      firestoreReady.then(() =>
        setDoc(conversationRef(user.id, id), { ...updates, id }, { merge: true })
      ).catch(e => console.error("[Conversations] updateConversation write failed:", e));
    }
  }, [user?.id]);

  const deleteConversation = useCallback(async (id: number) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setConversationMessages(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (user?.id) {
      try {
        await firestoreReady;
        const msgSnap = await getDocs(messagesRef(user.id, id));
        for (const d of msgSnap.docs) await deleteDoc(d.ref);
        await deleteDoc(conversationRef(user.id, id));
      } catch (e) {
        console.error("[Conversations] deleteConversation failed:", e);
      }
    }
  }, [user?.id]);

  const getConversation = useCallback((id: number) => {
    return conversations.find(c => c.id === id);
  }, [conversations]);

  const hasConversation = useCallback((id: number) => {
    return conversations.some(c => c.id === id);
  }, [conversations]);

  const getMessages = useCallback((conversationId: number) => {
    return conversationMessages[conversationId] || [];
  }, [conversationMessages]);

  const addMessage = useCallback((conversationId: number, message: Message) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, message: message.text, timestamp: message.time } : c)
    );
    if (user?.id) {
      firestoreReady.then(async () => {
        await setDoc(messageRef(user.id, conversationId, message.id), { ...message, id: message.id });
        await setDoc(
          conversationRef(user.id, conversationId),
          { message: message.text, timestamp: message.time, id: conversationId },
          { merge: true }
        );
      }).catch(e => console.error("[Conversations] addMessage write failed:", e));
    }
  }, [user?.id]);

  const setMessagesForConversation = useCallback((conversationId: number, messages: Message[]) => {
    setConversationMessages(prev => ({ ...prev, [conversationId]: messages }));
    if (user?.id) {
      firestoreReady.then(async () => {
        const ref = messagesRef(user.id, conversationId);
        const snap = await getDocs(ref);
        for (const d of snap.docs) await deleteDoc(d.ref);
        for (const m of messages) {
          await setDoc(messageRef(user.id, conversationId, m.id), { ...m, id: m.id });
        }
      }).catch(e => console.error("[Conversations] setMessagesForConversation failed:", e));
    }
  }, [user?.id]);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        addConversation,
        updateConversation,
        deleteConversation,
        getConversation,
        hasConversation,
        getMessages,
        addMessage,
        setMessagesForConversation,
      }}
    >
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