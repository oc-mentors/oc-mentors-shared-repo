import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CanvasAssignment } from './CanvasCoursesContext';

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
  courseId?: number;
  dueTime?: string;
  location?: string;
  completed?: boolean;
  /** True for events created by the user (not synced from Canvas). Prevents courseId from being mistaken as a Canvas import. */
  isUserCreated?: boolean;
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
  syncCanvasAssignments: (assignments: CanvasAssignment[]) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

function formatSessionDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDefaultSessions(): Session[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = new Date(today); d1.setDate(d1.getDate() + 1);
  const d3 = new Date(today); d3.setDate(d3.getDate() + 3);
  const past = new Date(today); past.setDate(past.getDate() - 5);
  return [
    {
      id: 1,
      subject: "Math 2A - Matrices",
      tutor: "Debra Peterson",
      tutorAvatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG1lbnRvciUyMHR1dG9yfGVufDF8fHx8MTc3MDkyOTIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      date: formatSessionDate(d1),
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
      date: formatSessionDate(d3),
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
      date: formatSessionDate(past),
      time: "2:00 PM",
      duration: "1 hour",
      status: "completed",
    },
  ];
}

function getDefaultCalendarEvents(): CalendarEvent[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = new Date(today); d1.setDate(d1.getDate() + 1);
  const d3 = new Date(today); d3.setDate(d3.getDate() + 3);
  const d0 = new Date(today);
  const d4 = new Date(today); d4.setDate(d4.getDate() + 4);
  const d5 = new Date(today); d5.setDate(d5.getDate() + 5);
  return [
    { id: 1, type: "tutor", title: "Math 2A - Matrices", startTime: "2:00 PM", endTime: "3:00 PM", day: d1.getDay(), date: d1, tutor: "Debra Peterson", location: "Online", courseId: 2 },
    { id: 2, type: "tutor", title: "Physics - Mechanics", startTime: "10:00 AM", endTime: "11:00 AM", day: d3.getDay(), date: d3, tutor: "Adam Smith", location: "UCI", courseId: 3 },
    { id: 3, type: "study", title: "Chemistry Study", startTime: "3:00 PM", endTime: "5:00 PM", day: d0.getDay(), date: d0, participants: ["Sarah Chen", "Michael Torres"], location: "Irvine High School", courseId: 1 },
    { id: 4, type: "class", title: "Writing 39B", startTime: "11:00 AM", endTime: "12:00 PM", day: d4.getDay(), date: d4, tutor: "Jennifer Lee", location: "Online", courseId: 4 },
    { id: 5, type: "class", title: "Biology Lab", startTime: "1:00 PM", endTime: "3:00 PM", day: d5.getDay(), date: d5, tutor: "Dr. Martinez", location: "UCI", courseId: 5 },
  ];
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem('sessions_v2');
    if (stored) {
      return JSON.parse(stored);
    }
    return getDefaultSessions();
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem('calendarEvents_v3');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
    return getDefaultCalendarEvents();
  });

  const [removedSessionIds, setRemovedSessionIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('removedSessions_v2');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('calendarEvents_v3', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('removedSessions_v2', JSON.stringify(removedSessionIds));
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

  const syncCanvasAssignments = useCallback((assignments: CanvasAssignment[]) => {
    // Remove existing Canvas assignment events first
    setCalendarEvents((prev) => {
      const nonAssignmentEvents = prev.filter((event) => event.type !== "assignment");

      // Preserve completed state from existing assignment events — keyed by event ID
      const existingCompletedMap = new Map(
        prev.filter(e => e.type === "assignment").map(e => [e.id, e.completed ?? false])
      );

      // Read ignored IDs from localStorage so re-sync doesn't re-add ignored assignments
      const storedIgnored = localStorage.getItem('ignoredAssignmentIds');
      const ignoredIds: Set<string> = storedIgnored ? new Set(JSON.parse(storedIgnored)) : new Set();
      
      // Convert Canvas assignments to calendar events
      const assignmentEvents: CalendarEvent[] = assignments
        .filter(a => !ignoredIds.has(String(10000 + a.id)))
        .map((assignment) => {
          // Create a new Date object to ensure we're working with the exact due date
          const dueDate = new Date(assignment.dueDate);
          const dayOfWeek = dueDate.getDay();
          
          // Format time from the assignment's due date
          const hours = dueDate.getHours();
          const minutes = dueDate.getMinutes();
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
          
          return {
            id: 10000 + assignment.id, // Use high IDs to avoid conflicts
            type: "assignment" as const,
            title: assignment.name,
            startTime: timeString,
            endTime: timeString,
            day: dayOfWeek,
            date: dueDate, // Use the exact due date from the assignment
            courseName: assignment.courseName,
            courseId: assignment.courseId,
            dueTime: timeString,
            color: `from-[${assignment.courseColor}] to-[${assignment.courseColor}]`,
            completed: existingCompletedMap.get(10000 + assignment.id) ?? false,
          };
        });

      // Add assignment events to calendar
      return [...nonAssignmentEvents, ...assignmentEvents];
    });
  }, []);

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
        syncCanvasAssignments,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    // More helpful error message for debugging
    console.error('useCalendar hook was called outside of CalendarProvider. This may be due to hot module reload. Please refresh the page.');
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}