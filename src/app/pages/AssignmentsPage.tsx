import { Link } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Filter, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const assignments = [
  {
    id: 1,
    courseName: "CHEM 1A: General Chemistry",
    courseColor: "rgb(139, 92, 246)",
    title: "Lab Report: Acid-Base Titration",
    dueDate: "Feb 16, 2026",
    dueDateFull: "Friday, February 16, 2026 at 11:59 PM",
    daysUntilDue: 3,
    instructions: "Complete a formal lab report on the acid-base titration experiment conducted in class. Your report should include: introduction, materials and methods, results (with data tables), discussion, and conclusion. Make sure to show all calculations and include error analysis.",
    status: "upcoming",
    points: 100,
  },
  {
    id: 2,
    courseName: "MATH 2A: Calculus I",
    courseColor: "rgb(59, 130, 246)",
    title: "Problem Set 5: Integration Techniques",
    dueDate: "Feb 15, 2026",
    dueDateFull: "Thursday, February 15, 2026 at 11:59 PM",
    daysUntilDue: 2,
    instructions: "Complete problems 1-20 from Chapter 7. Focus on integration by parts, trigonometric substitution, and partial fractions. Show all work for full credit. You may work in groups but must submit your own solutions.",
    status: "upcoming",
    points: 50,
  },
  {
    id: 3,
    courseName: "PHYS 7C: Classical Mechanics",
    courseColor: "rgb(20, 184, 166)",
    title: "Midterm Exam Review",
    dueDate: "Feb 14, 2026",
    dueDateFull: "Wednesday, February 14, 2026 at 11:59 PM",
    daysUntilDue: 1,
    instructions: "Complete the practice problems posted on Canvas to prepare for the midterm. This review is mandatory and will count as a homework grade. Topics covered: Newton's laws, energy conservation, momentum, and rotational dynamics.",
    status: "urgent",
    points: 75,
  },
  {
    id: 4,
    courseName: "WRIT 39B: Critical Reading",
    courseColor: "rgb(236, 72, 153)",
    title: "Argumentative Essay Draft",
    dueDate: "Feb 18, 2026",
    dueDateFull: "Sunday, February 18, 2026 at 11:59 PM",
    daysUntilDue: 5,
    instructions: "Submit a complete first draft of your argumentative essay (1500-2000 words). Your essay should present a clear thesis statement, include at least 5 scholarly sources, and address counterarguments. This draft will receive peer review feedback.",
    status: "upcoming",
    points: 150,
  },
  {
    id: 5,
    courseName: "BIO SCI 93: DNA to Organisms",
    courseColor: "rgb(34, 197, 94)",
    title: "Gene Expression Lab Quiz",
    dueDate: "Feb 17, 2026",
    dueDateFull: "Saturday, February 17, 2026 at 11:59 PM",
    daysUntilDue: 4,
    instructions: "Complete the online quiz covering gene expression, transcription, and translation. The quiz has 20 multiple choice questions and is timed (30 minutes). You will have 2 attempts; your highest score will be recorded.",
    status: "upcoming",
    points: 40,
  },
  {
    id: 6,
    courseName: "MATH 2A: Calculus I",
    courseColor: "rgb(59, 130, 246)",
    title: "Homework 3: Derivatives",
    dueDate: "Feb 10, 2026",
    dueDateFull: "Monday, February 10, 2026 at 11:59 PM",
    daysUntilDue: -3,
    instructions: "Complete all exercises from Section 3.1-3.4. Focus on the chain rule, implicit differentiation, and related rates problems.",
    status: "missing",
    points: 50,
  },
  {
    id: 7,
    courseName: "CHEM 1A: General Chemistry",
    courseColor: "rgb(139, 92, 246)",
    title: "Lab Safety Quiz",
    dueDate: "Feb 12, 2026",
    dueDateFull: "Tuesday, February 12, 2026 at 11:59 PM",
    daysUntilDue: -1,
    instructions: "Complete the lab safety quiz before Friday's lab session. This quiz covers proper handling of chemicals, emergency procedures, and lab equipment usage.",
    status: "completed",
    points: 25,
    score: 25,
  },
];

export default function AssignmentsPage() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["CHEM 1A", "MATH 2A", "PHYS 7C", "WRIT 39B", "BIO SCI 93"]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [ignoredAssignments, setIgnoredAssignments] = useState<number[]>(() => {
    const stored = localStorage.getItem('ignoredAssignments');
    return stored ? JSON.parse(stored) : [];
  });

  const courses = ["CHEM 1A", "MATH 2A", "PHYS 7C", "WRIT 39B", "BIO SCI 93"];
  const statuses = ["All", "Upcoming", "Urgent", "Missing"];

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(course)) {
        return prev.filter(c => c !== course);
      } else {
        return [...prev, course];
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourses([...courses]);
  };

  const deselectAllCourses = () => {
    setSelectedCourses([]);
  };

  const filteredAssignments = assignments
    .filter(a => !ignoredAssignments.includes(a.id))
    .filter(a => a.status !== "completed") // Don't show completed assignments
    .filter(a => {
      // If no courses selected, show nothing
      if (selectedCourses.length === 0) return false;
      // Check if assignment's course is in selected courses
      return selectedCourses.some(course => a.courseName.startsWith(course));
    })
    .filter(a => selectedStatus === "All" || a.status === selectedStatus.toLowerCase())
    .sort((a, b) => {
      // Sort by due date (earliest first)
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });

  const handleIgnoreAssignment = (id: number) => {
    setIgnoredAssignments(prev => {
      const updated = [...prev, id];
      localStorage.setItem('ignoredAssignments', JSON.stringify(updated));
      return updated;
    });
  };

  const getStatusBadge = (status: string, daysUntilDue: number) => {
    if (status === "completed") {
      return (
        <div className="flex items-center gap-1 bg-[rgba(34,197,94,0.2)] text-[#22c55e] px-2.5 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Completed</span>
        </div>
      );
    }
    if (status === "missing") {
      return (
        <div className="flex items-center gap-1 bg-[rgba(239,68,68,0.2)] text-[#ef4444] px-2.5 py-1 rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Missing</span>
        </div>
      );
    }
    if (status === "urgent" || daysUntilDue <= 1) {
      return (
        <div className="flex items-center gap-1 bg-[rgba(245,158,11,0.2)] text-[#f59e0b] px-2.5 py-1 rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Due Soon</span>
        </div>
      );
    }
    return (
      <div className="px-2.5 py-1 rounded-full" style={{ backgroundColor: accentColor.primary + "33", color: accentColor.primary }}>
        <span className="text-xs font-medium">Upcoming</span>
      </div>
    );
  };

  const { colors, accentColor } = useTheme();

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/canvas-classes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </motion.button>
              </Link>
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Assignments</h1>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(!showFilter)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accentColor.primary }}
            >
              <Filter className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
            >
              {/* Course Filter */}
              <div className="mb-4">
                <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Filter by Course</p>
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={selectAllCourses}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                    style={selectedCourses.length === courses.length
                      ? { backgroundColor: accentColor.primary, color: "white" }
                      : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                    }
                  >
                    <span className="text-sm font-medium">Select All</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={deselectAllCourses}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                    style={selectedCourses.length === 0
                      ? { backgroundColor: accentColor.primary, color: "white" }
                      : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                    }
                  >
                    <span className="text-sm font-medium">Deselect All</span>
                  </motion.button>
                  {courses.map((course) => (
                    <motion.button
                      key={course}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCourse(course)}
                      className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                      style={selectedCourses.includes(course)
                        ? { backgroundColor: accentColor.primary, color: "white" }
                        : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                      }
                    >
                      <span className="text-sm font-medium">{course}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Filter by Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <motion.button
                      key={status}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStatus(status)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={selectedStatus === status
                        ? { backgroundColor: accentColor.primary, color: "white" }
                        : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                      }
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(selectedCourses.length < courses.length || selectedStatus !== "All") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              <span className="text-sm" style={{ color: colors.textSecondary }}>Active filters:</span>
              {selectedCourses.length < courses.length && (
                <div className="px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: accentColor.primary }}>
                  <span className="text-xs font-medium text-white">{selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}</span>
                  <button
                    onClick={selectAllCourses}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedStatus !== "All" && (
                <div className="px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: accentColor.primary }}>
                  <span className="text-xs font-medium text-white">{selectedStatus}</span>
                  <button
                    onClick={() => setSelectedStatus("All")}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Assignments List */}
        <div className="px-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: -300,
                    transition: { duration: 0.25 }
                  }}
                  layout
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
                >
                  {/* Header with Course and Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: assignment.courseColor }}
                      />
                      <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                        {assignment.courseName}
                      </span>
                    </div>
                    {getStatusBadge(assignment.status, assignment.daysUntilDue)}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold mb-3" style={{ color: colors.textPrimary }}>
                    {assignment.title}
                  </h3>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Calendar className="w-4 h-4" style={{ color: accentColor.primary }} />
                    <div>
                      <span className="font-medium" style={{ color: colors.textPrimary }}>Due: </span>
                      <span style={{ color: colors.textSecondary }}>{assignment.dueDateFull}</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="mb-3">
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {assignment.status === "completed" 
                        ? `${assignment.score}/${assignment.points} points`
                        : `${assignment.points} points possible`
                      }
                    </span>
                  </div>

                  {/* Instructions */}
                  <div className="rounded-lg p-3 border mb-3" style={{ backgroundColor: colors.bgPrimary, borderColor: colors.borderPrimary }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: colors.textPrimary }}>Instructions:</p>
                    <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                      {assignment.instructions}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {assignment.status !== "completed" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 bg-gradient-to-r ${accentColor.gradient} text-white py-3 rounded-xl font-semibold`}
                      >
                        {assignment.status === "missing" ? "Submit Late" : "Start Assignment"}
                      </motion.button>
                    )}
                    
                    {/* Ignore Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleIgnoreAssignment(assignment.id)}
                      className={`${assignment.status !== "completed" ? "w-auto px-4" : "w-full"} py-3 rounded-xl font-medium border transition-colors`}
                      style={{ backgroundColor: colors.bgPrimary, color: colors.textSecondary, borderColor: colors.borderPrimary }}
                    >
                      Ignore
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl p-8 border text-center"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
              >
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  No assignments found with the selected filters
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}