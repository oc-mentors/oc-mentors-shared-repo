/** Saved Zot Planner sections — localStorage per user. */

import type { WebsocMeeting, WebsocSection } from "./anteaterApi";

export type SavedZotSection = {
  id: string; // `${term}|${sectionCode}`
  term: string; // shortName e.g. "2025 Fall"
  year: string;
  quarter: string;
  deptCode: string;
  courseNumber: string;
  courseTitle: string;
  courseId: string;
  section: WebsocSection;
  savedAt: number;
};

const KEY_PREFIX = "zot_plan_v1_";

function key(uid: string) {
  return `${KEY_PREFIX}${uid || "anon"}`;
}

export function loadZotPlan(uid: string): SavedZotSection[] {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedZotSection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveZotPlan(uid: string, plan: SavedZotSection[]) {
  localStorage.setItem(key(uid), JSON.stringify(plan));
}

export function makeSavedSectionId(term: string, sectionCode: string) {
  return `${term}|${sectionCode}`;
}

export function addToZotPlan(uid: string, item: SavedZotSection): SavedZotSection[] {
  const prev = loadZotPlan(uid);
  if (prev.some((s) => s.id === item.id)) return prev;
  const next = [item, ...prev];
  saveZotPlan(uid, next);
  return next;
}

export function removeFromZotPlan(uid: string, id: string): SavedZotSection[] {
  const next = loadZotPlan(uid).filter((s) => s.id !== id);
  saveZotPlan(uid, next);
  return next;
}

export function isInZotPlan(uid: string, term: string, sectionCode: string): boolean {
  const id = makeSavedSectionId(term, sectionCode);
  return loadZotPlan(uid).some((s) => s.id === id);
}

export function totalUnits(plan: SavedZotSection[]): number {
  let sum = 0;
  for (const s of plan) {
    const u = parseFloat(s.section.units);
    if (!Number.isNaN(u)) sum += u;
  }
  return sum;
}

/** Expand UCI day strings like "MWF", "TuTh", "MTuWThF" into weekday indices (0=Sun … 6=Sat). */
export function parseUciDays(days: string): number[] {
  const tokens: string[] = [];
  let i = 0;
  const s = days.replace(/\s+/g, "");
  while (i < s.length) {
    if (s.startsWith("Th", i)) {
      tokens.push("Th");
      i += 2;
    } else if (s.startsWith("Tu", i)) {
      tokens.push("Tu");
      i += 2;
    } else if (s.startsWith("Sa", i)) {
      tokens.push("Sa");
      i += 2;
    } else if (s.startsWith("Su", i)) {
      tokens.push("Su");
      i += 2;
    } else {
      tokens.push(s[i]);
      i += 1;
    }
  }
  const map: Record<string, number> = {
    Su: 0,
    M: 1,
    Tu: 2,
    W: 3,
    Th: 4,
    F: 5,
    Sa: 6,
  };
  return tokens.map((t) => map[t]).filter((n) => n !== undefined);
}

function toMinutes(t: { hour: number; minute: number }) {
  return t.hour * 60 + t.minute;
}

type TimedBlock = { days: number[]; start: number; end: number; label: string };

function blocksFromMeetings(meetings: WebsocMeeting[], label: string): TimedBlock[] {
  const out: TimedBlock[] = [];
  for (const m of meetings) {
    if (m.timeIsTBA) continue;
    const days = parseUciDays(m.days);
    if (!days.length) continue;
    out.push({
      days,
      start: toMinutes(m.startTime),
      end: toMinutes(m.endTime),
      label,
    });
  }
  return out;
}

export type ScheduleConflict = {
  a: string;
  b: string;
  day: number;
};

/** Detect overlapping lecture/discussion times across saved sections. */
export function findScheduleConflicts(plan: SavedZotSection[]): ScheduleConflict[] {
  const blocks: TimedBlock[] = [];
  for (const s of plan) {
    const label = `${s.deptCode} ${s.courseNumber} (${s.section.sectionCode})`;
    blocks.push(...blocksFromMeetings(s.section.meetings, label));
  }
  const conflicts: ScheduleConflict[] = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const A = blocks[i];
      const B = blocks[j];
      for (const d of A.days) {
        if (!B.days.includes(d)) continue;
        if (A.start < B.end && B.start < A.end) {
          conflicts.push({ a: A.label, b: B.label, day: d });
        }
      }
    }
  }
  return conflicts;
}
