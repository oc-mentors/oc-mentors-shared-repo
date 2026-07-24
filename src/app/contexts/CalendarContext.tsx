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
  courseId?: number;
  dueTime?: string;
  location?: string;
  completed?: boolean;
  /** True for events created by the user. */
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
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const SESSIONS_KEY = "sessions_v6";
const EVENTS_KEY = "calendarEvents_v6";
const REMOVED_KEY = "removedSessions_v6";
/** Bump this to force-clear stale browser bookings once (Chemistry/Daniyal leftover). */
const WIPE_FLAG = "oc_wipe_stale_bookings_v2";

const LEGACY_KEYS = [
  "sessions_v3",
  "sessions_v4",
  "sessions_v5",
  "calendarEvents_v4",
  "calendarEvents_v5",
  "removedSessions_v3",
  "removedSessions_v4",
  "removedSessions_v5",
];

function wipeLegacyBookingStorage(): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(WIPE_FLAG) === "1") return;
  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
  // Also clear current keys once so in-memory leftovers from a prior HMR can't stick
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(EVENTS_KEY);
  localStorage.removeItem(REMOVED_KEY);
  localStorage.setItem(WIPE_FLAG, "1");
}

/** Start of local calendar day for a session date string like "Jul 19, 2026". */
function sessionDayStart(dateStr: string): Date | null {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** True if the session is still today or in the future. */
export function isSessionUpcomingByDate(dateStr: string): boolean {
  const day = sessionDayStart(dateStr);
  if (!day) return false;
  return day.getTime() >= startOfToday().getTime();
}

function loadSessions(): Session[] {
  wipeLegacyBookingStorage();
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    if (!Array.isArray(parsed)) return [];
    const today = startOfToday();
    return parsed
      .filter((s) => !/daniyal/i.test(s.tutor || "") && !/daniyal/i.test(s.subject || ""))
      .map((s) => {
        const day = sessionDayStart(s.date);
        if (s.status === "upcoming" && day && day.getTime() < today.getTime()) {
          return { ...s, status: "completed" as const };
        }
        return s;
      });
  } catch {
    return [];
  }
}

function loadEvents(): CalendarEvent[] {
  wipeLegacyBookingStorage();
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }))
      .filter(
        (e: CalendarEvent) =>
          !/daniyal/i.test(e.tutor || "") && !/daniyal/i.test(e.title || "")
      );
  } catch {
    return [];
  }
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => loadEvents());
  const [removedSessionIds, setRemovedSessionIds] = useState<number[]>(() => {
    wipeLegacyBookingStorage();
    try {
      const stored = localStorage.getItem(REMOVED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Strip known stale demo bookings even if React kept old state across HMR
  useEffect(() => {
    setSessions((prev) => {
      const next = prev.filter(
        (s) => !/daniyal/i.test(s.tutor || "") && !/daniyal/i.test(s.subject || "")
      );
      return next.length === prev.length ? prev : next;
    });
    setCalendarEvents((prev) => {
      const next = prev.filter(
        (e) => !/daniyal/i.test(e.tutor || "") && !/daniyal/i.test(e.title || "")
      );
      return next.length === prev.length ? prev : next;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(REMOVED_KEY, JSON.stringify(removedSessionIds));
  }, [removedSessionIds]);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents((prev) => [...prev, event]);
  };

  const updateSession = (id: number, updates: Partial<Session>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const updateCalendarEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const removeCalendarEvent = (id: number) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addRemovedSessionId = (id: number) => {
    setRemovedSessionIds((prev) => [...prev, id]);
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
    console.error(
      "useCalendar hook was called outside of CalendarProvider. This may be due to hot module reload. Please refresh the page."
    );
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
