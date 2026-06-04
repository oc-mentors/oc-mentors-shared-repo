/**
 * Firestore document types per Socratic OC Architecture Blueprint.
 * Top-level: users, studentProfiles, tutorProfiles, tutorVerifications,
 * tutorRequests, connections, conversations, reviews, sessions.
 */

import type { Timestamp } from "firebase/firestore";

// ---- users/{uid} ----
export interface UserRoles {
  student: boolean;
  tutor: boolean;
  admin: boolean;
}

export interface UserDoc {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  roles: UserRoles;
  university?: string;
  /** e.g. "Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other" */
  year?: string;
  /** One or more majors (e.g. ["Computer Science", "Math"]) */
  major?: string[];
  learningSupport?: {
    dscSupportLevel: "yes" | "maybe" | "no";
    conditions: string[];
    accommodations: string[];
    learningPreferences: string[];
    tutoringPreferences: string[];
    learningChallenges: string[];
  };
  /** Whether the tutor has completed the tutor onboarding quiz (set in users + tutorProfiles). */
  tutorOnboardingCompleted?: boolean;
  status: "active" | "inactive";
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ---- studentProfiles/{uid} ----
export interface StudentProfileDoc {
  uid: string;
  /** Denormalized from users for Firestore console / admin visibility */
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string | null;
  learningStyle?: string;
  learningStyleQuestionAnswers?: { question: string; answer: string }[];
  goals?: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ---- tutorProfiles/{uid} ----
export interface TutorProfileDoc {
  uid: string;
  /** Denormalized from users for list/inbox display */
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  headline?: string;
  bio?: string;
  major?: string;
  subjects: string[];
  pricePerHour?: number;
  priceCurrency?: string;
  priceLevel?: string;
  locationMode?: ("remote" | "in_person")[];
  responseTimeMinutes?: number;
  responseTime?: string;
  experienceLabel?: string;
  experience?: string;
  isActive: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  ratingAvg?: number;
  ratingCount?: number;
  totalSessions?: number;
  university?: string;
  /** High-level subject tags the tutor can teach (from tutor quiz) */
  subjects: string[];
  /** Specific course codes/names the tutor can help with (from tutor quiz) */
  courses?: string[];
  /** Teaching styles used by the tutor (from tutor quiz) */
  teachingStyles?: string[];
  /** Usual session pacing preference (from tutor quiz) */
  sessionPace?: string;
  /** Teaching tools / resources commonly used (from tutor quiz) */
  teachingTools?: string[];
  /** Experience level supporting students with learning differences (from tutor quiz) */
  accessibilityExperience?: string;
  /** Learning differences the tutor is comfortable supporting (from tutor quiz) */
  supportedLearningDifferences?: string[];
  /** Teaching adjustments the tutor can provide (from tutor quiz) */
  teachingAdjustments?: string[];
  /** General availability slots (weekday/weekend, mornings/evenings, etc.) */
  availability?: string[];
  /** Session format preference (remote / in-person / both) */
  sessionFormat?: string;
  location?: string;
  review?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ---- tutorVerifications/{uid} ----
export interface TutorVerificationDoc {
  uid: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Timestamp | null;
  reviewedAt: Timestamp | null;
  reviewedBy: string | null;
  notes: string;
  documentRefs: { type: string; storagePath: string }[];
}

// ---- tutorRequests/{requestId} ----
export type TutorRequestStatus = "pending" | "accepted" | "rejected";

export interface TutorRequestDoc {
  studentUid: string;
  tutorUid: string;
  status: TutorRequestStatus;
  initialMessage?: string;
  subject?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  respondedAt: Timestamp | null;
}

// ---- connections/{connectionId} ----
export type ConnectionStatus = "active" | "ended";

export interface ConnectionDoc {
  studentUid: string;
  tutorUid: string;
  requestId: string;
  status: ConnectionStatus;
  conversationId: string;
  /** Denormalized for tutor's student list (set when connection is created on accept) */
  studentFirstName?: string;
  studentPhotoURL?: string;
  createdAt: Timestamp | null;
  endedAt: Timestamp | null;
}

// ---- conversations/{conversationId} ----
export interface ParticipantSummaryItem {
  firstName: string;
  photoURL?: string;
  role: "student" | "tutor";
}

export interface ConversationDoc {
  type: "direct";
  participantUids: string[];
  participantSummary: Record<string, ParticipantSummaryItem>;
  connectionId?: string;
  lastMessageText?: string;
  lastMessageSenderUid?: string;
  lastMessageAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ---- conversations/{conversationId}/messages/{messageId} ----
export interface MessageDoc {
  senderUid: string;
  text: string;
  type: "text";
  attachments?: { type: string; url: string; name?: string }[];
  replyToMessageId: string | null;
  createdAt: Timestamp | null;
}

// ---- reviews/{reviewId} ----
export interface ReviewDoc {
  tutorUid: string;
  studentUid: string;
  connectionId: string;
  rating: number;
  text?: string;
  createdAt: Timestamp | null;
}

// ---- sessions/{sessionId} (future-ready) ----
export interface SessionDoc {
  connectionId?: string;
  studentUid?: string;
  tutorUid?: string;
  status?: string;
  scheduledAt?: Timestamp | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}
