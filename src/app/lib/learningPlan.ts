/** Per-user daily learning plan stored locally (keyed by uid + date). */

export type PlanTask = {
  id: string;
  title: string;
  subject?: string;
  done: boolean;
};

export type DailyPlan = {
  date: string; // YYYY-MM-DD
  tasks: PlanTask[];
};

/** Session-shaped booking from CalendarContext */
export type PlanSessionLike = {
  id: number;
  subject: string;
  tutor: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
};

/** Calendar event-shaped item from CalendarContext */
export type PlanEventLike = {
  id: number;
  type: "class" | "study" | "assignment" | "tutor";
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  tutor?: string;
  location?: string;
  completed?: boolean;
};

export type SchedulePlanItem = {
  id: string;
  kind: "session" | "event";
  title: string;
  timeLabel: string;
  meta: string;
  done: boolean;
  /** For navigating / marking complete */
  sourceId: number;
};

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function storageKey(uid: string, date = todayKey()) {
  return `learning_plan_v1_${uid}_${date}`;
}

/** Match session date strings like "Jul 19, 2026" or "July 19, 2026" to today. */
export function isSessionDateToday(dateStr: string, now = new Date()): boolean {
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return (
      parsed.getFullYear() === now.getFullYear() &&
      parsed.getMonth() === now.getMonth() &&
      parsed.getDate() === now.getDate()
    );
  }
  // Fallback: compare formatted short / long month variants
  const short = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const long = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const normalized = dateStr.replace(/\s+/g, " ").trim();
  return normalized === short || normalized === long;
}

export function isCalendarDateToday(date: Date, now = new Date()): boolean {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const EVENT_TYPE_LABEL: Record<PlanEventLike["type"], string> = {
  class: "Class",
  study: "Study",
  assignment: "Deadline",
  tutor: "Tutor session",
};

/**
 * Build today's schedule items from booked sessions + calendar events.
 * Sessions that already have a matching calendar event (same title/time) are kept
 * as session items; other events appear separately.
 */
export function getTodayScheduleItems(
  sessions: PlanSessionLike[],
  events: PlanEventLike[],
  removedSessionIds: number[] = []
): SchedulePlanItem[] {
  const now = new Date();
  const items: SchedulePlanItem[] = [];

  const todaySessions = sessions.filter(
    (s) => !removedSessionIds.includes(s.id) && isSessionDateToday(s.date, now)
  );

  for (const s of todaySessions) {
    items.push({
      id: `session-${s.id}`,
      kind: "session",
      title: s.subject,
      timeLabel: s.time,
      meta: `Session with ${s.tutor}`,
      done: s.status === "completed",
      sourceId: s.id,
    });
  }

  const sessionKeys = new Set(
    todaySessions.map((s) => `${s.subject.trim().toLowerCase()}|${s.time.trim().toLowerCase()}`)
  );

  const todayEvents = events.filter((e) => isCalendarDateToday(e.date, now));
  for (const e of todayEvents) {
    const key = `${e.title.trim().toLowerCase()}|${e.startTime.trim().toLowerCase()}`;
    // Skip events that duplicate a booked session already listed
    if (sessionKeys.has(key)) continue;
    items.push({
      id: `event-${e.id}`,
      kind: "event",
      title: e.title,
      timeLabel: e.type === "assignment" ? e.startTime || "All day" : `${e.startTime}${e.endTime ? ` – ${e.endTime}` : ""}`,
      meta: e.tutor
        ? `${EVENT_TYPE_LABEL[e.type]} · ${e.tutor}`
        : e.location
          ? `${EVENT_TYPE_LABEL[e.type]} · ${e.location}`
          : EVENT_TYPE_LABEL[e.type],
      done: !!e.completed || (e.type === "assignment" && !!e.completed),
      sourceId: e.id,
    });
  }

  // Sort by time label loosely (AM/PM strings compare poorly; keep insertion order + sessions first)
  return items;
}

export function getTodayPlan(uid: string | undefined | null): DailyPlan | null {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyPlan;
    if (!parsed || parsed.date !== todayKey() || !Array.isArray(parsed.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTodayPlan(uid: string, plan: DailyPlan): void {
  localStorage.setItem(storageKey(uid, plan.date), JSON.stringify(plan));
  window.dispatchEvent(new CustomEvent("learningPlanChange", { detail: { uid } }));
}

export function createEmptyTodayPlan(): DailyPlan {
  return { date: todayKey(), tasks: [] };
}

export function combinedPlanProgress(
  plan: DailyPlan | null,
  scheduleItems: SchedulePlanItem[]
): {
  percent: number;
  done: number;
  total: number;
  nextLabel: string | null;
} {
  const tasks = plan?.tasks ?? [];
  const allDoneFlags = [
    ...tasks.map((t) => ({ done: t.done, label: t.title })),
    ...scheduleItems.map((s) => ({ done: s.done, label: s.title })),
  ];
  const total = allDoneFlags.length;
  if (total === 0) {
    return { percent: 0, done: 0, total: 0, nextLabel: null };
  }
  const done = allDoneFlags.filter((x) => x.done).length;
  const percent = Math.round((done / total) * 100);
  const nextLabel = allDoneFlags.find((x) => !x.done)?.label ?? null;
  return { percent, done, total, nextLabel };
}

/** @deprecated prefer combinedPlanProgress when schedule is included */
export function planProgress(plan: DailyPlan | null): {
  percent: number;
  done: number;
  total: number;
  nextTask: PlanTask | null;
} {
  if (!plan || plan.tasks.length === 0) {
    return { percent: 0, done: 0, total: 0, nextTask: null };
  }
  const done = plan.tasks.filter((t) => t.done).length;
  const total = plan.tasks.length;
  const percent = Math.round((done / total) * 100);
  const nextTask = plan.tasks.find((t) => !t.done) ?? null;
  return { percent, done, total, nextTask };
}

export function newTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
