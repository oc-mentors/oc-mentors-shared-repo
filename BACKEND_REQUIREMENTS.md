# Backend Requirements for Socratic OC Project

This document outlines all backend endpoints, handlers, and data management needed based on the frontend implementation.

## Table of Contents
1. [Authentication & User Management](#authentication--user-management)
2. [Tutors Management](#tutors-management)
3. [Sessions & Scheduling](#sessions--scheduling)
4. [Messaging/Chat](#messagingchat)
5. [Canvas Integration](#canvas-integration)
6. [Progress Tracking](#progress-tracking)
7. [Learning Style Quiz](#learning-style-quiz)
8. [Reviews & Ratings](#reviews--ratings)
9. [Resources & Recommendations](#resources--recommendations)
10. [Settings & Profile](#settings--profile)

---

## 1. Authentication & User Management

### Endpoints Needed:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/refresh` - Refresh authentication token

### Data Models:
```typescript
User {
  id: number
  name: string
  email: string
  password: string (hashed)
  avatar: string (URL)
  university: string
  major: string
  year: string (e.g., "2nd Year")
  memberSince: Date
  createdAt: Date
  updatedAt: Date
}
```

### Handlers:
- User registration with email validation
- Password hashing (bcrypt)
- JWT token generation and validation
- Session management
- Profile image upload handling

---

## 2. Tutors Management

### Endpoints Needed:
- `GET /api/tutors` - Get all tutors (with filters: subject, search query)
- `GET /api/tutors/:id` - Get tutor details
- `GET /api/tutors/search` - Search tutors by name/subject
- `GET /api/tutors/subjects` - Get available subjects
- `POST /api/tutors` - Create tutor profile (admin/tutor)
- `PUT /api/tutors/:id` - Update tutor profile
- `GET /api/tutors/:id/availability` - Get tutor availability
- `GET /api/tutors/:id/reviews` - Get tutor reviews

### Data Models:
```typescript
Tutor {
  id: number
  userId: number (FK to User)
  name: string
  avatar: string
  university: string
  major: string
  subjects: string[] (e.g., ["Math", "Chemistry"])
  learningStyle: string (e.g., "Visual Learning")
  rating: number (average)
  reviewCount: number
  priceLevel: string ("$", "$$", "$$$")
  pricePerHour: number
  bio: string
  availability: string[] (e.g., ["Mon 2-5pm", "Wed 2-5pm"])
  totalSessions: number
  responseTime: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

Subject {
  id: number
  name: string
  icon: string
  gradient: string
  color: string
}
```

### Handlers:
- Tutor search and filtering logic
- Subject-based filtering
- Rating calculation (average from reviews)
- Availability management
- Tutor profile CRUD operations

---

## 3. Sessions & Scheduling

### Endpoints Needed:
- `GET /api/sessions` - Get user's sessions (upcoming/past)
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Book a new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Cancel session
- `POST /api/sessions/:id/cancel` - Cancel with reason
- `GET /api/sessions/calendar` - Get calendar events
- `POST /api/sessions/recurring` - Create recurring class
- `POST /api/sessions/study` - Create study session
- `POST /api/sessions/study/:id/invite` - Invite users to study session
- `GET /api/sessions/:id/join-link` - Get video session join link
- `POST /api/sessions/:id/complete` - Mark session as completed

### Data Models:
```typescript
Session {
  id: number
  studentId: number (FK to User)
  tutorId: number (FK to Tutor)
  subject: string
  date: Date
  time: string
  duration: string (e.g., "1 hour")
  status: "upcoming" | "completed" | "cancelled"
  type: "class" | "study"
  location: string (Zoom link or physical location)
  videoLink: string
  cancelReason?: string
  cancelledAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

RecurringClass {
  id: number
  studentId: number
  tutorId?: number
  subject: string
  dayOfWeek: number (0-6)
  time: string
  duration: string
  startDate: Date
  endDate: Date
  location: string
  createdAt: Date
}

StudySession {
  id: number
  creatorId: number (FK to User)
  subject: string
  date: Date
  time: string
  duration: string
  location: string
  participants: number[] (FK to User)
  createdAt: Date
}

CalendarEvent {
  id: number
  userId: number
  type: "class" | "study"
  title: string
  startTime: Date
  endTime: Date
  tutor?: string
  participants?: string[]
  color: string
}
```

### Handlers:
- Session booking validation (check tutor availability)
- Calendar event generation
- Recurring session creation (generate multiple sessions)
- Study session invitation system
- Video session link generation (Zoom/Google Meet integration)
- Session cancellation with reason tracking
- Session completion tracking

---

## 4. Messaging/Chat

### Endpoints Needed:
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:id` - Get conversation details
- `GET /api/conversations/:id/messages` - Get messages for conversation
- `POST /api/conversations/:id/messages` - Send message
- `POST /api/conversations` - Create new conversation
- `PUT /api/conversations/:id` - Update conversation (pin, mark read/unread)
- `DELETE /api/conversations/:id` - Delete conversation
- `POST /api/messages/:id/attachments` - Upload file/image attachment
- `GET /api/messages/:id/attachments/:fileId` - Get attachment

### Data Models:
```typescript
Conversation {
  id: number
  userId: number (FK to User)
  participantId: number (FK to User - tutor/peer/professor)
  name: string
  avatar: string
  university: string
  lastMessage: string
  lastMessageTime: Date
  unread: boolean
  pinned: boolean
  pinnedAt?: Date
  role: "tutor" | "professor" | "ta" | "peer"
  createdAt: Date
  updatedAt: Date
}

Message {
  id: number
  conversationId: number (FK to Conversation)
  senderId: number (FK to User)
  text: string
  time: Date
  isSent: boolean
  attachments?: Attachment[]
  createdAt: Date
}

Attachment {
  id: number
  messageId: number (FK to Message)
  type: "image" | "file"
  url: string
  name: string
  size: number
  createdAt: Date
}
```

### Handlers:
- Real-time messaging (WebSocket/Server-Sent Events)
- Message delivery status
- File/image upload handling (S3/cloud storage)
- Conversation search
- Unread message counting
- Pin/unpin conversation logic
- Message pagination for long conversations

---

## 5. Canvas Integration

### Endpoints Needed:
- `POST /api/canvas/connect` - Connect Canvas account
- `GET /api/canvas/status` - Check Canvas connection status
- `POST /api/canvas/disconnect` - Disconnect Canvas account
- `GET /api/canvas/courses` - Get Canvas courses
- `GET /api/canvas/courses/:id` - Get course details
- `GET /api/canvas/announcements` - Get announcements
- `GET /api/canvas/assignments` - Get assignments
- `GET /api/canvas/assignments/:id` - Get assignment details
- `POST /api/canvas/sync` - Manual sync with Canvas API

### Data Models:
```typescript
CanvasConnection {
  id: number
  userId: number (FK to User)
  canvasEmail: string
  canvasToken: string (encrypted)
  isConnected: boolean
  lastSyncAt: Date
  createdAt: Date
}

CanvasCourse {
  id: number
  userId: number
  canvasCourseId: string
  name: string
  code: string
  color: string
  createdAt: Date
}

Announcement {
  id: number
  courseId: number (FK to CanvasCourse)
  title: string
  content: string
  timestamp: Date
  date: Date
  createdAt: Date
}

Assignment {
  id: number
  courseId: number (FK to CanvasCourse)
  title: string
  instructions: string
  dueDate: Date
  points: number
  status: "upcoming" | "urgent" | "completed" | "missing"
  score?: number
  daysUntilDue: number
  createdAt: Date
}
```

### Handlers:
- Canvas OAuth integration
- Canvas API token management (encryption)
- Periodic sync with Canvas API
- Announcement fetching and parsing
- Assignment fetching with due date calculations
- Course enrollment sync

---

## 6. Progress Tracking

### Endpoints Needed:
- `GET /api/progress` - Get user's overall progress
- `GET /api/progress/subjects` - Get progress by subject
- `GET /api/progress/subjects/:subjectId` - Get detailed subject progress
- `POST /api/progress/tasks` - Add completed task
- `PUT /api/progress/tasks/:id` - Update task status
- `GET /api/progress/achievements` - Get user achievements
- `POST /api/progress/achievements` - Award achievement
- `GET /api/progress/stats` - Get progress statistics (lessons taken, hours studied, GPA)

### Data Models:
```typescript
Progress {
  id: number
  userId: number (FK to User)
  subjectId: number (FK to Subject)
  progressPercentage: number
  lessonsCompleted: number
  totalLessons: number
  color: string
  createdAt: Date
  updatedAt: Date
}

Task {
  id: number
  userId: number
  subjectId: number
  title: string
  description: string
  estimatedTime: string
  status: "pending" | "in-progress" | "completed"
  completedAt?: Date
  createdAt: Date
}

Achievement {
  id: number
  userId: number
  title: string
  icon: string
  date: Date
  createdAt: Date
}

ProgressStats {
  userId: number
  lessonsTaken: number
  hoursStudied: number
  currentGPA: number
  updatedAt: Date
}
```

### Handlers:
- Progress calculation logic
- Task completion tracking
- Achievement system (badges, milestones)
- Statistics aggregation
- Learning plan generation

---

## 7. Learning Style Quiz

### Endpoints Needed:
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/result` - Get user's learning style result
- `PUT /api/users/:id/learning-style` - Update user's learning style

### Data Models:
```typescript
QuizQuestion {
  id: number
  question: string
  options: string[]
  learningStyleMapping: number[] (maps option index to learning style)
}

QuizResult {
  id: number
  userId: number (FK to User)
  answers: number[] (array of selected option indices)
  result: "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic"
  completedAt: Date
}

LearningStyle {
  id: number
  name: string
  description: string
}
```

### Handlers:
- Quiz answer processing
- Learning style calculation algorithm
- Result storage and retrieval
- Tutor matching based on learning style

---

## 8. Reviews & Ratings

### Endpoints Needed:
- `POST /api/reviews` - Submit review for session
- `GET /api/tutors/:id/reviews` - Get tutor reviews
- `GET /api/reviews/:id` - Get review details
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/user/:userId` - Get user's reviews

### Data Models:
```typescript
Review {
  id: number
  sessionId: number (FK to Session)
  tutorId: number (FK to Tutor)
  studentId: number (FK to User)
  rating: number (1-5)
  review: string
  tags: string[] (e.g., ["Clear explanations", "Patient"])
  createdAt: Date
  updatedAt: Date
}
```

### Handlers:
- Review submission validation
- Rating calculation for tutors
- Review moderation (if needed)
- Tag aggregation

---

## 9. Resources & Recommendations

### Endpoints Needed:
- `GET /api/resources` - Get recommended resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Add resource (admin)
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `GET /api/resources/recommended` - Get personalized recommendations

### Data Models:
```typescript
Resource {
  id: number
  title: string
  image: string (URL)
  url: string
  subject: string
  type: "article" | "video" | "practice" | "other"
  createdAt: Date
}
```

### Handlers:
- Resource recommendation algorithm (based on user subjects/progress)
- Resource categorization
- Resource search

---

## 10. Settings & Profile

### Endpoints Needed:
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/avatar` - Upload profile avatar
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `POST /api/settings/notifications` - Update notification preferences

### Data Models:
```typescript
UserSettings {
  id: number
  userId: number (FK to User)
  notifications: {
    email: boolean
    push: boolean
    sessionReminders: boolean
    messages: boolean
  }
  theme: "light" | "dark"
  language: string
  updatedAt: Date
}
```

### Handlers:
- Profile update validation
- Avatar image upload handling
- Settings persistence
- Notification preference management

---

## Additional Backend Requirements

### Real-time Features:
- WebSocket server for live chat
- Real-time session notifications
- Live session status updates

### File Storage:
- Image upload handling (avatars, attachments)
- File storage integration (AWS S3, Cloudinary, etc.)
- Image resizing/optimization

### Email/SMS Notifications:
- Session reminders
- Booking confirmations
- Message notifications
- Assignment due date reminders

### Payment Integration (if needed):
- Stripe/PayPal integration for tutor payments
- Payment processing
- Transaction history

### Analytics & Reporting:
- User engagement metrics
- Tutor performance analytics
- Session completion rates
- Learning progress analytics

### Security:
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Authentication middleware
- Role-based access control (RBAC)

### Database Schema:
- User table
- Tutor table
- Session table
- Conversation table
- Message table
- Review table
- Progress table
- Canvas integration tables
- Settings table

### Background Jobs:
- Canvas sync scheduler
- Session reminder emails
- Assignment due date notifications
- Progress calculation updates
- Rating recalculation

---

## Summary

**Total Endpoints Needed: ~60-70 endpoints**

**Key Features:**
1. User authentication and profile management
2. Tutor discovery and management
3. Session booking and scheduling
4. Real-time messaging
5. Canvas LMS integration
6. Progress tracking and analytics
7. Learning style assessment
8. Review and rating system
9. Resource recommendations
10. Settings and preferences

**Technologies Recommended:**
- Node.js/Express or Python/Django/FastAPI
- PostgreSQL or MongoDB
- Redis (for caching and sessions)
- WebSocket (Socket.io or similar)
- AWS S3 or Cloudinary (for file storage)
- Canvas API integration
- Email service (SendGrid, AWS SES)
- JWT for authentication
