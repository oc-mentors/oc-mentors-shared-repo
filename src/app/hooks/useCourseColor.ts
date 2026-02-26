import { useState, useEffect } from "react";

// Default colors per course ID
const defaultCourseColors: Record<number, string> = {
  1: "rgb(139, 92, 246)",  // Chem - Purple
  2: "rgb(59, 130, 246)",  // Math - Blue
  3: "rgb(20, 184, 166)",  // Physics - Teal
  4: "rgb(236, 72, 153)",  // Writing - Pink
  5: "rgb(34, 197, 94)",   // Biology - Green
};

export function getCourseColor(courseId: number): string {
  const saved = localStorage.getItem(`courseColor_${courseId}`);
  return saved || defaultCourseColors[courseId] || "rgb(139, 92, 246)";
}

export function setCourseColor(courseId: number, color: string) {
  localStorage.setItem(`courseColor_${courseId}`, color);
  window.dispatchEvent(new CustomEvent("courseColorChange", { detail: { courseId, color } }));
}

export function useCourseColor(courseId: number): [string, (color: string) => void] {
  const [color, setColor] = useState(() => getCourseColor(courseId));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.courseId === courseId) {
        setColor(detail.color);
      }
    };
    window.addEventListener("courseColorChange", handler);
    return () => window.removeEventListener("courseColorChange", handler);
  }, [courseId]);

  const updateColor = (newColor: string) => {
    setColor(newColor);
    setCourseColor(courseId, newColor);
  };

  return [color, updateColor];
}

// Hook to get all course colors reactively
export function useAllCourseColors(): Record<number, string> {
  const [colors, setColors] = useState<Record<number, string>>(() => {
    const result: Record<number, string> = {};
    for (const id of [1, 2, 3, 4, 5]) {
      result[id] = getCourseColor(id);
    }
    return result;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setColors(prev => ({ ...prev, [detail.courseId]: detail.color }));
    };
    window.addEventListener("courseColorChange", handler);
    return () => window.removeEventListener("courseColorChange", handler);
  }, []);

  return colors;
}
