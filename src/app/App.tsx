import { LoginAnimation } from "./components/LoginAnimation";
import { LogoutAnimation } from "./components/LogoutAnimation";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LearningComfortProvider } from "./contexts/LearningComfortContext";
import { DemoModeProvider } from "./contexts/DemoModeContext";
import { DemoAppScrollShell } from "./components/DemoAppScrollShell";
import { DEMO_STORAGE_KEY } from "./lib/demoExpoConfig";
import { CalendarProvider } from "./contexts/CalendarContext";
import { CanvasAuthProvider } from "./contexts/CanvasAuthContext";
import { CanvasCoursesProvider } from "./contexts/CanvasCoursesContext";
import { ConversationsProvider } from "./contexts/ConversationsContext";
import { ConnectionsProvider } from "./contexts/ConnectionsContext";
import { TutorRequestsProvider } from "./contexts/TutorRequestsContext";
import { TutorsProvider } from "./contexts/TutorsContext";
import { CanvasSyncManager } from "./components/CanvasSyncManager";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TutorHomePage from "./pages/TutorHomePage";
import TutorStudentsPage from "./pages/TutorStudentsPage";
import TutorRequestsPage from "./pages/TutorRequestsPage";
import TutorVerificationPage from "./pages/TutorVerificationPage";
import TutorAvailabilityPage from "./pages/TutorAvailabilityPage";
import TutorAnalyticsPage from "./pages/TutorAnalyticsPage";
import TutorOnboardingQuizPage from "./pages/TutorOnboardingQuizPage";
import ProgressPage from "./pages/ProgressPage";
import LearningStyleQuizPage from "./pages/LearningStyleQuizPage";
import SettingsPage from "./pages/SettingsPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import ChatConversationPage from "./pages/ChatConversationPage";
import BookingPage from "./pages/BookingPage";
import TutorsPage from "./pages/TutorsPage";
import TutorDetailPage from "./pages/TutorDetailPage";
import SchedulePage from "./pages/SchedulePage";
import VideoSessionPage from "./pages/VideoSessionPage";
import RateSessionPage from "./pages/RateSessionPage";
import CanvasClassesPage from "./pages/CanvasClassesPage";
import CanvasLoginPage from "./pages/CanvasLoginPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import PastLessonsPage from "./pages/PastLessonsPage";
import BookSessionPage from "./pages/BookSessionPage";
import SubjectTutorsPage from "./pages/SubjectTutorsPage";
import CourseNotificationSettingsPage from "./pages/CourseNotificationSettingsPage";
import ThemeCustomizationPage from "./pages/ThemeCustomizationPage";
import AcademicInfoPage from "./pages/AcademicInfoPage";
import YouTubeViewerPage from "./pages/YouTubeViewerPage";
import LandingPage from "./pages/LandingPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotesPage from "./pages/NotesPage";
import CommunityPage from "./pages/CommunityPage";
import WellBeingPage from "./pages/WellBeingPage";
import { Toaster } from "sonner";
import { useTheme } from "./contexts/ThemeContext";

function ThemedToaster() {
  const { mode } = useTheme();
  return <Toaster richColors position="top-center" theme={mode === "light" ? "light" : "dark"} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <TutorsProvider>
          <ConnectionsProvider>
          <TutorRequestsProvider>
          <ConversationsProvider>
            <ThemeProvider>
              <LearningComfortProvider>
              <CalendarProvider>
                <CanvasAuthProvider>
                  <CanvasCoursesProvider>
                    <DemoModeProvider>
                      <CanvasSyncManager />
                      <ScrollToTop />
                      <ThemedToaster />
                      <DemoAppScrollShell>
                        <SafeAppRoutes />
                      </DemoAppScrollShell>
                    </DemoModeProvider>
                  </CanvasCoursesProvider>
                </CanvasAuthProvider>
              </CalendarProvider>
              </LearningComfortProvider>
            </ThemeProvider>
          </ConversationsProvider>
          </TutorRequestsProvider>
          </ConnectionsProvider>
          </TutorsProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

function SafeAppRoutes() {
  try {
    return <AppRoutes />;
  } catch (error) {
    // Handle hot reload error gracefully
    console.error("Route error (likely hot reload):", error);
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    user,
    showLoginAnimation,
    clearLoginAnimation,
    showLogoutAnimation,
    clearLogoutAnimation,
  } = useAuth();

  const isExpoDemo =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem(DEMO_STORAGE_KEY) === "1";
  // Require the learning style quiz only for students who don't have a result yet.
  const needsQuiz =
    !!user && user.role === "student" && !user.learningStyle && !isExpoDemo;
  // Require the tutor onboarding quiz only for tutors who haven't completed it yet.
  const needsTutorOnboarding = !!user && user.role === "tutor" && !user.tutorOnboardingCompleted;

  const guardProtected = (element: JSX.Element) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (needsTutorOnboarding && location.pathname !== "/tutor-onboarding") {
      return <Navigate to="/tutor-onboarding" replace />;
    }
    if (needsQuiz && location.pathname !== "/learning-quiz") {
      return <Navigate to="/learning-quiz" replace />;
    }
    return element;
  };

  // Redirect to Learning Style Quiz when a student has no quiz result yet
  useEffect(() => {
    if (!needsQuiz) return;
    const pathname = location.pathname || "/";
    if (pathname === "/learning-quiz" || pathname === "/login" || pathname === "/splash") return;
    navigate("/learning-quiz", { replace: true });
  }, [needsQuiz, location.pathname, navigate]);

  // Redirect tutors to tutor onboarding when they haven't completed it yet
  useEffect(() => {
    if (!needsTutorOnboarding) return;
    const pathname = location.pathname || "/";
    if (pathname === "/tutor-onboarding" || pathname === "/login" || pathname === "/splash") return;
    navigate("/tutor-onboarding", { replace: true });
  }, [needsTutorOnboarding, location.pathname, navigate]);

  // Auto-dismiss the login animation after 1.3 s, then AnimatePresence fades it out over 0.55 s
  useEffect(() => {
    if (!showLoginAnimation) return;
    const t = setTimeout(clearLoginAnimation, 1300);
    return () => clearTimeout(t);
  }, [showLoginAnimation, clearLoginAnimation]);

  // Auto-dismiss the logout animation after 1.3 s, then AnimatePresence fades it out over 0.55 s
  useEffect(() => {
    if (!showLogoutAnimation) return;
    const t = setTimeout(clearLogoutAnimation, 1300);
    return () => clearTimeout(t);
  }, [showLogoutAnimation, clearLogoutAnimation]);

  // Debug: Safari → Develop → iPhone → WebView → filter "Socratic OC"
  useEffect(() => {
    if (isLoading) {
      console.log("[Socratic OC] UI: auth loading spinner visible", { path: location.pathname });
    } else {
      console.log("[Socratic OC] UI: auth loading done", {
        path: location.pathname,
        isAuthenticated,
      });
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  // Show a loading screen while checking auth state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Redirect root based on auth status and quiz/onboarding needs */}
        <Route 
          path="/" 
          element={
            <Navigate
              to={
                isAuthenticated
                  ? user?.role === "tutor"
                    ? needsTutorOnboarding
                      ? "/tutor-onboarding"
                      : "/home"
                    : needsQuiz
                      ? "/learning-quiz"
                      : "/home"
                  : "/login"
              }
              replace
            />
          } 
        />
        
        {/* Splash page (optional, can be accessed directly) */}
        <Route path="/splash" element={<SplashPage />} />

        <Route path="/landing" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* Login page - redirect tutors to tutor quiz (once), students to learning quiz/home */}
        <Route 
          path="/login" 
          element={
            isAuthenticated
              ? (
                <Navigate
                  to={
                    user?.role === "tutor"
                      ? needsTutorOnboarding
                        ? "/tutor-onboarding"
                        : "/home"
                      : needsQuiz
                        ? "/learning-quiz"
                        : "/home"
                  }
                  replace
                />
              )
              : <LoginPage />
          } 
        />
        
        {/* Protected Routes */}
        <Route path="/home" element={guardProtected(<HomePage />)} />
        <Route path="/progress" element={guardProtected(<ProgressPage />)} />
        <Route
          path="/learning-quiz"
          element={
            isAuthenticated
              ? showLoginAnimation
                ? null
                : <LearningStyleQuizPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/tutor-onboarding"
          element={isAuthenticated ? <TutorOnboardingQuizPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/settings" element={guardProtected(<SettingsPage />)} />
        <Route path="/chat" element={guardProtected(<MessagesPage />)} />
        <Route path="/profile" element={guardProtected(<ProfilePage />)} />
        <Route path="/chat/:id" element={guardProtected(<ChatConversationPage />)} />
        <Route path="/booking" element={guardProtected(<BookingPage />)} />
        <Route path="/tutors" element={guardProtected(<TutorsPage />)} />
        <Route path="/tutor/:id" element={guardProtected(<TutorDetailPage />)} />
        <Route path="/schedule" element={guardProtected(<SchedulePage />)} />
        <Route path="/past-lessons" element={guardProtected(<PastLessonsPage />)} />
        <Route path="/video-session" element={guardProtected(<VideoSessionPage />)} />
        <Route path="/rate-session" element={guardProtected(<RateSessionPage />)} />
        <Route path="/canvas-login" element={guardProtected(<CanvasLoginPage />)} />
        <Route path="/canvas-classes" element={guardProtected(<CanvasClassesPage />)} />
        <Route path="/announcements" element={guardProtected(<AnnouncementsPage />)} />
        <Route path="/assignments" element={guardProtected(<AssignmentsPage />)} />
        <Route path="/book-session" element={guardProtected(<BookSessionPage />)} />
        <Route path="/book-session/:subject" element={guardProtected(<SubjectTutorsPage />)} />
        <Route
          path="/course/:courseId/notifications"
          element={guardProtected(<CourseNotificationSettingsPage />)}
        />
        <Route path="/theme-customization" element={guardProtected(<ThemeCustomizationPage />)} />
        <Route path="/academic-info" element={guardProtected(<AcademicInfoPage />)} />
        <Route path="/watch" element={guardProtected(<YouTubeViewerPage />)} />
        <Route path="/notes" element={guardProtected(<NotesPage />)} />
        <Route path="/community" element={guardProtected(<CommunityPage />)} />
        <Route path="/well-being" element={guardProtected(<WellBeingPage />)} />
        
        {/* Tutor-specific Routes */}
        <Route path="/tutor-students" element={guardProtected(<TutorStudentsPage />)} />
        <Route path="/tutor-requests" element={guardProtected(<TutorRequestsPage />)} />
        <Route path="/tutor-verification" element={guardProtected(<TutorVerificationPage />)} />
        <Route path="/tutor-availability" element={guardProtected(<TutorAvailabilityPage />)} />
        <Route path="/tutor-analytics" element={guardProtected(<TutorAnalyticsPage />)} />
        
        {/* Catch-all: redirect to home or login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>

      <AnimatePresence>
        {showLoginAnimation && <LoginAnimation key="login-anim" />}
      </AnimatePresence>

      {/* Logout animation — fixed overlay, survives route changes */}
      <AnimatePresence>
        {showLogoutAnimation && <LogoutAnimation key="logout-anim" />}
      </AnimatePresence>
    </>
  );
}