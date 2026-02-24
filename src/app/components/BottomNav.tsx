import { motion } from "motion/react";
import { Home, Users, Calendar, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

interface BottomNavProps {
  currentPage?: string;
}

// Canvas Logo Component
function CanvasLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2ZM21 20H3V4H21V20Z" />
      <path d="M7 17H9V7H7V17ZM11 17H13V7H11V17ZM15 17H17V7H15V17Z" />
    </svg>
  );
}

export function BottomNav({ currentPage }: BottomNavProps) {
  const location = useLocation();
  const [isCanvasConnected, setIsCanvasConnected] = useState(false);

  // Check Canvas connection status from localStorage
  useEffect(() => {
    const connected = localStorage.getItem("canvasConnected") === "true";
    setIsCanvasConnected(connected);
  }, [location.pathname]);

  // Determine which tab should be active based on the current route
  const determineActivePage = () => {
    if (currentPage) return currentPage;
    
    const path = location.pathname;
    
    // Profile pages - check if we have a stored previous tab
    if (path === "/profile" || path === "/progress" || path === "/settings" || path === "/learning-quiz") {
      const previousTab = localStorage.getItem("previousPageBeforeProfile");
      
      // Map the previous page path to a tab ID
      if (previousTab === "/") return "home";
      if (previousTab === "/tutors" || previousTab?.startsWith("/tutor/") || previousTab === "/booking") return "tutors";
      if (previousTab === "/schedule" || previousTab === "/video-session" || previousTab === "/rate-session") return "schedule";
      if (previousTab === "/chat" || previousTab?.startsWith("/chat/")) return "chat";
      if (previousTab === "/canvas-classes" || previousTab === "/canvas-login" || previousTab === "/announcements" || previousTab === "/assignments") return "canvas";
      
      // Default to home if no previous page stored
      return "home";
    }
    
    // Home pages
    if (path === "/") return "home";
    
    // Tutors pages
    if (path === "/tutors" || path.startsWith("/tutor/") || path === "/booking") return "tutors";
    
    // Schedule pages
    if (path === "/schedule" || path === "/video-session" || path === "/rate-session") return "schedule";
    
    // Chat pages
    if (path === "/chat" || path.startsWith("/chat/")) return "chat";

    // Canvas pages (including announcements and assignments)
    if (path === "/canvas-classes" || path === "/canvas-login" || path === "/announcements" || path === "/assignments") return "canvas";
    
    return "home";
  };
  
  const current = determineActivePage();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "tutors", label: "Tutors", icon: Users, path: "/tutors" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { 
      id: "canvas", 
      label: isCanvasConnected ? "Classes" : "Canvas", 
      icon: CanvasLogo, 
      path: isCanvasConnected ? "/canvas-classes" : "/canvas-login",
      isCanvas: true,
      muted: !isCanvasConnected
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e2139] border-t border-[rgba(255,255,255,0.08)] z-50">
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
                  className={`transition-colors ${
                    isActive ? "text-[#5b7ceb]" : isMuted ? "text-[#6b7280]" : "text-[#a8b3cf]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-[#5b7ceb]" : isMuted ? "text-[#6b7280]" : "text-[#a8b3cf]"
                  }`}
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