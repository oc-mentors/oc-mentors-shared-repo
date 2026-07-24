/**
 * Robust course query parsing for Zot Planner / WebSoc.
 * "ics 31", "ICS31", "I&C SCI 31" → department I&C SCI + courseNumber 31
 */

export type WebsocDeptLike = { deptCode: string; deptName: string };

export type CourseAttempt = {
  department: string;
  courseNumber: string;
  label: string;
};

export type ResolveResult = {
  attempts: CourseAttempt[];
  courseNumber?: string;
  instructorName?: string;
  note?: string;
  /** Raw free-text we parsed */
  interpretedFrom?: string;
};

/** "I&C SCI" → "icsci" */
export function normalizeDeptKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Built-in codes so search works even before /websoc/departments loads */
export const BUILTIN_DEPARTMENTS: WebsocDeptLike[] = [
  { deptCode: "I&C SCI", deptName: "Information and Computer Sciences" },
  { deptCode: "COMPSCI", deptName: "Computer Science" },
  { deptCode: "IN4MATX", deptName: "Informatics" },
  { deptCode: "STATS", deptName: "Statistics" },
  { deptCode: "EECS", deptName: "Electrical Engineering & Computer Science" },
  { deptCode: "CSE", deptName: "Computer Science and Engineering" },
  { deptCode: "BIO SCI", deptName: "Biological Sciences" },
  { deptCode: "CHEM", deptName: "Chemistry" },
  { deptCode: "PHYSICS", deptName: "Physics" },
  { deptCode: "MATH", deptName: "Mathematics" },
  { deptCode: "PSYCH", deptName: "Psychology" },
  { deptCode: "ECON", deptName: "Economics" },
  { deptCode: "ENGLISH", deptName: "English" },
  { deptCode: "WRITING", deptName: "Writing" },
  { deptCode: "HISTORY", deptName: "History" },
  { deptCode: "PHILOS", deptName: "Philosophy" },
  { deptCode: "POL SCI", deptName: "Political Science" },
  { deptCode: "SOCIOL", deptName: "Sociology" },
  { deptCode: "ANTHRO", deptName: "Anthropology" },
  { deptCode: "ART", deptName: "Art" },
  { deptCode: "ART HIS", deptName: "Art History" },
  { deptCode: "DRAMA", deptName: "Drama" },
  { deptCode: "MUSIC", deptName: "Music" },
  { deptCode: "DANCE", deptName: "Dance" },
  { deptCode: "BME", deptName: "Biomedical Engineering" },
  { deptCode: "ENGRMAE", deptName: "Mechanical and Aerospace Engineering" },
  { deptCode: "ENGRCEE", deptName: "Civil and Environmental Engineering" },
  { deptCode: "PUBHLTH", deptName: "Public Health" },
  { deptCode: "NUR SCI", deptName: "Nursing Science" },
  { deptCode: "PHRMSCI", deptName: "Pharmaceutical Sciences" },
  { deptCode: "EDUC", deptName: "Education" },
  { deptCode: "MGMT", deptName: "Management" },
  { deptCode: "CRM/LAW", deptName: "Criminology, Law and Society" },
  { deptCode: "UNI STU", deptName: "University Studies" },
  { deptCode: "GEN&SEX", deptName: "Gender and Sexuality Studies" },
  { deptCode: "LINGUIS", deptName: "Linguistics" },
  { deptCode: "COGS", deptName: "Cognitive Sciences" },
  { deptCode: "EARTHSS", deptName: "Earth System Science" },
  { deptCode: "HUMAN", deptName: "Humanities" },
  { deptCode: "SOC SCI", deptName: "Social Sciences" },
  { deptCode: "INTL ST", deptName: "International Studies" },
  { deptCode: "ASIANAM", deptName: "Asian American Studies" },
  { deptCode: "AFAM", deptName: "African American Studies" },
  { deptCode: "CHC/LAT", deptName: "Chicano/Latino Studies" },
  { deptCode: "EURO ST", deptName: "European Studies" },
  { deptCode: "FLM&MDA", deptName: "Film and Media Studies" },
  { deptCode: "REL STD", deptName: "Religious Studies" },
  { deptCode: "CLASSIC", deptName: "Classics" },
  { deptCode: "CHINESE", deptName: "Chinese" },
  { deptCode: "JAPANSE", deptName: "Japanese" },
  { deptCode: "KOREAN", deptName: "Korean" },
  { deptCode: "SPANISH", deptName: "Spanish" },
  { deptCode: "FRENCH", deptName: "French" },
  { deptCode: "GERMAN", deptName: "German" },
];

/**
 * Nickname → official WebSoc deptCode (and extras to try).
 * Order matters: first is preferred.
 */
const ALIAS_TO_DEPTS: Record<string, string[]> = {
  ics: ["I&C SCI"],
  ic: ["I&C SCI"],
  icsci: ["I&C SCI"],
  icssci: ["I&C SCI"],
  "iandc": ["I&C SCI"],
  "iandcsci": ["I&C SCI"],
  informatics: ["IN4MATX"],
  info: ["IN4MATX"],
  inf: ["IN4MATX"],
  in4matx: ["IN4MATX"],
  cs: ["COMPSCI", "I&C SCI"],
  compsci: ["COMPSCI"],
  computerscience: ["COMPSCI"],
  cse: ["CSE", "COMPSCI", "I&C SCI"],
  eecs: ["EECS"],
  ee: ["EECS"],
  ece: ["EECS"],
  electrical: ["EECS"],
  mae: ["ENGRMAE"],
  engrmae: ["ENGRMAE"],
  mechanical: ["ENGRMAE"],
  cee: ["ENGRCEE"],
  engrcee: ["ENGRCEE"],
  civil: ["ENGRCEE"],
  bme: ["BME"],
  biomedical: ["BME"],
  bio: ["BIO SCI"],
  biosci: ["BIO SCI"],
  biology: ["BIO SCI"],
  chem: ["CHEM"],
  chemistry: ["CHEM"],
  phys: ["PHYSICS"],
  physics: ["PHYSICS"],
  math: ["MATH"],
  mathematics: ["MATH"],
  stats: ["STATS"],
  statistics: ["STATS"],
  psych: ["PSYCH"],
  psychology: ["PSYCH"],
  econ: ["ECON"],
  economics: ["ECON"],
  engl: ["ENGLISH"],
  english: ["ENGLISH"],
  writing: ["WRITING"],
  wr: ["WRITING"],
  hist: ["HISTORY"],
  history: ["HISTORY"],
  philos: ["PHILOS"],
  philosophy: ["PHILOS"],
  polisci: ["POL SCI"],
  politicalscience: ["POL SCI"],
  political: ["POL SCI"],
  soc: ["SOCIOL"],
  sociology: ["SOCIOL"],
  anthro: ["ANTHRO"],
  anthropology: ["ANTHRO"],
  art: ["ART"],
  arthist: ["ART HIS"],
  arthistory: ["ART HIS"],
  drama: ["DRAMA"],
  music: ["MUSIC"],
  dance: ["DANCE"],
  pubhlth: ["PUBHLTH"],
  publichealth: ["PUBHLTH"],
  nursing: ["NUR SCI"],
  nursci: ["NUR SCI"],
  pharm: ["PHRMSCI"],
  pharmsci: ["PHRMSCI"],
  edu: ["EDUC"],
  education: ["EDUC"],
  mgmt: ["MGMT"],
  business: ["MGMT"],
  crmlaw: ["CRM/LAW"],
  criminology: ["CRM/LAW"],
  unistu: ["UNI STU"],
  gened: ["GEN&SEX"],
  gender: ["GEN&SEX"],
  ling: ["LINGUIS"],
  linguistics: ["LINGUIS"],
  cogs: ["COGS"],
  cognitivesci: ["COGS"],
  cognitivesciences: ["COGS"],
  earthss: ["EARTHSS"],
  earthsys: ["EARTHSS"],
  film: ["FLM&MDA"],
  flmmda: ["FLM&MDA"],
};

const COURSE_NUM_RE = /^[A-Za-z]?\d{1,3}[A-Za-z]{0,2}$/;

function mergeDeptLists(live: WebsocDeptLike[]): WebsocDeptLike[] {
  const byNorm = new Map<string, WebsocDeptLike>();
  for (const d of [...BUILTIN_DEPARTMENTS, ...live]) {
    byNorm.set(normalizeDeptKey(d.deptCode), d);
  }
  return [...byNorm.values()];
}

function canonicalDeptCode(code: string, all: WebsocDeptLike[]): string {
  const exact = all.find((d) => d.deptCode === code);
  if (exact) return exact.deptCode;
  const n = normalizeDeptKey(code);
  const hit = all.find((d) => normalizeDeptKey(d.deptCode) === n);
  return hit?.deptCode ?? code;
}

/** Resolve a free-text department token to one or more official codes. */
export function resolveDeptTokens(token: string, liveDepartments: WebsocDeptLike[] = []): string[] {
  const t = token.trim();
  if (!t) return [];
  const all = mergeDeptLists(liveDepartments);
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (code: string) => {
    const c = canonicalDeptCode(code, all);
    if (seen.has(c)) return;
    seen.add(c);
    out.push(c);
  };

  const lower = t.toLowerCase();
  const norm = normalizeDeptKey(t);

  // Multi-word alias keys collapsed
  if (ALIAS_TO_DEPTS[lower]) {
    for (const c of ALIAS_TO_DEPTS[lower]) add(c);
  }
  if (ALIAS_TO_DEPTS[norm]) {
    for (const c of ALIAS_TO_DEPTS[norm]) add(c);
  }

  // Exact / fuzzy against known department codes & names
  for (const d of all) {
    const codeN = normalizeDeptKey(d.deptCode);
    const nameN = normalizeDeptKey(d.deptName);
    if (codeN === norm || d.deptCode.toLowerCase() === lower) add(d.deptCode);
    else if (norm.length >= 2 && codeN.startsWith(norm)) add(d.deptCode);
    else if (norm.length >= 3 && (nameN === norm || nameN.startsWith(norm) || nameN.includes(norm))) {
      add(d.deptCode);
    }
  }

  // "i&c sci", "i and c sci", "ic sci"
  if (/^i\s*&?\s*c(\s*sci)?$/i.test(t) || /^i\s*and\s*c(\s*sci)?$/i.test(t) || /^ic\s*sci$/i.test(t)) {
    add("I&C SCI");
  }
  if (/^bio(\s*sci(ence|ences)?)?$/i.test(t)) add("BIO SCI");
  if (/^pol(i(tical)?)?\s*sci(ence)?$/i.test(t)) add("POL SCI");
  if (/^art\s*hist(ory)?$/i.test(t)) add("ART HIS");

  return out;
}

/**
 * Pull department token + course number from free text.
 * Handles: "ics 31", "ICS31", "I&C SCI 45C", "bio sci 93", "cs-161"
 */
export function splitDeptAndNumber(rawInput: string): { deptToken?: string; courseNumber?: string } {
  let raw = rawInput.trim().replace(/\s+/g, " ");
  if (!raw) return {};

  // Normalize separators
  raw = raw.replace(/[_/]+/g, " ").replace(/\s*-\s*/g, " ").trim();

  // Glued letter+number: ics31, CS161, BIO93A, wr39C
  const glued = raw.match(/^([A-Za-z][A-Za-z&.]*)(\d{1,3}[A-Za-z]{0,2})$/);
  if (glued) {
    return { deptToken: glued[1], courseNumber: glued[2].toUpperCase() };
  }

  // Trailing number: "ics 31", "I&C SCI 45C", "bio sci 93"
  const trailing = raw.match(/^(.*?)[\s]+([A-Za-z]?\d{1,3}[A-Za-z]{0,2})$/);
  if (trailing && trailing[1].trim() && COURSE_NUM_RE.test(trailing[2])) {
    return { deptToken: trailing[1].trim(), courseNumber: trailing[2].toUpperCase() };
  }

  // Number only
  if (COURSE_NUM_RE.test(raw)) {
    return { courseNumber: raw.toUpperCase() };
  }

  // Dept only
  return { deptToken: raw };
}

/**
 * Build ordered WebSoc attempts from all UI fields.
 * Always works with built-in aliases — does not require departments to be loaded.
 */
export function resolveCourseSearch(opts: {
  department: string;
  courseNumber: string;
  searchQuery: string;
  instructorFilter: string;
  departments?: WebsocDeptLike[];
}): ResolveResult {
  const live = opts.departments ?? [];
  const instructorName = opts.instructorFilter.trim() || undefined;
  const attempts: CourseAttempt[] = [];
  const seen = new Set<string>();
  const notes: string[] = [];

  const push = (department: string, courseNumber: string, label: string) => {
    const key = `${department}::${courseNumber}`;
    if (!department || !courseNumber || seen.has(key)) return;
    seen.add(key);
    attempts.push({ department, courseNumber, label });
  };

  const fromFreeText = (text: string, source: string) => {
    const t = text.trim();
    if (!t) return;
    const { deptToken, courseNumber } = splitDeptAndNumber(t);
    if (deptToken && courseNumber) {
      const depts = resolveDeptTokens(deptToken, live);
      if (!depts.length) {
        notes.push(`unknown dept “${deptToken}”`);
        return;
      }
      notes.push(`${deptToken} → ${depts[0]}`);
      for (const d of depts) push(d, courseNumber, `${source}: ${d} ${courseNumber}`);
    } else if (courseNumber && opts.department.trim()) {
      // number-only free text + dropdown dept
      const depts = resolveDeptTokens(opts.department.trim(), live);
      for (const d of depts.length ? depts : [opts.department.trim()]) {
        push(d, courseNumber, `${source}+dropdown: ${d} ${courseNumber}`);
      }
    } else if (deptToken && !courseNumber) {
      const depts = resolveDeptTokens(deptToken, live);
      // dept-only — caller may reject whole-dept search
      for (const d of depts) {
        // placeholder number omitted; handled by page
        notes.push(`${source} dept ${d}`);
      }
    }
  };

  // 1) Course # field (primary — users type "ics 31" here)
  fromFreeText(opts.courseNumber, "course#");

  // 2) Search / title field
  fromFreeText(opts.searchQuery, "search");

  // 3) Dropdown department + plain course number
  const dropdown = opts.department.trim();
  const numOnly = opts.courseNumber.trim();
  if (dropdown && numOnly && COURSE_NUM_RE.test(numOnly)) {
    const depts = resolveDeptTokens(dropdown, live);
    for (const d of depts.length ? depts : [dropdown]) {
      push(d, numOnly.toUpperCase(), `dropdown: ${d} ${numOnly.toUpperCase()}`);
    }
  }

  // 4) Dropdown + number parsed from search box
  if (dropdown && opts.searchQuery.trim()) {
    const { courseNumber } = splitDeptAndNumber(opts.searchQuery.trim());
    if (courseNumber) {
      const depts = resolveDeptTokens(dropdown, live);
      for (const d of depts.length ? depts : [dropdown]) {
        push(d, courseNumber, `dropdown+search#: ${d} ${courseNumber}`);
      }
    }
  }

  // 5) Combined "department field text + course field" if dept looks like nickname
  if (dropdown && numOnly && !COURSE_NUM_RE.test(numOnly)) {
    fromFreeText(`${dropdown} ${numOnly}`, "combined");
  }

  // 6) If still nothing, try treating entire searchQuery+courseNumber as one string
  if (!attempts.length) {
    const combined = [opts.department, opts.courseNumber, opts.searchQuery]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");
    if (combined) fromFreeText(combined, "combined");
  }

  return {
    attempts,
    courseNumber: attempts[0]?.courseNumber,
    instructorName,
    note: notes[0],
    interpretedFrom: attempts[0]?.label,
  };
}

/** @deprecated use resolveCourseSearch */
export function resolveWebsocQuery(opts: {
  department: string;
  courseNumber: string;
  searchQuery: string;
  instructorFilter: string;
  departments: WebsocDeptLike[];
}): {
  department?: string;
  courseNumber?: string;
  instructorName?: string;
  note?: string;
  fallbackDepartments: string[];
} {
  const r = resolveCourseSearch(opts);
  return {
    department: r.attempts[0]?.department,
    courseNumber: r.attempts[0]?.courseNumber ?? r.courseNumber,
    instructorName: r.instructorName,
    note: r.note,
    fallbackDepartments: r.attempts.slice(1).map((a) => a.department),
  };
}

/** @deprecated */
export function parseCourseQuery(rawInput: string, departments: WebsocDeptLike[] = []) {
  const { deptToken, courseNumber } = splitDeptAndNumber(rawInput);
  const depts = deptToken ? resolveDeptTokens(deptToken, departments) : [];
  return {
    raw: rawInput,
    department: depts[0],
    courseNumber,
    note: depts[0] && deptToken ? `${deptToken} → ${depts[0]}` : undefined,
  };
}

/** @deprecated */
export function rankDepartments(token: string, departments: WebsocDeptLike[]) {
  return resolveDeptTokens(token, departments).map((deptCode, i) => ({
    deptCode,
    score: 100 - i,
    reason: deptCode,
  }));
}
