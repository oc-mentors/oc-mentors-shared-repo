import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { canvasCourses as defaultCanvasCourses } from "../data/courses";

export interface CanvasCourse {
  id: number;
  name: string;
  code: string;
  color: string;
  icon: any;
  canvasUrl?: string;
  progress?: number;
  lessonsCompleted?: number;
}

interface CanvasCoursesContextType {
  courses: CanvasCourse[];
  refreshCourses: () => Promise<void>;
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  updateCourse: (id: number, updates: Partial<CanvasCourse>) => void;
}

const CanvasCoursesContext = createContext<CanvasCoursesContextType | null>(null);

const STORAGE_KEY = "canvas_courses_v1";
const LAST_REFRESHED_KEY = "canvas_last_refreshed_v1";

// Default Canvas URLs for each course
const defaultCanvasUrls: Record<number, string> = {
  1: "https://canvas.uci.edu/courses/67890", // CHEM 1A
  2: "https://canvas.uci.edu/courses/67891", // MATH 2A
  3: "https://canvas.uci.edu/courses/67892", // PHYS 7C
  4: "https://canvas.uci.edu/courses/67893", // WRIT 39B
  5: "https://canvas.uci.edu/courses/67894", // BIO SCI 93
};

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(() => {
    const stored = localStorage.getItem(LAST_REFRESHED_KEY);
    return stored ? new Date(stored) : null;
  });

  // Save courses to storage whenever they change
  useEffect(() => {
    saveCoursesToStorage(courses);
  }, [courses]);

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

  return (
    <CanvasCoursesContext.Provider
      value={{
        courses,
        refreshCourses,
        isRefreshing,
        lastRefreshed,
        updateCourse,
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