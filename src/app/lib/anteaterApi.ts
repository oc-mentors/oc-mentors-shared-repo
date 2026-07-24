/** Anteater API (ICSSC) — https://anteaterapi.com/v2/rest */
import { Capacitor, CapacitorHttp } from "@capacitor/core";

export const ANTEATER_BASE = "https://anteaterapi.com/v2/rest";

function getApiKey(): string | null {
  const key = import.meta.env.VITE_ANTEATER_API_KEY as string | undefined;
  return key?.trim() || null;
}

export type AnteaterOk<T> = { ok: true; data: T };
export type AnteaterErr = { ok: false; message?: string };
export type AnteaterResponse<T> = AnteaterOk<T> | AnteaterErr;

export type WebsocTerm = { shortName: string; longName: string };
export type WebsocDepartment = { deptCode: string; deptName: string };

export type WeekInfo = {
  weeks: number[];
  quarters: string[];
  display: string;
};

export type AcademicCalendar = {
  year: string;
  quarter: string;
  instructionStart: string;
  instructionEnd: string;
  finalsStart: string;
  finalsEnd: string;
  socAvailable: string;
};

export type MeetingTime = { hour: number; minute: number };

export type WebsocMeeting =
  | { timeIsTBA: true }
  | {
      timeIsTBA: false;
      bldg: string[];
      days: string;
      startTime: MeetingTime;
      endTime: MeetingTime;
    };

export type WebsocFinalExam =
  | { examStatus: "NO_FINAL" }
  | { examStatus: "TBA_FINAL" }
  | {
      examStatus: "SCHEDULED_FINAL";
      dayOfWeek: string;
      month: number;
      day: number;
      startTime: MeetingTime;
      endTime: MeetingTime;
      bldg: string[];
    };

export type WebsocSection = {
  units: string;
  status: string;
  meetings: WebsocMeeting[];
  finalExam: WebsocFinalExam;
  sectionNum: string;
  instructors: string[];
  maxCapacity: string;
  sectionCode: string;
  sectionType: string;
  numRequested: string;
  restrictions: string;
  numOnWaitlist: string;
  numWaitlistCap: string;
  sectionComment: string;
  numNewOnlyReserved: string;
  numCurrentlyEnrolled: { totalEnrolled: string; sectionEnrolled: string };
  isCancelled?: boolean;
  updatedAt?: string | null;
  webURL?: string;
};

export type WebsocCourse = {
  deptCode: string;
  courseTitle: string;
  courseNumber: string;
  courseId: string;
  courseComment?: string;
  prerequisiteLink?: string;
  sections: WebsocSection[];
  updatedAt?: string | null;
};

export type CatalogCourse = {
  id: string;
  department: string;
  courseNumber: string;
  courseNumeric: number;
  school: string;
  title: string;
  courseLevel: string;
  minUnits: number;
  maxUnits: number;
  description: string;
  departmentName: string;
  prerequisiteText?: string;
  instructors?: { name: string; ucinetid: string; title: string }[];
  geList?: string[];
};

export type GradeAggregate = {
  gradeACount: number;
  gradeBCount: number;
  gradeCCount: number;
  gradeDCount: number;
  gradeFCount: number;
  gradePCount: number;
  gradeNPCount: number;
  gradeWCount: number;
  averageGPA: number | null;
  department: string;
  courseNumber: string;
  instructor?: string;
};

export type SearchCourseHit = {
  type: "course";
  result: CatalogCourse;
};

const META_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const memoryCache = new Map<string, { expires: number; data: unknown }>();

function cacheKey(path: string, params?: Record<string, string | number | undefined | null>) {
  if (!params) return path;
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return q ? `${path}?${q}` : path;
}

function readCache<T>(key: string): T | null {
  const mem = memoryCache.get(key);
  if (mem && mem.expires > Date.now()) return mem.data as T;
  try {
    const raw = sessionStorage.getItem(`anteater_cache_v1:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expires: number; data: T };
    if (!parsed?.expires || parsed.expires < Date.now()) return null;
    memoryCache.set(key, parsed);
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T, ttlMs = META_CACHE_TTL_MS) {
  const entry = { expires: Date.now() + ttlMs, data };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(`anteater_cache_v1:${key}`, JSON.stringify(entry));
  } catch {
    /* quota / private mode */
  }
}

async function anteaterGet<T>(
  path: string,
  params?: Record<string, string | number | undefined | null>,
  opts?: { requireKey?: boolean; cacheTtlMs?: number }
): Promise<T> {
  const key = cacheKey(path, params);
  if (opts?.cacheTtlMs !== 0) {
    const cached = readCache<T>(key);
    if (cached !== null) return cached;
  }

  const url = new URL(`${ANTEATER_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  const keyAuth = getApiKey();
  if (keyAuth) headers.Authorization = `Bearer ${keyAuth}`;
  else if (opts?.requireKey) {
    throw new Error("Search needs VITE_ANTEATER_API_KEY in .env.local");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);

  let json: AnteaterResponse<T>;

  try {
    if (Capacitor.isNativePlatform()) {
      const res = await CapacitorHttp.get({ url: url.toString(), headers });
      json = res.data as AnteaterResponse<T>;
      if (res.status >= 400) {
        const msg =
          json && typeof json === "object" && "message" in json
            ? String((json as AnteaterErr).message)
            : `HTTP ${res.status}`;
        throw new Error(msg);
      }
    } else {
      const res = await fetch(url.toString(), { headers, signal: controller.signal });
      json = (await res.json()) as AnteaterResponse<T>;
      if (!res.ok || !json?.ok) {
        throw new Error(
          (json && "message" in json && json.message) || `HTTP ${res.status}`
        );
      }
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Anteater API timed out — try again");
    }
    throw e;
  } finally {
    window.clearTimeout(timeout);
  }

  if (!json || typeof json !== "object" || !("ok" in json) || !json.ok) {
    throw new Error(
      (json && "message" in json && (json as AnteaterErr).message) || "Anteater API error"
    );
  }

  if (opts?.cacheTtlMs !== 0) {
    // Don't cache empty WebSoc payloads — avoids sticky "no sections" after bad queries
    const emptyWebsoc =
      path === "/websoc" &&
      json.data &&
      typeof json.data === "object" &&
      Array.isArray((json.data as { schools?: unknown }).schools) &&
      (json.data as { schools: unknown[] }).schools.length === 0;
    const emptyArray = Array.isArray(json.data) && json.data.length === 0;
    if (!emptyWebsoc && !emptyArray) {
      writeCache(key, json.data, opts?.cacheTtlMs ?? META_CACHE_TTL_MS);
    }
  }
  return json.data;
}

/** Parse WebSoc term shortName like "2025 Fall" → { year, quarter }. */
export function parseTermShortName(shortName: string): { year: string; quarter: string } | null {
  const m = shortName.trim().match(/^(\d{4})\s+(.+)$/);
  if (!m) return null;
  return { year: m[1], quarter: m[2] };
}

export function formatMeetingTime(t: MeetingTime): string {
  const period = t.hour >= 12 ? "PM" : "AM";
  const h = t.hour % 12 || 12;
  return `${h}:${String(t.minute).padStart(2, "0")} ${period}`;
}

export function formatMeeting(m: WebsocMeeting): string {
  if (m.timeIsTBA) return "TBA";
  const loc = m.bldg?.length ? m.bldg.join(", ") : "";
  return `${m.days} ${formatMeetingTime(m.startTime)}–${formatMeetingTime(m.endTime)}${loc ? ` · ${loc}` : ""}`;
}

export function flattenWebsocCourses(
  data: { schools: { departments: { courses: WebsocCourse[] }[] }[] } | null | undefined
): WebsocCourse[] {
  if (!data?.schools) return [];
  const out: WebsocCourse[] = [];
  for (const school of data.schools) {
    for (const dept of school.departments ?? []) {
      for (const course of dept.courses ?? []) out.push(course);
    }
  }
  return out;
}

export const anteaterApi = {
  hasApiKey: () => !!getApiKey(),

  ping: () => anteaterGet<string>("/ping", undefined, { cacheTtlMs: 0 }),

  week: () => anteaterGet<WeekInfo>("/week", undefined, { cacheTtlMs: 30 * 60 * 1000 }),

  terms: () => anteaterGet<WebsocTerm[]>("/websoc/terms"),

  departments: () => anteaterGet<WebsocDepartment[]>("/websoc/departments"),

  calendar: (year: string, quarter: string) =>
    anteaterGet<AcademicCalendar>("/calendar", { year, quarter }),

  websoc: (params: {
    year: string;
    quarter: string;
    department?: string;
    courseNumber?: string;
    courseTitle?: string;
    instructorName?: string;
    sectionCodes?: string;
    ge?: string;
    division?: string;
    sectionType?: string;
    fullCourses?: string;
  }) =>
    anteaterGet<{ schools: { departments: { courses: WebsocCourse[] }[] }[] }>(
      "/websoc",
      params,
      { cacheTtlMs: 5 * 60 * 1000 }
    ),

  courses: (params: {
    department?: string;
    courseNumber?: string;
    titleContains?: string;
    take?: number;
    skip?: number;
  }) => anteaterGet<CatalogCourse[]>("/courses", params, { cacheTtlMs: 30 * 60 * 1000 }),

  courseById: (id: string) =>
    anteaterGet<CatalogCourse>(`/courses/${encodeURIComponent(id)}`, undefined, {
      cacheTtlMs: 30 * 60 * 1000,
    }),

  gradesByCourse: (params: { department: string; courseNumber: string; instructor?: string }) =>
    anteaterGet<GradeAggregate[]>("/grades/aggregateByCourse", params, {
      cacheTtlMs: 60 * 60 * 1000,
    }),

  gradesByOffering: (params: {
    department: string;
    courseNumber: string;
    instructor?: string;
  }) =>
    anteaterGet<GradeAggregate[]>("/grades/aggregateByOffering", params, {
      cacheTtlMs: 60 * 60 * 1000,
    }),

  search: (query: string, take = 20) =>
    anteaterGet<{ count: number; results: SearchCourseHit[] }>(
      "/search",
      { query, take, resultType: "course" },
      { requireKey: true, cacheTtlMs: 10 * 60 * 1000 }
    ),
};
