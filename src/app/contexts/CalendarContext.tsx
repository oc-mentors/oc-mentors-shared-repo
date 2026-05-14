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

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem("sessions_v3");
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem("calendarEvents_v4");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
    return [];
  });

  const [removedSessionIds, setRemovedSessionIds] = useState<number[]>(() => {
    const stored = localStorage.getItem("removedSessions_v3");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("sessions_v3", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("calendarEvents_v4", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("removedSessions_v3", JSON.stringify(removedSessionIds));
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