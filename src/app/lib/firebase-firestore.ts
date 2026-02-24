import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTIONS = {
  users: "users",
  tutors: "tutors",
  sessions: "sessions",
  conversations: "conversations",
  reviews: "reviews",
  progress: "progress",
  resources: "resources",
} as const;

// Helper: get document with id
export async function getDocument<T = DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

// Helper: get all documents in a collection
export async function getCollection<T = DocumentData>(
  collectionName: string,
  constraints?: { field: string; op: "==" | "!=" | ">" | "<" | ">=" | "<="; value: unknown }[],
  orderByField?: string,
  orderDirection?: "asc" | "desc",
  limitCount?: number
): Promise<T[]> {
  let q = query(collection(db, collectionName));
  if (constraints?.length) {
    constraints.forEach((c) => {
      q = query(q, where(c.field, c.op, c.value));
    });
  }
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection ?? "asc"));
  }
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

// Users: set or update by Firebase Auth UID
export async function setUserProfile(
  uid: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.users, uid);
  await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true });
}

export async function getUserProfile<T = DocumentData>(uid: string): Promise<T | null> {
  return getDocument<T>(COLLECTIONS.users, uid);
}

// Tutors: list and get one
export async function getTutors(filters?: {
  subject?: string;
  search?: string;
}): Promise<DocumentData[]> {
  let items = await getCollection<DocumentData>(COLLECTIONS.tutors);
  if (filters?.subject && filters.subject !== "All") {
    items = items.filter((t) =>
      (t.subjects as string[]).includes(filters.subject as string)
    );
  }
  if (filters?.search) {
    const lower = (filters.search as string).toLowerCase();
    items = items.filter(
      (t) =>
        (t.name as string).toLowerCase().includes(lower) ||
        (t.subjects as string[]).some((s: string) => s.toLowerCase().includes(lower))
    );
  }
  return items;
}

export async function getTutorById(id: string): Promise<DocumentData | null> {
  return getDocument(COLLECTIONS.tutors, id);
}

// Sessions: by user
export async function getSessionsByUser(
  userId: string,
  status?: "upcoming" | "completed" | "cancelled"
): Promise<DocumentData[]> {
  const constraints = [
    { field: "studentId", op: "==" as const, value: userId },
  ];
  if (status) {
    constraints.push({ field: "status", op: "==" as const, value: status });
  }
  return getCollection<DocumentData>(
    COLLECTIONS.sessions,
    constraints,
    "date",
    "asc"
  );
}

export async function createSession(data: Record<string, unknown>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.sessions), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function cancelSession(
  sessionId: string,
  reason: string
): Promise<void> {
  const ref = doc(db, COLLECTIONS.sessions, sessionId);
  await updateDoc(ref, {
    status: "cancelled",
    cancelReason: reason,
    cancelledAt: new Date(),
    updatedAt: new Date(),
  });
}

// Messages: subcollection under conversations
export function getMessagesRef(conversationId: string) {
  return collection(
    db,
    COLLECTIONS.conversations,
    conversationId,
    "messages"
  );
}

export async function addMessage(
  conversationId: string,
  data: Record<string, unknown>
): Promise<string> {
  const ref = await addDoc(getMessagesRef(conversationId), {
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
}

export function subscribeMessages(
  conversationId: string,
  callback: (messages: DocumentData[]) => void
): Unsubscribe {
  const q = query(
    getMessagesRef(conversationId),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(messages);
  });
}

// Reviews
export async function addReview(data: Record<string, unknown>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.reviews), {
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function getReviewsByTutor(tutorId: string): Promise<DocumentData[]> {
  return getCollection<DocumentData>(COLLECTIONS.reviews, [
    { field: "tutorId", op: "==", value: tutorId },
  ], "createdAt", "desc", 50);
}

// Progress
export async function getProgressByUser(userId: string): Promise<DocumentData[]> {
  return getCollection<DocumentData>(COLLECTIONS.progress, [
    { field: "userId", op: "==", value: userId },
  ]);
}

export async function setProgress(
  userId: string,
  subjectId: string,
  data: Record<string, unknown>
): Promise<void> {
  const id = `${userId}_${subjectId}`;
  const ref = doc(db, COLLECTIONS.progress, id);
  await setDoc(ref, { userId, subjectId, ...data, updatedAt: new Date() }, { merge: true });
}

// Resources (read-only list)
export async function getResources(): Promise<DocumentData[]> {
  return getCollection<DocumentData>(COLLECTIONS.resources);
}

export {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  COLLECTIONS,
};
