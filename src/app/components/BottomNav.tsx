import { motion } from "motion/react";
import { Home, Users, Calendar, MessageCircle, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface BottomNavProps {
  currentPage?: string;
}

// Persists the last active main tab across renders/navigations
let lastActiveMainTab = "home";

// Canvas Logo Component
function CanvasLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2ZM21 20H3V4H21V20Z" />
      <path d="M7 17H9V7H7V17ZM11 17H13V7H11V17ZM15 17H17V7H15V17Z" />
    </svg>
  );
}

// Paths that are "overlay" pages — should not change the highlighted tab
const OVERLAY_PATHS = [
  "/profile",
  "/progress",
  "/settings",
  "/learning-quiz",
  "/notes",
  "/community",
  "/privacy",
  "/landing",
  "/well-being",
];

// Map any pathname to a tab id
function pathToTab(p: string): string {
  if (p === "/notes" || p === "/community" || p === "/privacy" || p === "/landing") return "home";
  if (p === "/home") return "home";
  if (p === "/tutors" || p.startsWith("/tutor/") || p === "/booking" || p === "/tutor-students") return "tutors";
  if (p === "/schedule" || p === "/video-session" || p === "/rate-session" || p === "/tutor-availability") return "schedule";
  if (p === "/chat" || p.startsWith("/chat/")) return "chat";
  if (p === "/canvas-classes" || p === "/canvas-login" || p === "/announcements" || p === "/assignments") return "canvas";
  if (p === "/tutor-analytics") return "analytics";
  return "home";
}

export function BottomNav({ currentPage }: BottomNavProps) {
  const location = useLocation();
  // Read synchronously — no useState/useEffect so there's no render-delay flicker
  const isCanvasConnected = localStorage.getItem("canvasConnected") === "true";
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();

  // Determine which tab should be active
  const determineActivePage = (): string => {
    const path = location.pathname;

    if (currentPage) {
      // Record the active main tab whenever we're not on an overlay page
      if (currentPage !== "profile") {
        lastActiveMainTab = currentPage;
      }
      return currentPage;
    }

    // On overlay pages, keep the last remembered main tab highlighted
    if (OVERLAY_PATHS.includes(path)) {
      return lastActiveMainTab;
    }

    // On a main/sub page, record and return the active tab
    const tab = pathToTab(path);
    lastActiveMainTab = tab;
    return tab;
  };

  const current = determineActivePage();

  // Different nav items for tutors vs students
  const isTutor = user?.role === "tutor" || user?.role === "admin";

  const studentNavItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { 
      id: "canvas", 
      label: "Courses", 
      icon: CanvasLogo, 
      path: isCanvasConnected ? "/canvas-classes" : "/canvas-login",
      isCanvas: true,
      muted: !isCanvasConnected
    },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "tutors", label: "Tutors", icon: Users, path: "/tutors" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
  ];

  const tutorNavItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "tutors", label: "Students", icon: Users, path: "/tutor-students" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/tutor-analytics" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
  ];

  const navItems = isTutor ? tutorNavItems : studentNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t z-50" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderPrimary }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.id;
            const isMuted = item.muted;

            const content = (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5 cursor-pointer min-w-[48px]"
              >
                <div
                  className="transition-colors"
                  style={{ color: isActive ? accentColor.primary : isMuted ? colors.textTertiary : colors.textSecondary }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? accentColor.primary : isMuted ? colors.textTertiary : colors.textSecondary }}
                >
                  {item.label}
                </span>
              </motion.div>
            );

            return (
              <Link key={item.id} to={item.path}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}