import { FlaskConical, Calculator, Atom, PenTool, Microscope } from "lucide-react";

export const canvasCourses = [
  { id: 1, name: "CHEM 1A: General Chemistry", code: "CHEM 1A", color: "rgb(139, 92, 246)", icon: FlaskConical },
  { id: 2, name: "MATH 2A: Calculus I", code: "MATH 2A", color: "rgb(59, 130, 246)", icon: Calculator },
  { id: 3, name: "PHYS 7C: Classical Mechanics", code: "PHYS 7C", color: "rgb(20, 184, 166)", icon: Atom },
  { id: 4, name: "WRIT 39B: Critical Reading", code: "WRIT 39B", color: "rgb(236, 72, 153)", icon: PenTool },
  { id: 5, name: "BIO SCI 93: DNA to Organisms", code: "BIO SCI 93", color: "rgb(34, 197, 94)", icon: Microscope },
];

export const subjects = [
  { name: "Chem", courseId: 1, defaultColor: "rgb(139, 92, 246)", icon: "chemistry" },
  { name: "Math", courseId: 2, defaultColor: "rgb(59, 130, 246)", icon: "math" },
  { name: "Physics", courseId: 3, defaultColor: "rgb(20, 184, 166)", icon: "physics" },
  { name: "Writing", courseId: 4, defaultColor: "rgb(236, 72, 153)", icon: "writing" },
  { name: "Biology", courseId: 5, defaultColor: "rgb(34, 197, 94)", icon: "biology" },
  { name: "History", courseId: 0, defaultColor: "rgb(180, 83, 9)", icon: "history" },
];
