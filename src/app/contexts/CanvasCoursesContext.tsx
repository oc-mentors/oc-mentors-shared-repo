import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { canvasCourses as defaultCanvasCourses } from "../data/courses";
import { setCourseColor } from "../hooks/useCourseColor";
import {
  registerCanvasDataResetHandler,
  CANVAS_COURSES_KEY,
  CANVAS_LAST_REFRESHED_KEY,
  CANVAS_ASSIGNMENTS_KEY,
  CANVAS_IGNORED_COURSES_KEY,
} from "../lib/canvasStorage";
import { buildMockCanvasAssignments, buildMockCanvasCourses } from "../lib/mockCanvasData";
import { useCanvasAuth } from "./CanvasAuthContext";

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
  /** Loads demo Canvas classes + assignments (after login). */
  loadMockCanvasCatalog: () => Promise<void>;
}

const CanvasCoursesContext = createContext<CanvasCoursesContextType | null>(null);

const STORAGE_KEY = CANVAS_COURSES_KEY;
const LAST_REFRESHED_KEY = CANVAS_LAST_REFRESHED_KEY;
const ASSIGNMENTS_KEY = CANVAS_ASSIGNMENTS_KEY;
const IGNORED_KEY = CANVAS_IGNORED_COURSES_KEY;

// Default Canvas URLs for each course
const defaultCanvasUrls: Record<number, string> = {
  1: "https://canvas.uci.edu/courses/67890", // CHEM 1A
  2: "https://canvas.uci.edu/courses/67891", // MATH 2A
  3: "https://canvas.uci.edu/courses/67892", // PHYS 7C
  4: "https://canvas.uci.edu/courses/67893", // WRIT 39B
  5: "https://canvas.uci.edu/courses/67894", // BIO SCI 93
};

function generateDefaultAssignments(): CanvasAssignment[] {
  return buildMockCanvasAssignments();
}

function loadAssignmentsFromStorage(): CanvasAssignment[] {
  const stored = localStorage.getItem(ASSIGNMENTS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((assignment: CanvasAssignment & { dueDate: string | Date }) => ({
          ...assignment,
          dueDate: new Date(assignment.dueDate),
        }));
      }
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

  const baseCourses = defaultCanvasCourses.map((course) => ({
    ...course,
    canvasUrl: defaultCanvasUrls[course.id],
    progress: 0,
    lessonsCompleted: 0,
  }));

  if (stored) {
    try {
      const storedData = JSON.parse(stored);
      if (!Array.isArray(storedData) || storedData.length === 0) {
        return [];
      }
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
      return [];
    }
  }

  return [];
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
  const { isCanvasConnected } = useCanvasAuth();
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

  useEffect(() => {
    return registerCanvasDataResetHandler(() => {
      setCourses(loadCoursesFromStorage());
      setAssignments(loadAssignmentsFromStorage());
      setLastRefreshed(null);
      setIgnoredCourseIds([]);
    });
  }, []);

  const loadMockCanvasCatalog = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setCourses(buildMockCanvasCourses());
    setAssignments(buildMockCanvasAssignments());

    const now = new Date();
    setLastRefreshed(now);
    localStorage.setItem(LAST_REFRESHED_KEY, now.toISOString());
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isCanvasConnected && (courses.length === 0 || assignments.length === 0)) {
      void loadMockCanvasCatalog();
    }
  }, [isCanvasConnected, courses.length, assignments.length, loadMockCanvasCatalog]);

  const refreshCourses = async () => {
    if (courses.length === 0) {
      await loadMockCanvasCatalog();
      return;
    }

    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
        loadMockCanvasCatalog,
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