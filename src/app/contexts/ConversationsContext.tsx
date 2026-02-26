import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem('conversations_v2');
    return stored ? JSON.parse(stored) : defaultConversations;
  });

  const [conversationMessages, setConversationMessages] = useState<Record<number, Message[]>>(() => {
    const stored = localStorage.getItem('conversationMessages_v2');
    return stored ? JSON.parse(stored) : defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('conversations_v2', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('conversationMessages_v2', JSON.stringify(conversationMessages));
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