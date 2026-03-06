import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { canvasCourses as defaultCanvasCourses } from "../data/courses";
import { setCourseColor } from "../hooks/useCourseColor";

export interface CanvasAssignment {
  id: number;
  name: string;
  dueDate: Date;
  courseId: number;
  courseName: string;       // Short code, e.g. "MATH 2A"
  courseFullName?: string;  // Full name, e.g. "MATH 2A: Calculus I"
  courseColor: string;
  points?: number;
  submitted?: boolean;
  score?: number;
  instructions?: string;
}

export interface CanvasCourse {
  id: number;
  name: string;
  code: string;
  color: string;
  icon: any;
  canvasUrl?: string;
  progress?: number;
  lessonsCompleted?: number;
  assignments?: CanvasAssignment[];
}

interface CanvasCoursesContextType {
  courses: CanvasCourse[];
  refreshCourses: () => Promise<void>;
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  updateCourse: (id: number, updates: Partial<CanvasCourse>) => void;
  getAllAssignments: () => CanvasAssignment[];
  addAssignment: (assignment: CanvasAssignment) => void;
  syncCoursesToAccent: (accentColor: string) => void;
  resetCourseColors: () => void;
  ignoredCourseIds: number[];
  ignoreCourse: (id: number) => void;
  unignoreCourse: (id: number) => void;
  isCourseIgnored: (id: number) => boolean;
}

const CanvasCoursesContext = createContext<CanvasCoursesContextType | null>(null);

const STORAGE_KEY = "canvas_courses_v1";
const LAST_REFRESHED_KEY = "canvas_last_refreshed_v1";
const ASSIGNMENTS_KEY = "canvas_assignments_v2"; // bumped to pick up canonical data
const IGNORED_KEY = "ignored_courses_v1";

// Default Canvas URLs for each course
const defaultCanvasUrls: Record<number, string> = {
  1: "https://canvas.uci.edu/courses/67890", // CHEM 1A
  2: "https://canvas.uci.edu/courses/67891", // MATH 2A
  3: "https://canvas.uci.edu/courses/67892", // PHYS 7C
  4: "https://canvas.uci.edu/courses/67893", // WRIT 39B
  5: "https://canvas.uci.edu/courses/67894", // BIO SCI 93
};

// Generate mock assignments — single source of truth used by both AssignmentsPage and the calendar
function generateDefaultAssignments(): CanvasAssignment[] {
  return [
    // ── CHEM 1A ─────────────────────────────────────────────────────────────
    {
      id: 1,
      name: "Lab Report: Acid-Base Titration",
      courseFullName: "CHEM 1A: General Chemistry",
      dueDate: new Date(2026, 1, 18, 23, 59), // Feb 18, 2026, 11:59 PM
      courseId: 1,
      courseName: "CHEM 1A",
      courseColor: "#8b5cf6",
      points: 100,
      submitted: false,
      instructions:
        "Complete a formal lab report on the acid-base titration experiment conducted in class. Your report should include: introduction, materials and methods, results (with data tables), discussion, and conclusion. Make sure to show all calculations and include error analysis.",
    },
    {
      id: 7,
      name: "Lab Safety Quiz",
      courseFullName: "CHEM 1A: General Chemistry",
      dueDate: new Date(2026, 1, 12, 23, 59), // Feb 12, 2026, 11:59 PM
      courseId: 1,
      courseName: "CHEM 1A",
      courseColor: "#8b5cf6",
      points: 25,
      submitted: true,
      score: 25,
      instructions:
        "Complete the lab safety quiz before Friday's lab session. This quiz covers proper handling of chemicals, emergency procedures, and lab equipment usage.",
    },
    // ── MATH 2A ─────────────────────────────────────────────────────────────
    {
      id: 2,
      name: "Problem Set 5: Integration Techniques",
      courseFullName: "MATH 2A: Calculus I",
      dueDate: new Date(2026, 1, 16, 23, 59), // Feb 16, 2026
      courseId: 2,
      courseName: "MATH 2A",
      courseColor: "#3b82f6",
      points: 50,
      submitted: false,
      instructions:
        "Complete problems 1-20 from Chapter 7. Focus on integration by parts, trigonometric substitution, and partial fractions. Show all work for full credit. You may work in groups but must submit your own solutions.",
    },
    {
      id: 6,
      name: "Homework 3: Derivatives",
      courseFullName: "MATH 2A: Calculus I",
      dueDate: new Date(2026, 1, 10, 23, 59), // Feb 10, 2026 — past due
      courseId: 2,
      courseName: "MATH 2A",
      courseColor: "#3b82f6",
      points: 50,
      submitted: false,
      instructions:
        "Complete all exercises from Section 3.1–3.4. Focus on the chain rule, implicit differentiation, and related rates problems.",
    },
    // ── PHYS 7C ─────────────────────────────────────────────────────────────
    {
      id: 3,
      name: "Midterm Exam Review",
      courseFullName: "PHYS 7C: Classical Mechanics",
      dueDate: new Date(2026, 1, 17, 23, 59), // Feb 17, 2026
      courseId: 3,
      courseName: "PHYS 7C",
      courseColor: "#14b8a6",
      points: 75,
      submitted: false,
      instructions:
        "Complete the practice problems posted on Canvas to prepare for the midterm. This review is mandatory and will count as a homework grade. Topics covered: Newton's laws, energy conservation, momentum, and rotational dynamics.",
    },
    // ── WRIT 39B ────────────────────────────────────────────────────────────
    {
      id: 4,
      name: "Argumentative Essay Draft",
      courseFullName: "WRIT 39B: Critical Reading",
      dueDate: new Date(2026, 1, 19, 23, 59), // Feb 19, 2026
      courseId: 4,
      courseName: "WRIT 39B",
      courseColor: "#ec4899",
      points: 150,
      submitted: false,
      instructions:
        "Submit a complete first draft of your argumentative essay (1500–2000 words). Your essay should present a clear thesis statement, include at least 5 scholarly sources, and address counterarguments. This draft will receive peer review feedback.",
    },
    // ── BIO SCI 93 ──────────────────────────────────────────────────────────
    {
      id: 5,
      name: "Gene Expression Lab Quiz",
      courseFullName: "BIO SCI 93: DNA to Organisms",
      dueDate: new Date(2026, 1, 15, 23, 59), // Feb 15, 2026
      courseId: 5,
      courseName: "BIO SCI 93",
      courseColor: "#22c55e",
      points: 40,
      submitted: false,
      instructions:
        "Complete the online quiz covering gene expression, transcription, and translation. The quiz has 20 multiple choice questions and is timed (30 minutes). You will have 2 attempts; your highest score will be recorded.",
    },
  ];
}

function loadAssignmentsFromStorage(): CanvasAssignment[] {
  const stored = localStorage.getItem(ASSIGNMENTS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((assignment: any) => ({
        ...assignment,
        dueDate: new Date(assignment.dueDate),
      }));
    } catch (error) {
      console.error("Error loading assignments from storage:", error);
    }
  }
  return generateDefaultAssignments();
}

function saveAssignmentsToStorage(assignments: CanvasAssignment[]) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

function loadCoursesFromStorage(): CanvasCourse[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // Always use defaultCanvasCourses as base to ensure icons are correct
  const baseCourses = defaultCanvasCourses.map((course) => ({
    ...course,
    canvasUrl: defaultCanvasUrls[course.id],
    progress: 0,
    lessonsCompleted: 0,
  }));
  
  if (stored) {
    try {
      const storedData = JSON.parse(stored);
      // Merge stored data with base courses to preserve icons
      return baseCourses.map((baseCourse) => {
        const storedCourse = storedData.find((c: CanvasCourse) => c.id === baseCourse.id);
        if (storedCourse) {
          return {
            ...baseCourse,
            progress: storedCourse.progress,
            lessonsCompleted: storedCourse.lessonsCompleted,
            canvasUrl: storedCourse.canvasUrl || baseCourse.canvasUrl,
            color: storedCourse.color || baseCourse.color,
          };
        }
        return baseCourse;
      });
    } catch (error) {
      console.error("Error loading courses from storage:", error);
      return baseCourses;
    }
  }
  
  // Initialize with random progress
  return baseCourses.map((course) => ({
    ...course,
    progress: getRandomProgress(),
    lessonsCompleted: getRandomLessons(),
  }));
}

function saveCoursesToStorage(courses: CanvasCourse[]) {
  // Don't save icon components to localStorage, just the data
  const coursesToSave = courses.map(({ icon, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coursesToSave));
}

function getRandomProgress(): number {
  return Math.floor(Math.random() * 60) + 30; // 30-90%
}

function getRandomLessons(): number {
  return Math.floor(Math.random() * 8) + 3; // 3-10 lessons
}

export function CanvasCoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<CanvasCourse[]>(loadCoursesFromStorage);
  const [assignments, setAssignments] = useState<CanvasAssignment[]>(
    loadAssignmentsFromStorage
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(() => {
    const stored = localStorage.getItem(LAST_REFRESHED_KEY);
    return stored ? new Date(stored) : null;
  });
  const [ignoredCourseIds, setIgnoredCourseIds] = useState<number[]>(() => {
    const stored = localStorage.getItem(IGNORED_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Attach assignments to courses - memoized to prevent infinite loops
  const coursesWithAssignments = useMemo(() => {
    return courses.map((course) => ({
      ...course,
      assignments: assignments.filter((a) => a.courseId === course.id),
    }));
  }, [courses, assignments]);

  // Save courses to storage whenever they change
  useEffect(() => {
    saveCoursesToStorage(courses);
  }, [courses]);

  // Save assignments to storage whenever they change
  useEffect(() => {
    saveAssignmentsToStorage(assignments);
  }, [assignments]);

  // Save ignored courses to storage whenever they change
  useEffect(() => {
    localStorage.setItem(IGNORED_KEY, JSON.stringify(ignoredCourseIds));
  }, [ignoredCourseIds]);

  const refreshCourses = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to Canvas
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update courses with refreshed data
    const refreshedCourses = courses.map((course) => ({
      ...course,
      progress: getRandomProgress(),
      lessonsCompleted: getRandomLessons(),
    }));

    setCourses(refreshedCourses);
    
    const now = new Date();
    setLastRefreshed(now);
    localStorage.setItem(LAST_REFRESHED_KEY, now.toISOString());
    
    setIsRefreshing(false);
  };

  const updateCourse = (id: number, updates: Partial<CanvasCourse>) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      )
    );
  };

  const addAssignment = (assignment: CanvasAssignment) => {
    setAssignments((prev) => [...prev, assignment]);
  };

  const syncCoursesToAccent = (accentColor: string) => {
    // Update the useCourseColor system (used by HomePage, ProgressPage, CanvasClassesPage)
    [1, 2, 3, 4, 5].forEach((id) => setCourseColor(id, accentColor));
    // Update context course colors
    setCourses((prev) =>
      prev.map((course) => ({ ...course, color: accentColor }))
    );
    // Update all assignment courseColors
    setAssignments((prev) =>
      prev.map((assignment) => ({ ...assignment, courseColor: accentColor }))
    );
  };

  const resetCourseColors = () => {
    const originalColors: Record<number, string> = {
      1: "rgb(139, 92, 246)",
      2: "rgb(59, 130, 246)",
      3: "rgb(20, 184, 166)",
      4: "rgb(236, 72, 153)",
      5: "rgb(34, 197, 94)",
    };
    const originalAssignmentColors: Record<number, string> = {
      1: "#ea580c",
      2: "#5b7ceb",
      3: "#14b8a6",
      4: "#a855f7",
      5: "#ec4899",
    };
    // Reset the useCourseColor system back to defaults
    [1, 2, 3, 4, 5].forEach((id) => {
      localStorage.removeItem(`courseColor_${id}`);
      setCourseColor(id, originalColors[id]);
    });
    // Reset context course colors
    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        color: originalColors[course.id] ?? course.color,
      }))
    );
    setAssignments((prev) =>
      prev.map((assignment) => ({
        ...assignment,
        courseColor: originalAssignmentColors[assignment.courseId] ?? assignment.courseColor,
      }))
    );
  };

  const getAllAssignments = useCallback((): CanvasAssignment[] => {
    return assignments.filter((a) => !ignoredCourseIds.includes(a.courseId));
  }, [assignments, ignoredCourseIds]);

  const ignoreCourse = (id: number) => {
    setIgnoredCourseIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const unignoreCourse = (id: number) => {
    setIgnoredCourseIds((prev) => prev.filter((i) => i !== id));
  };

  const isCourseIgnored = (id: number) => ignoredCourseIds.includes(id);

  return (
    <CanvasCoursesContext.Provider
      value={{
        courses: coursesWithAssignments,
        refreshCourses,
        isRefreshing,
        lastRefreshed,
        updateCourse,
        getAllAssignments,
        addAssignment,
        syncCoursesToAccent,
        resetCourseColors,
        ignoredCourseIds,
        ignoreCourse,
        unignoreCourse,
        isCourseIgnored,
      }}
    >
      {children}
    </CanvasCoursesContext.Provider>
  );
}

export function useCanvasCourses() {
  const context = useContext(CanvasCoursesContext);
  if (!context) {
    throw new Error("useCanvasCourses must be used within a CanvasCoursesProvider");
  }
  return context;
}