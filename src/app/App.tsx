import { HashRouter, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";
import { ConversationsProvider } from "./contexts/ConversationsContext";
import HomePage from "./pages/HomePage";
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

export default function App() {
  return (
    <HashRouter>
      <ConversationsProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/learning-quiz" element={<LearningStyleQuizPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/chat" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat/:id" element={<ChatConversationPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/tutor/:id" element={<TutorDetailPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/past-lessons" element={<PastLessonsPage />} />
          <Route path="/video-session" element={<VideoSessionPage />} />
          <Route path="/rate-session" element={<RateSessionPage />} />
          <Route path="/canvas-login" element={<CanvasLoginPage />} />
          <Route path="/canvas-classes" element={<CanvasClassesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/book-session" element={<BookSessionPage />} />
          <Route path="/book-session/:subject" element={<SubjectTutorsPage />} />
        </Routes>
      </ConversationsProvider>
    </HashRouter>
  );
}