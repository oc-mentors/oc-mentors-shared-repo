import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Message {
  id: number;
  text: string;
  time: string;
  isSent: boolean;
  attachments?: { type: "image" | "file"; url: string; name?: string }[];
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
  },
  {
    id: 2,
    name: "Adam Smith",
    avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Great session today! Let me know if you need help with anything else.",
    timestamp: "Yesterday",
    unread: false,
    pinned: false,
    role: "tutor",
  },
  {
    id: 3,
    name: "Maarya Khan",
    avatar: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNjaWVudGlzdCUyMHJlc2VhcmNoZXJ8ZW58MXx8fHwxNzcwOTI5MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Thanks for the great review! Looking forward to our next session.",
    timestamp: "2 days ago",
    unread: false,
    pinned: false,
    role: "tutor",
  },
  {
    id: 4,
    name: "Sara Johnson",
    avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDg5MjQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    university: "University of California, Irvine",
    message: "Hi! I saw you viewed my profile. Would you like to set up a session?",
    timestamp: "3 days ago",
    unread: false,
    pinned: false,
    role: "tutor",
  },
];

const defaultMessages: Record<number, Message[]> = {
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
  2: [
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
      time: "Yesterday",
      isSent: false,
    },
  ],
  3: [
    {
      id: 1,
      text: "Hey! Are you available for tutoring this week?",
      time: "2 days ago",
      isSent: true,
    },
    {
      id: 2,
      text: "Yes! I have slots on Tuesday and Thursday afternoons.",
      time: "2 days ago",
      isSent: false,
    },
    {
      id: 3,
      text: "Perfect! I'll book Thursday at 3pm.",
      time: "2 days ago",
      isSent: true,
    },
    {
      id: 4,
      text: "Thanks for the great review! Looking forward to our next session.",
      time: "2 days ago",
      isSent: false,
    },
  ],
  4: [
    {
      id: 1,
      text: "Hi! I saw you viewed my profile. Would you like to set up a session?",
      time: "3 days ago",
      isSent: false,
    },
    {
      id: 2,
      text: "Yes! I'm interested in getting help with writing.",
      time: "3 days ago",
      isSent: true,
    },
    {
      id: 3,
      text: "Great! I specialize in essay writing and literature analysis.",
      time: "3 days ago",
      isSent: false,
    },
  ],
};

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem('conversations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [conversationMessages, setConversationMessages] = useState<Record<number, Message[]>>(() => {
    try {
      const stored = localStorage.getItem('conversationMessages');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('conversationMessages', JSON.stringify(conversationMessages));
  }, [conversationMessages]);

  const addConversation = (conversation: Conversation) => {
    setConversations(prev => {
      if (prev.some(c => c.id === conversation.id)) {
        return prev;
      }
      return [conversation, ...prev];
    });

    setConversationMessages(prev => {
      if (!prev[conversation.id]) {
        return {
          ...prev,
          [conversation.id]: [],
        };
      }
      return prev;
    });
  };

  const updateConversation = (id: number, updates: Partial<Conversation>) => {
    setConversations(prev =>
      prev.map(conv => (conv.id === id ? { ...conv, ...updates } : conv))
    );
  };

  const deleteConversation = (id: number) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setConversationMessages(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getConversation = (id: number) => {
    return conversations.find(c => c.id === id);
  };

  const hasConversation = (id: number) => {
    return conversations.some(c => c.id === id);
  };

  const getMessages = (conversationId: number) => {
    return conversationMessages[conversationId] || [];
  };

  const addMessage = (conversationId: number, message: Message) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    updateConversation(conversationId, {
      message: message.text,
      timestamp: message.time,
    });
  };

  const setMessagesForConversation = (conversationId: number, messages: Message[]) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: messages,
    }));
  };

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