import { LoginAnimation } from "./components/LoginAnimation";
import { LogoutAnimation } from "./components/LogoutAnimation";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LearningComfortProvider } from "./contexts/LearningComfortContext";
import { CalendarProvider } from "./contexts/CalendarContext";
import { CanvasAuthProvider } from "./contexts/CanvasAuthContext";
import { CanvasCoursesProvider } from "./contexts/CanvasCoursesContext";
import { ConversationsProvider } from "./contexts/ConversationsContext";
import { TutorsProvider } from "./contexts/TutorsContext";
import { CanvasSyncManager } from "./components/CanvasSyncManager";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TutorHomePage from "./pages/TutorHomePage";
import TutorStudentsPage from "./pages/TutorStudentsPage";
import TutorAvailabilityPage from "./pages/TutorAvailabilityPage";
import TutorAnalyticsPage from "./pages/TutorAnalyticsPage";
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
import WellBeingPage from "./pages/WellBeingPage";

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <TutorsProvider>
          <ConversationsProvider>
            <ThemeProvider>
              <LearningComfortProvider>
              <CalendarProvider>
                <CanvasAuthProvider>
                  <CanvasCoursesProvider>
                    <CanvasSyncManager />
                    <ScrollToTop />
                    <SafeAppRoutes />
                  </CanvasCoursesProvider>
                </CanvasAuthProvider>
              </CalendarProvider>
              </LearningComfortProvider>
            </ThemeProvider>
          </ConversationsProvider>
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
  const { isAuthenticated, isLoading, user, profileLoaded, showLoginAnimation, clearLoginAnimation, showLogoutAnimation, clearLogoutAnimation } = useAuth();

  // Redirect to Learning Style Quiz first when user has no quiz result (app start or after signup)
  useEffect(() => {
    if (!user || !profileLoaded || user.learningStyle) return;
    const pathname = location.pathname || "/";
    if (pathname === "/learning-quiz" || pathname === "/login" || pathname === "/splash") return;
    navigate("/learning-quiz", { replace: true });
  }, [user, profileLoaded, location.pathname, navigate]);

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
        {/* Redirect root to login or home based on auth status */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
        />
        
        {/* Splash page (optional, can be accessed directly) */}
        <Route path="/splash" element={<SplashPage />} />
        
        {/* Login page - redirect to home if already authenticated */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} 
        />
        
        {/* Protected Routes */}
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/progress" element={isAuthenticated ? <ProgressPage /> : <Navigate to="/login" replace />} />
        <Route path="/learning-quiz" element={isAuthenticated ? <LearningStyleQuizPage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={isAuthenticated ? <MessagesPage /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/chat/:id" element={isAuthenticated ? <ChatConversationPage /> : <Navigate to="/login" replace />} />
        <Route path="/booking" element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" replace />} />
        <Route path="/tutors" element={isAuthenticated ? <TutorsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tutor/:id" element={isAuthenticated ? <TutorDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="/schedule" element={isAuthenticated ? <SchedulePage /> : <Navigate to="/login" replace />} />
        <Route path="/past-lessons" element={isAuthenticated ? <PastLessonsPage /> : <Navigate to="/login" replace />} />
        <Route path="/video-session" element={isAuthenticated ? <VideoSessionPage /> : <Navigate to="/login" replace />} />
        <Route path="/rate-session" element={isAuthenticated ? <RateSessionPage /> : <Navigate to="/login" replace />} />
        <Route path="/canvas-login" element={isAuthenticated ? <CanvasLoginPage /> : <Navigate to="/login" replace />} />
        <Route path="/canvas-classes" element={isAuthenticated ? <CanvasClassesPage /> : <Navigate to="/login" replace />} />
        <Route path="/announcements" element={isAuthenticated ? <AnnouncementsPage /> : <Navigate to="/login" replace />} />
        <Route path="/assignments" element={isAuthenticated ? <AssignmentsPage /> : <Navigate to="/login" replace />} />
        <Route path="/book-session" element={isAuthenticated ? <BookSessionPage /> : <Navigate to="/login" replace />} />
        <Route path="/book-session/:subject" element={isAuthenticated ? <SubjectTutorsPage /> : <Navigate to="/login" replace />} />
        <Route path="/course/:courseId/notifications" element={isAuthenticated ? <CourseNotificationSettingsPage /> : <Navigate to="/login" replace />} />
        <Route path="/theme-customization" element={isAuthenticated ? <ThemeCustomizationPage /> : <Navigate to="/login" replace />} />
        <Route path="/academic-info" element={isAuthenticated ? <AcademicInfoPage /> : <Navigate to="/login" replace />} />
        <Route path="/well-being" element={isAuthenticated ? <WellBeingPage /> : <Navigate to="/login" replace />} />
        
        {/* Tutor-specific Routes */}
        <Route path="/tutor-students" element={isAuthenticated ? <TutorStudentsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tutor-availability" element={isAuthenticated ? <TutorAvailabilityPage /> : <Navigate to="/login" replace />} />
        <Route path="/tutor-analytics" element={isAuthenticated ? <TutorAnalyticsPage /> : <Navigate to="/login" replace />} />
        
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