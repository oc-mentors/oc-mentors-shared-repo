import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  BookOpen,
  CalendarPlus,
  Check,
  ChevronDown,
  Loader2,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCalendar } from "../contexts/CalendarContext";
import {
  anteaterApi,
  flattenWebsocCourses,
  formatMeeting,
  formatMeetingTime,
  parseTermShortName,
  type AcademicCalendar,
  type CatalogCourse,
  type GradeAggregate,
  type WebsocCourse,
  type WebsocDepartment,
  type WebsocSection,
  type WebsocTerm,
  type WeekInfo,
} from "../lib/anteaterApi";
import {
  addToZotPlan,
  findScheduleConflicts,
  loadZotPlan,
  makeSavedSectionId,
  parseUciDays,
  removeFromZotPlan,
  totalUnits,
  type SavedZotSection,
} from "../lib/zotPlanStorage";
import { resolveCourseSearch } from "../lib/zotCourseQuery";

type TabId = "browse" | "plan" | "grades";
type SchoolId = "uci";

const SCHOOLS: { id: SchoolId; label: string; short: string }[] = [
  { id: "uci", label: "UC Irvine", short: "UCI" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function statusColor(status: string, colors: { textSecondary: string }) {
  const s = status.toUpperCase();
  if (s === "OPEN") return "#16a34a";
  if (s === "WAITL" || s === "WAITLIST") return "#d97706";
  if (s === "FULL" || s === "NEWONLY") return "#dc2626";
  return colors.textSecondary;
}

function gradeTotal(g: GradeAggregate) {
  return (
    g.gradeACount +
    g.gradeBCount +
    g.gradeCCount +
    g.gradeDCount +
    g.gradeFCount +
    g.gradePCount +
    g.gradeNPCount +
    g.gradeWCount
  );
}

export default function ZotPlannerPage() {
  const { colors, accentColor, mode } = useTheme();
  const { user } = useAuth();
  const { addCalendarEvent } = useCalendar();
  const uid = user?.id || "anon";

  const [tab, setTab] = useState<TabId>("browse");
  const [school, setSchool] = useState<SchoolId>("uci");
  const [week, setWeek] = useState<WeekInfo | null>(null);
  const [terms, setTerms] = useState<WebsocTerm[]>([]);
  const [departments, setDepartments] = useState<WebsocDepartment[]>([]);
  const [term, setTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");

  const [courses, setCourses] = useState<WebsocCourse[]>([]);
  const [catalogHits, setCatalogHits] = useState<CatalogCourse[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [plan, setPlan] = useState<SavedZotSection[]>(() => loadZotPlan(uid));
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [detailCourse, setDetailCourse] = useState<CatalogCourse | null>(null);
  const [grades, setGrades] = useState<GradeAggregate[]>([]);
  const [offeringGrades, setOfferingGrades] = useState<GradeAggregate[]>([]);
  const [gradesTarget, setGradesTarget] = useState<{ dept: string; num: string; title: string } | null>(
    null
  );
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [calendarInfo, setCalendarInfo] = useState<AcademicCalendar | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    setPlan(loadZotPlan(uid));
  }, [uid]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingMeta(true);
      setLoadingDepts(true);
      setError(null);
      try {
        // Terms + week first so the UI unlocks quickly; departments can lag.
        const [w, t] = await Promise.all([
          anteaterApi.week().catch(() => null),
          anteaterApi.terms(),
        ]);
        if (cancelled) return;
        setWeek(w);
        setTerms(t);
        const prefer =
          w?.quarters?.[0] &&
          t.find(
            (termItem) =>
              termItem.longName.includes(w.quarters[0]) ||
              w.quarters[0].includes(termItem.shortName.replace(/^\d{4}\s+/, ""))
          );
        setTerm(prefer?.shortName || t[0]?.shortName || "");
        setLoadingMeta(false);

        const d = await anteaterApi.departments();
        if (cancelled) return;
        setDepartments(d);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load Anteater data");
        if (!cancelled) setLoadingMeta(false);
      } finally {
        if (!cancelled) setLoadingDepts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const parsed = parseTermShortName(term);
    if (!parsed) {
      setCalendarInfo(null);
      return;
    }
    let cancelled = false;
    anteaterApi
      .calendar(parsed.year, parsed.quarter)
      .then((c) => {
        if (!cancelled) setCalendarInfo(c);
      })
      .catch(() => {
        if (!cancelled) setCalendarInfo(null);
      });
    return () => {
      cancelled = true;
    };
  }, [term]);

  const runWebsocSearch = useCallback(async () => {
    const parsed = parseTermShortName(term);
    if (!parsed) {
      setError("Pick a term first");
      return;
    }
    if (!department && !courseNumber.trim() && !instructorFilter.trim() && !searchQuery.trim()) {
      setError("Enter a course like “ics 31” or pick a department + number");
      return;
    }

    const resolved = resolveCourseSearch({
      department,
      courseNumber,
      searchQuery,
      instructorFilter,
      departments,
    });

    if (!resolved.attempts.length) {
      // Instructor-only search is allowed
      if (resolved.instructorName) {
        setLoadingCourses(true);
        setError(null);
        try {
          const data = await anteaterApi.websoc({
            year: parsed.year,
            quarter: parsed.quarter,
            department: department || undefined,
            instructorName: resolved.instructorName,
          });
          const flat = flattenWebsocCourses(data);
          setCourses(flat);
          if (!flat.length) setError("No sections found for that instructor");
        } catch (e) {
          setCourses([]);
          setError(e instanceof Error ? e.message : "Search failed");
        } finally {
          setLoadingCourses(false);
        }
        return;
      }
      setError(
        resolved.note ||
          "Couldn’t understand that course. Try “ics 31”, “I&C SCI 31”, or “cs 161”."
      );
      return;
    }

    // Reflect best match in the form
    const best = resolved.attempts[0];
    setDepartment(best.department);
    setCourseNumber(best.courseNumber);

    setLoadingCourses(true);
    setError(null);
    setCatalogHits([]);
    try {
      let found: ReturnType<typeof flattenWebsocCourses> = [];
      let used = best;

      for (const attempt of resolved.attempts) {
        try {
          const data = await anteaterApi.websoc({
            year: parsed.year,
            quarter: parsed.quarter,
            department: attempt.department,
            courseNumber: attempt.courseNumber,
            instructorName: resolved.instructorName,
          });
          const flat = flattenWebsocCourses(data);
          if (flat.length) {
            found = flat;
            used = attempt;
            break;
          }
        } catch {
          /* try next dept variant */
        }
      }

      // Catalogue fallback: resolve official dept/number then re-query WebSoc
      if (!found.length) {
        for (const attempt of resolved.attempts.slice(0, 4)) {
          try {
            const catalog = await anteaterApi.courses({
              department: attempt.department,
              courseNumber: attempt.courseNumber,
              take: 8,
            });
            if (catalog.length) setCatalogHits(catalog);
            for (const c of catalog.slice(0, 4)) {
              const data = await anteaterApi.websoc({
                year: parsed.year,
                quarter: parsed.quarter,
                department: c.department,
                courseNumber: c.courseNumber,
              });
              const flat = flattenWebsocCourses(data);
              if (flat.length) {
                found = flat;
                used = {
                  department: c.department,
                  courseNumber: c.courseNumber,
                  label: `catalogue ${c.department} ${c.courseNumber}`,
                };
                break;
              }
            }
            if (found.length) break;
          } catch {
            /* next */
          }
        }
      }

      setCourses(found);
      if (!found.length) {
        setError(
          `No sections for ${resolved.attempts.map((a) => `${a.department} ${a.courseNumber}`).join(" / ")} in ${term}. Try another term.`
        );
      } else {
        setDepartment(used.department);
        setCourseNumber(used.courseNumber);
        if (resolved.note || used.department !== department) {
          showToast(`Showing ${used.department} ${used.courseNumber}`);
        }
      }
    } catch (e) {
      setCourses([]);
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoadingCourses(false);
    }
  }, [term, department, courseNumber, instructorFilter, searchQuery, departments]);

  const loadCatalogFallback = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoadingCourses(true);
    setError(null);
    try {
      const hits = await anteaterApi.courses({
        titleContains: searchQuery.trim(),
        take: 20,
      });
      setCatalogHits(hits);
      setCourses([]);
      if (!hits.length) setError("No catalogue matches");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Catalogue search failed");
    } finally {
      setLoadingCourses(false);
    }
  }, [searchQuery]);

  const openGrades = async (dept: string, num: string, title: string) => {
    setGradesTarget({ dept, num, title });
    setTab("grades");
    setLoadingGrades(true);
    setGrades([]);
    setOfferingGrades([]);
    try {
      const [byCourse, byOffering] = await Promise.all([
        anteaterApi.gradesByCourse({ department: dept, courseNumber: num }),
        anteaterApi.gradesByOffering({ department: dept, courseNumber: num }),
      ]);
      setGrades(byCourse);
      setOfferingGrades(byOffering.slice(0, 12));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load grades");
    } finally {
      setLoadingGrades(false);
    }
  };

  const loadCourseDetail = async (dept: string, num: string) => {
    try {
      const list = await anteaterApi.courses({ department: dept, courseNumber: num, take: 1 });
      setDetailCourse(list[0] || null);
    } catch {
      setDetailCourse(null);
    }
  };

  const saveSection = (course: WebsocCourse, section: WebsocSection) => {
    const parsed = parseTermShortName(term);
    if (!parsed) return;
    const item: SavedZotSection = {
      id: makeSavedSectionId(term, section.sectionCode),
      term,
      year: parsed.year,
      quarter: parsed.quarter,
      deptCode: course.deptCode,
      courseNumber: course.courseNumber,
      courseTitle: course.courseTitle,
      courseId: course.courseId,
      section,
      savedAt: Date.now(),
    };
    const next = addToZotPlan(uid, item);
    setPlan(next);
    showToast(`Saved ${course.deptCode} ${course.courseNumber} · ${section.sectionCode}`);
  };

  const removeSection = (id: string) => {
    setPlan(removeFromZotPlan(uid, id));
    showToast("Removed from plan");
  };

  const addSectionToCalendar = (item: SavedZotSection) => {
    const start = calendarInfo?.instructionStart
      ? new Date(calendarInfo.instructionStart + "T12:00:00")
      : new Date();
    const end = calendarInfo?.instructionEnd
      ? new Date(calendarInfo.instructionEnd + "T12:00:00")
      : new Date(start.getTime() + 10 * 7 * 24 * 60 * 60 * 1000);

    let added = 0;
    let idBase = Date.now();
    for (const m of item.section.meetings) {
      if (m.timeIsTBA) continue;
      const days = parseUciDays(m.days);
      const startLabel = formatMeetingTime(m.startTime);
      const endLabel = formatMeetingTime(m.endTime);
      const loc = m.bldg?.join(", ") || undefined;
      const cursor = new Date(start);
      while (cursor <= end) {
        if (days.includes(cursor.getDay())) {
          const eventDate = new Date(cursor);
          addCalendarEvent({
            id: idBase++,
            type: "class",
            title: `${item.deptCode} ${item.courseNumber} ${item.section.sectionType}`,
            startTime: startLabel,
            endTime: endLabel,
            day: eventDate.getDay(),
            date: eventDate,
            location: loc,
            courseName: `${item.deptCode} ${item.courseNumber}`,
            color: "from-[#0284c7] to-[#0369a1]",
            isUserCreated: true,
          });
          added++;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    showToast(added ? `Added ${added} class meetings to Schedule` : "No timed meetings to add");
  };

  const conflicts = useMemo(() => findScheduleConflicts(plan), [plan]);
  const units = useMemo(() => totalUnits(plan), [plan]);
  const savedIds = useMemo(() => new Set(plan.map((p) => p.id)), [plan]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "browse", label: "Browse" },
    { id: "plan", label: `My Plan (${plan.length})` },
    { id: "grades", label: "Grades" },
  ];

  const onFg = mode === "dark" ? "white" : "black";
  const onFgMuted = mode === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)";

  return (
    <div
      className="min-h-screen overflow-auto pb-24"
      style={{ backgroundColor: colors.bgPrimary }}
      data-testid="course-planner-screen"
      id="course-planner-screen"
      aria-label="Course Planner"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-3"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accentColor.primary}, ${accentColor.icon})` }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: onFg }} />
            </div>
            <div>
              <h1 className="text-[28px] font-bold leading-tight" style={{ color: colors.textPrimary }}>
                Course Planner
              </h1>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: colors.textTertiary }}>
                Plan your schedule
              </p>
            </div>
          </div>

          <label className="block">
            <span
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: colors.textTertiary }}
            >
              School
            </span>
            <div className="relative mt-1">
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value as SchoolId)}
                aria-label="School"
                data-testid="zot-school-select"
                id="zot-school-select"
                className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-9"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderPrimary}`,
                }}
              >
                {SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.short})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: colors.textTertiary }}
              />
            </div>
          </label>
        </motion.div>

        {/* Week banner */}
        {week && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-4 rounded-2xl px-4 py-3"
            style={{
              background: `linear-gradient(135deg, ${accentColor.primary}22, ${accentColor.icon}18)`,
              border: `1px solid ${colors.borderPrimary}`,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              {week.display}
            </p>
            {calendarInfo && (
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Instruction {calendarInfo.instructionStart} → {calendarInfo.instructionEnd} · Finals{" "}
                {calendarInfo.finalsStart}–{calendarInfo.finalsEnd}
              </p>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="px-6 mb-4 flex gap-2">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-label={t.id === "browse" ? "Browse" : "My Plan"}
              className="flex-1 rounded-xl py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: active ? accentColor.primary : colors.bgTertiary,
                color: active ? onFg : colors.textSecondary,
              }}
            >
                {t.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div
            className="mx-6 mb-3 rounded-xl px-3 py-2 text-sm flex items-start gap-2"
            style={{ backgroundColor: "#fef2f2", color: "#991b1b" }}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loadingMeta ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: accentColor.primary }} />
          </div>
        ) : (
          <>
            {tab === "browse" && (
              <div className="px-6 space-y-4">
                {/* Filters */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                      Term
                    </span>
                    <div className="relative mt-1">
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-9"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      >
                        {terms.slice(0, 24).map((t) => (
                          <option key={t.shortName} value={t.shortName}>
                            {t.longName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: colors.textTertiary }}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                      Department {loadingDepts ? "(loading…)" : ""}
                    </span>
                    <div className="relative mt-1">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={loadingDepts && departments.length === 0}
                        className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-9"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      >
                        <option value="">Any / search only</option>
                        {departments.map((d) => (
                          <option key={d.deptCode} value={d.deptCode}>
                            {d.deptCode} — {d.deptName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: colors.textTertiary }}
                      />
                    </div>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                        Course #
                      </span>
                      <input
                        value={courseNumber}
                        onChange={(e) => setCourseNumber(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void runWebsocSearch();
                          }
                        }}
                        placeholder="ics 31, cs 161, bio 93…"
                        aria-label="Course number"
                        className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      />
                      <p className="text-[10px] mt-1" style={{ color: colors.textTertiary }}>
                        Nicknames work: ics → I&amp;C SCI, cs → COMPSCI, bio → BIO SCI
                      </p>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                        Instructor
                      </span>
                      <input
                        value={instructorFilter}
                        onChange={(e) => setInstructorFilter(e.target.value)}
                        placeholder="Last name"
                        className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                      Title search {anteaterApi.hasApiKey() ? "" : "(catalogue)"}
                    </span>
                    <div className="mt-1 flex gap-2">
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ics 31, writing 39C…"
                        aria-label="Course search"
                        className="flex-1 rounded-xl px-3 py-2.5 text-sm"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (department || courseNumber || instructorFilter) runWebsocSearch();
                            else loadCatalogFallback();
                          }
                        }}
                      />
                    </div>
                  </label>

                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={runWebsocSearch}
                      disabled={loadingCourses}
                      aria-label="Search courses"
                      className="flex-1 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
                      style={{ backgroundColor: accentColor.primary, color: onFg }}
                    >
                      {loadingCourses ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      WebSoc sections
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={loadCatalogFallback}
                      disabled={loadingCourses || !searchQuery.trim()}
                      className="rounded-xl px-3 py-3 text-sm font-semibold"
                      style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                      title="Search catalogue by title"
                    >
                      <BookOpen className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Catalogue hits */}
                {catalogHits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
                      Catalogue matches
                    </p>
                    {catalogHits.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setDepartment(c.department);
                          setCourseNumber(c.courseNumber);
                          setDetailCourse(c);
                          showToast(`Filled ${c.department} ${c.courseNumber}`);
                        }}
                        className="w-full text-left rounded-2xl px-4 py-3"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      >
                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          {c.department} {c.courseNumber}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                          {c.title}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {detailCourse && (
                  <div
                    className="rounded-2xl px-4 py-3 space-y-2"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.borderPrimary}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                          {detailCourse.department} {detailCourse.courseNumber} · {detailCourse.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                          {detailCourse.minUnits}
                          {detailCourse.maxUnits !== detailCourse.minUnits
                            ? `–${detailCourse.maxUnits}`
                            : ""}{" "}
                          units · {detailCourse.courseLevel}
                        </p>
                      </div>
                      <button type="button" onClick={() => setDetailCourse(null)}>
                        <X className="w-4 h-4" style={{ color: colors.textTertiary }} />
                      </button>
                    </div>
                    {detailCourse.description && (
                      <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                        {detailCourse.description}
                      </p>
                    )}
                    {detailCourse.prerequisiteText && (
                      <p className="text-xs" style={{ color: colors.textTertiary }}>
                        Prereqs: {detailCourse.prerequisiteText}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        openGrades(detailCourse.department, detailCourse.courseNumber, detailCourse.title)
                      }
                      className="text-xs font-semibold"
                      style={{ color: accentColor.primary }}
                    >
                      View grade history →
                    </button>
                  </div>
                )}

                {/* WebSoc results */}
                <div className="space-y-3 pb-4">
                  {courses.map((course) => {
                    const key = course.courseId || `${course.deptCode}${course.courseNumber}`;
                    const open = expandedCourse === key;
                    return (
                      <div
                        key={key}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          border: `1px solid ${colors.borderPrimary}`,
                        }}
                      >
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 flex items-center justify-between gap-2"
                          aria-label={`Course ${course.deptCode} ${course.courseNumber}`}
                          onClick={() => {
                            setExpandedCourse(open ? null : key);
                            if (!open) loadCourseDetail(course.deptCode, course.courseNumber);
                          }}
                        >
                          <div>
                            <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                              {course.deptCode} {course.courseNumber}
                            </p>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>
                              {course.courseTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium" style={{ color: colors.textTertiary }}>
                              {course.sections.length} sec
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                              style={{ color: colors.textTertiary }}
                            />
                          </div>
                        </button>

                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-3 pb-3 space-y-2 border-t"
                                style={{ borderColor: colors.borderPrimary }}
                              >
                                <div className="flex gap-3 pt-2 px-1">
                                  <button
                                    type="button"
                                    className="text-[11px] font-semibold"
                                    style={{ color: accentColor.primary }}
                                    onClick={() =>
                                      openGrades(course.deptCode, course.courseNumber, course.courseTitle)
                                    }
                                  >
                                    Grades
                                  </button>
                                  <button
                                    type="button"
                                    className="text-[11px] font-semibold"
                                    style={{ color: accentColor.primary }}
                                    onClick={() => loadCourseDetail(course.deptCode, course.courseNumber)}
                                  >
                                    Catalogue
                                  </button>
                                </div>
                                {course.sections.map((sec) => {
                                  const sid = makeSavedSectionId(term, sec.sectionCode);
                                  const saved = savedIds.has(sid);
                                  return (
                                    <div
                                      key={sec.sectionCode}
                                      className="rounded-xl px-3 py-2.5"
                                      style={{ backgroundColor: colors.bgTertiary }}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <p className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                                            {sec.sectionType} {sec.sectionNum} · {sec.sectionCode}
                                          </p>
                                          <p
                                            className="text-[11px] font-semibold mt-0.5"
                                            style={{ color: statusColor(sec.status, colors) }}
                                          >
                                            {sec.status || "—"}
                                            {sec.isCancelled ? " · CANCELLED" : ""} · {sec.units} units
                                          </p>
                                        </div>
                                        <motion.button
                                          type="button"
                                          whileTap={{ scale: 0.9 }}
                                          disabled={saved}
                                          onClick={() => saveSection(course, sec)}
                                          aria-label={saved ? "Already in plan" : "Add to plan"}
                                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                          style={{
                                            backgroundColor: saved ? colors.bgSecondary : accentColor.primary,
                                            color: saved ? colors.textTertiary : onFg,
                                          }}
                                        >
                                          {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </motion.button>
                                      </div>
                                      <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>
                                        {sec.instructors?.join(", ") || "Staff"}
                                      </p>
                                      <p className="text-[11px] mt-0.5" style={{ color: colors.textTertiary }}>
                                        {sec.meetings.map(formatMeeting).join(" · ") || "No meeting info"}
                                      </p>
                                      <p className="text-[10px] mt-1" style={{ color: colors.textTertiary }}>
                                        Enrolled {sec.numCurrentlyEnrolled?.totalEnrolled ?? "?"}/
                                        {sec.maxCapacity}
                                        {sec.numOnWaitlist && Number(sec.numOnWaitlist) > 0
                                          ? ` · Waitlist ${sec.numOnWaitlist}/${sec.numWaitlistCap}`
                                          : ""}
                                      </p>
                                      {sec.finalExam && sec.finalExam.examStatus === "SCHEDULED_FINAL" && (
                                        <p className="text-[10px] mt-1" style={{ color: colors.textSecondary }}>
                                          Final: {sec.finalExam.dayOfWeek} {sec.finalExam.month}/{sec.finalExam.day}{" "}
                                          {formatMeetingTime(sec.finalExam.startTime)}–
                                          {formatMeetingTime(sec.finalExam.endTime)}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "plan" && (
              <div className="px-6 space-y-4 pb-4">
                <div
                  className="rounded-2xl px-4 py-3 flex items-center justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor.primary}, ${accentColor.icon})`,
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: onFg }}>
                      {plan.length} section{plan.length === 1 ? "" : "s"}
                    </p>
                    <p className="text-xs" style={{ color: onFgMuted }}>
                      ~{units} units
                    </p>
                  </div>
                  <RefreshCw
                    className="w-4 h-4 cursor-pointer"
                    style={{ color: onFg }}
                    onClick={() => setPlan(loadZotPlan(uid))}
                  />
                </div>

                {conflicts.length > 0 && (
                  <div className="rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}>
                    <p className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Time conflicts
                    </p>
                    {conflicts.slice(0, 4).map((c, i) => (
                      <p key={i} className="text-xs mt-1">
                        {c.a} ↔ {c.b} on {DAY_NAMES[c.day]}
                      </p>
                    ))}
                  </div>
                )}

                {plan.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: colors.textSecondary }}>
                    No sections yet — browse WebSoc and tap + to save.
                  </p>
                ) : (
                  plan.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl px-4 py-3 space-y-2"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        border: `1px solid ${colors.borderPrimary}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                            {item.deptCode} {item.courseNumber}
                          </p>
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {item.courseTitle}
                          </p>
                          <p className="text-[11px] mt-1" style={{ color: colors.textTertiary }}>
                            {item.section.sectionType} {item.section.sectionNum} · {item.section.sectionCode} ·{" "}
                            {item.term}
                          </p>
                        </div>
                        <button type="button" onClick={() => removeSection(item.id)} aria-label="Remove">
                          <Trash2 className="w-4 h-4" style={{ color: "#dc2626" }} />
                        </button>
                      </div>
                      <p className="text-[11px]" style={{ color: colors.textSecondary }}>
                        {item.section.instructors?.join(", ") || "Staff"}
                      </p>
                      <p className="text-[11px]" style={{ color: colors.textTertiary }}>
                        {item.section.meetings.map(formatMeeting).join(" · ")}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => addSectionToCalendar(item)}
                          className="flex-1 rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                          style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          Add to Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => openGrades(item.deptCode, item.courseNumber, item.courseTitle)}
                          className="rounded-xl px-3 py-2 text-xs font-semibold"
                          style={{ backgroundColor: colors.bgTertiary, color: accentColor.primary }}
                        >
                          Grades
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "grades" && (
              <div className="px-6 space-y-4 pb-4">
                {!gradesTarget ? (
                  <p className="text-sm text-center py-10" style={{ color: colors.textSecondary }}>
                    Open grades from a course in Browse or My Plan.
                  </p>
                ) : loadingGrades ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-7 h-7 animate-spin" style={{ color: accentColor.primary }} />
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                        {gradesTarget.dept} {gradesTarget.num}
                      </h2>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {gradesTarget.title}
                      </p>
                    </div>

                    {grades[0] ? (
                      <GradeBars g={grades[0]} colors={colors} accent={accentColor.primary} />
                    ) : (
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        No aggregate grade data found.
                      </p>
                    )}

                    {offeringGrades.length > 0 && (
                      <div className="space-y-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: colors.textTertiary }}
                        >
                          By instructor
                        </p>
                        {offeringGrades.map((g, i) => (
                          <div
                            key={`${g.instructor}-${i}`}
                            className="rounded-xl px-3 py-2 flex items-center justify-between"
                            style={{
                              backgroundColor: colors.bgSecondary,
                              border: `1px solid ${colors.borderPrimary}`,
                            }}
                          >
                            <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                              {g.instructor || "Unknown"}
                            </span>
                            <span className="text-xs" style={{ color: colors.textSecondary }}>
                              GPA {g.averageGPA != null ? g.averageGPA.toFixed(2) : "—"} · n=
                              {gradeTotal(g)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-full px-4 py-2 text-sm font-medium shadow-lg"
            style={{ backgroundColor: colors.textPrimary, color: colors.bgPrimary }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav currentPage="planner" />
    </div>
  );
}

function GradeBars({
  g,
  colors,
  accent,
}: {
  g: GradeAggregate;
  colors: { bgTertiary: string; textPrimary: string; textSecondary: string };
  accent: string;
}) {
  const total = gradeTotal(g) || 1;
  const rows: { label: string; count: number; color: string }[] = [
    { label: "A", count: g.gradeACount, color: "#16a34a" },
    { label: "B", count: g.gradeBCount, color: "#65a30d" },
    { label: "C", count: g.gradeCCount, color: "#ca8a04" },
    { label: "D", count: g.gradeDCount, color: "#ea580c" },
    { label: "F", count: g.gradeFCount, color: "#dc2626" },
    { label: "P", count: g.gradePCount, color: "#0284c7" },
    { label: "NP", count: g.gradeNPCount, color: "#6366f1" },
    { label: "W", count: g.gradeWCount, color: "#78716c" },
  ];

  return (
    <div className="rounded-2xl px-4 py-4 space-y-3" style={{ backgroundColor: colors.bgTertiary }}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          Historical distribution
        </p>
        <p className="text-sm font-bold" style={{ color: accent }}>
          GPA {g.averageGPA != null ? g.averageGPA.toFixed(2) : "—"}
        </p>
      </div>
      {rows
        .filter((r) => r.count > 0)
        .map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-6 text-xs font-bold" style={{ color: colors.textPrimary }}>
              {r.label}
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#00000014" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(r.count / total) * 100}%`, backgroundColor: r.color }}
              />
            </div>
            <span className="w-10 text-right text-[10px]" style={{ color: colors.textSecondary }}>
              {Math.round((r.count / total) * 100)}%
            </span>
          </div>
        ))}
      <p className="text-[10px]" style={{ color: colors.textSecondary }}>
        Based on {gradeTotal(g)} recorded grades
      </p>
    </div>
  );
}
