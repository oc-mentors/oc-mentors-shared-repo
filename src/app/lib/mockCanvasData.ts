import { canvasCourses as defaultCanvasCourses } from "../data/courses";
import type { CanvasAssignment, CanvasCourse } from "../contexts/CanvasCoursesContext";

const defaultCanvasUrls: Record<number, string> = {
  1: "https://canvas.uci.edu/courses/67890",
  2: "https://canvas.uci.edu/courses/67891",
  3: "https://canvas.uci.edu/courses/67892",
  4: "https://canvas.uci.edu/courses/67893",
  5: "https://canvas.uci.edu/courses/67894",
};

const courseProgress: Record<number, { progress: number; lessonsCompleted: number }> = {
  1: { progress: 72, lessonsCompleted: 8 },
  2: { progress: 58, lessonsCompleted: 6 },
  3: { progress: 81, lessonsCompleted: 9 },
  4: { progress: 45, lessonsCompleted: 4 },
  5: { progress: 67, lessonsCompleted: 7 },
};

function dueInDays(daysFromNow: number, hour = 23, minute = 59): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** Mock Canvas classes shown after sign-in (demo / UCI-style catalog). */
export function buildMockCanvasCourses(): CanvasCourse[] {
  return defaultCanvasCourses.map((course) => {
    const stats = courseProgress[course.id] ?? { progress: 50, lessonsCompleted: 5 };
    return {
      ...course,
      canvasUrl: defaultCanvasUrls[course.id],
      progress: stats.progress,
      lessonsCompleted: stats.lessonsCompleted,
    };
  });
}

/** Mock upcoming assignments synced with the mock courses. */
export function buildMockCanvasAssignments(): CanvasAssignment[] {
  return [
    {
      id: 1001,
      name: "Lab Report 3: Titration",
      courseId: 1,
      courseName: "CHEM 1A",
      courseFullName: "CHEM 1A: General Chemistry",
      courseColor: "#8b5cf6",
      dueDate: dueInDays(1),
      submitted: false,
      points: 25,
    },
    {
      id: 1002,
      name: "Problem Set 4",
      courseId: 2,
      courseName: "MATH 2A",
      courseFullName: "MATH 2A: Calculus I",
      courseColor: "#5b7ceb",
      dueDate: dueInDays(2),
      submitted: false,
      points: 20,
    },
    {
      id: 1003,
      name: "Midterm Review Worksheet",
      courseId: 3,
      courseName: "PHYS 7C",
      courseFullName: "PHYS 7C: Classical Mechanics",
      courseColor: "#14b8a6",
      dueDate: dueInDays(3),
      submitted: false,
      points: 15,
    },
    {
      id: 1004,
      name: "Essay Draft: Rhetorical Analysis",
      courseId: 4,
      courseName: "WRIT 39B",
      courseFullName: "WRIT 39B: Critical Reading",
      courseColor: "#ec4899",
      dueDate: dueInDays(5),
      submitted: false,
      points: 30,
    },
    {
      id: 1005,
      name: "Cell Division Quiz",
      courseId: 5,
      courseName: "BIO SCI 93",
      courseFullName: "BIO SCI 93: DNA to Organisms",
      courseColor: "#22c55e",
      dueDate: dueInDays(4),
      submitted: false,
      points: 10,
    },
    {
      id: 1006,
      name: "Chapter 7 Reading Quiz",
      courseId: 2,
      courseName: "MATH 2A",
      courseColor: "#5b7ceb",
      dueDate: dueInDays(7),
      submitted: false,
      points: 5,
    },
    {
      id: 1007,
      name: "Discussion Post: Week 6",
      courseId: 4,
      courseName: "WRIT 39B",
      courseColor: "#ec4899",
      dueDate: dueInDays(6),
      submitted: true,
      points: 5,
    },
  ];
}
