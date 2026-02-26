import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Session {
  id: number;
  subject: string;
  tutor: string;
  tutorAvatar: string;
  student?: string;
  studentAvatar?: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed";
  location?: string;
}

interface CalendarEvent {
  id: number;
  type: "class" | "study" | "assignment" | "tutor";
  title: string;
  startTime: string;
  endTime: string;
  day: number;
  date: Date;
  tutor?: string;
  participants?: string[];
  color?: string;
  courseName?: string;
  dueTime?: string;
  location?: string;
}

interface CalendarContextType {
  sessions: Session[];
  calendarEvents: CalendarEvent[];
  addSession: (session: Session) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  updateSession: (id: number, session: Partial<Session>) => void;
  updateCalendarEvent: (id: number, event: Partial<CalendarEvent>) => void;
  removeSession: (id: number) => void;
  removeCalendarEvent: (id: number) => void;
  removedSessionIds: number[];
  addRemovedSessionId: (id: number) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const defaultSessions: Session[] = [
  {
    id: 1,
    subject: "Math 2A - Matrices",
    tutor: "Debra Peterson",
    tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Feb 15, 2026",
    time: "2:00 PM",
    duration: "1 hour",
    status: "upcoming",
    location: "Online",
  },
  {
    id: 2,
    subject: "Physics - Mechanics",
    tutor: "Adam Smith",
    tutorAvatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBtZW50b3IlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzA5MjkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Feb 18, 2026",
    time: "10:00 AM",
    duration: "1 hour",
    status: "upcoming",
    location: "UCI",
  },
  {
    id: 3,
    subject: "Math 2A - Derivatives",
    tutor: "Debra Peterson",
    tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Nov 5, 2025",
    time: "2:00 PM",
    duration: "1 hour",
    status: "completed",
  },
];

const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: 1,
    type: "class",
    title: "Math 2A",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    day: 5,
    date: new Date(2026, 1, 13),
    tutor: "Debra Peterson",
    location: "Online",
    color: "from-[#5b7ceb] to-[#7c3aed]",
  },
  {
    id: 2,
    type: "class",
    title: "Physics",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    day: 2,
    date: new Date(2026, 1, 17),
    tutor: "Adam Smith",
    location: "UCI",
    color: "from-[#14b8a6] to-[#0891b2]",
  },
  {
    id: 3,
    type: "study",
    title: "Chemistry Study",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    day: 5,
    date: new Date(2026, 1, 13),
    participants: ["Sarah Chen", "Michael Torres"],
    location: "Irvine High School",
    color: "from-[#14b8a6] to-[#06b6d4]",
  },
  {
    id: 4,
    type: "class",
    title: "Writing 39B",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    day: 1,
    date: new Date(2026, 1, 16),
    tutor: "Jennifer Lee",
    location: "Online",
    color: "from-[#8b5cf6] to-[#a855f7]",
  },
  {
    id: 5,
    type: "class",
    title: "Biology Lab",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    day: 4,
    date: new Date(2026, 1, 19),
    tutor: "Dr. Martinez",
    location: "UCI",
    color: "from-[#ec4899] to-[#f43f5e]",
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem('sessions');
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultSessions;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
    return defaultCalendarEvents;
  });

  const [removedSessionIds, setRemovedSessionIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('removedSessions');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('removedSessions', JSON.stringify(removedSessionIds));
  }, [removedSessionIds]);

  const addSession = (session: Session) => {
    setSessions(prev => [...prev, session]);
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  const updateSession = (id: number, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateCalendarEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const removeCalendarEvent = (id: number) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const addRemovedSessionId = (id: number) => {
    setRemovedSessionIds(prev => [...prev, id]);
  };

  return (
    <CalendarContext.Provider
      value={{
        sessions,
        calendarEvents,
        addSession,
        addCalendarEvent,
        updateSession,
        updateCalendarEvent,
        removeSession,
        removeCalendarEvent,
        removedSessionIds,
        addRemovedSessionId,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}