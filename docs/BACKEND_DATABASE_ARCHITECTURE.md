# Socratic OC — Backend / Database Architecture Report

**Purpose:** Extract of the current Firebase Auth + Firestore usage for review with an external architect.  
**Scope:** Exact current behavior only; no proposed changes.

---

## 1. FIRESTORE COLLECTIONS

### 1.1 `users`

| Item | Detail |
|------|--------|
| **Collection name** | `users` |
| **Where it appears** | `AuthContext.tsx` (doc refs: `doc(db, "users", uid)`), `ConversationsContext.tsx` (path prefix `users/{uid}` for subcollections), `scripts/seed-users.js`, `scripts/clear-all.js` |
| **Document ID** | Firebase Auth UID (string) |
| **Example document structure** | See §13. |
| **Fields written** | `id`, `name`, `firstName`, `lastName`, `email`, `role`, `avatar`, `university`, `learningStyle`, `learningStyleQuestionAnswers`, `learningStyleCompletedAt`. On migration: `learningStyleAnswers` is deleted. |
| **Fields read** | All of the above; `id` is also set from document ID (uid). |

### 1.2 `tutors`

| Item | Detail |
|------|--------|
| **Collection name** | `tutors` |
| **Where it appears** | `TutorsContext.tsx` (`collection(db, "tutors")`), `scripts/seed-tutors.js`, `firestore.rules` |
| **Document ID** | String representation of numeric tutor id (e.g. `"1"`, `"2"`). |
| **Example document structure** | See §13. |
| **Fields written** | Script only: `id`, `name`, `avatar`, `university`, `major`, `subjects`, `learningStyle`, `rating`, `reviewCount`, `priceLevel`, `pricePerHour`, `review`, `bio`, `availability`, `totalSessions`, `responseTime`, `experience`, `location`. |
| **Fields read** | Same set; frontend reads full documents and sorts in memory by `id`. |

### 1.3 `users/{uid}/conversations` (subcollection)

| Item | Detail |
|------|--------|
| **Collection name** | `conversations` (subcollection under `users/{uid}`) |
| **Where it appears** | `ConversationsContext.tsx`: `collection(db, "users", uid, CONVERSATIONS_COLLECTION)` |
| **Document ID** | String representation of numeric conversation id (e.g. `"1"`, `"7"`). |
| **Example document structure** | See §13. |
| **Fields written** | `id`, `name`, `avatar`, `university`, `message`, `timestamp`, `unread`, `pinned`, `pinnedAt`, `role`, `tutorId`. On addMessage: `message`, `timestamp`, `id` are merged. |
| **Fields read** | All of the above. |

### 1.4 `users/{uid}/conversations/{convId}/messages` (subcollection)

| Item | Detail |
|------|--------|
| **Collection name** | `messages` (subcollection under `users/{uid}/conversations/{convId}`) |
| **Where it appears** | `ConversationsContext.tsx`: `collection(db, "users", uid, CONVERSATIONS_COLLECTION, String(conversationId), MESSAGES_COLLECTION)` |
| **Document ID** | String representation of numeric message id (e.g. `"1"`, `"2"`). |
| **Example document structure** | See §13. |
| **Fields written** | `id`, `text`, `time`, `isSent`, optional `attachments`, optional `replyTo`. |
| **Fields read** | Same set; messages are sorted in memory by `id`. |

---

## 2. SUBCOLLECTIONS

| Path | Description |
|------|-------------|
| `users/{userId}/conversations` | One subcollection per user: list of conversations (inbox threads). |
| `users/{userId}/conversations/{conversationId}/messages` | One subcollection per conversation: messages in that thread. |

**Hierarchy:**

```
users/{uid}
  └── conversations/{convId}
        └── messages/{messageId}
```

There are no other subcollections in the codebase.

---

## 3. USER MODEL

### 3.1 Firebase Auth usage

- **Where:** `AuthContext.tsx` and `src/app/lib/firebase.ts`.
- **Methods used:** `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, `updatePassword` (via `firebaseUpdatePassword`), `signInWithPopup` (Google), `GoogleAuthProvider`.
- **Flow:** On auth state change, the app loads the document `users/{uid}` from Firestore. If it does not exist, it creates a minimal profile (id, name, email, role: `"student"`). Login/signup only use Auth; profile data is in Firestore.

### 3.2 User profile data in Firestore

- **Location:** Single document per user: `users/{uid}`. No separate `tutorProfiles` or `studentProfiles` collections.
- **Interface (TypeScript):** `User` in `AuthContext.tsx`: `id`, `name`, `firstName?`, `lastName?`, `email`, `role`, `avatar?`, `university?`, `learningStyle?`, `learningStyleAnswers?` (deprecated, removed on migration), `learningStyleQuestionAnswers?`, `learningStyleCompletedAt?`.

### 3.3 Tutor vs student roles

- **Stored in:** `users/{uid}.role` (Firestore). Values: `"student"` | `"tutor"` | `"admin"` (from `UserRole`).
- **Seeding:** `scripts/seed-users-data.js` maps role to `"student"` or `"tutor"`; seed script writes to `users` and Auth.
- **Tutor catalog:** Separate from `users`. The app’s “tutors” list comes from the **`tutors`** collection (seed from `seed-tutors-data.js`). Those documents use numeric `id` (1, 2, …) and are not keyed by Auth UID. So: “user profile” (Auth + `users`) vs “tutor catalog” (`tutors`) are separate; a logged-in tutor’s profile is in `users`, their catalog entry (if any) is in `tutors` by numeric id.

### 3.4 Fields per user (summary)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Auth UID |
| `name` | string | Full name |
| `firstName` | string | Optional |
| `lastName` | string | Optional |
| `email` | string | |
| `role` | "student" \| "tutor" \| "admin" | |
| `avatar` | string | URL or data URL |
| `university` | string | Optional |
| `learningStyle` | string | Optional (e.g. "Visual", "Mixed") |
| `learningStyleQuestionAnswers` | array of { question, answer } | Optional; stored in DB |
| `learningStyleCompletedAt` | timestamp | Optional |
| `learningStyleAnswers` | number[] | Deprecated; deleted by migration |

---

## 4. RELATIONSHIPS

### 4.1 Tutor ↔ student

- **Not modeled in Firestore** as a separate relationship collection.
- **Tutor catalog:** `tutors` holds catalog entries (numeric ids, names, subjects, etc.). No link from `tutors` to `users` or to students.
- **Connection in UI:** When a student messages a tutor from `TutorDetailPage`, the app creates or reuses a **conversation** under the **current user** (`users/{uid}/conversations`). The conversation stores `tutorId` (numeric id from `tutors`) and role `"tutor"`. So the only “link” is: per-user conversation documents that reference a tutor by `tutorId`.

### 4.2 Tutor requests / matches / connections

- **Tutor requests:** Not stored in Firestore. No collection for requests or pending matches.
- **Matches/connections:** No `connections` or `matches` collection. “Connection” is implied only by the existence of a conversation (and optional `tutorId`) under the logged-in user.

### 4.3 Sessions

- **Sessions:** No Firestore collection for sessions, bookings, or lessons. Booking/navigation is in-app only (e.g. navigate to `/booking`); no session documents in the current codebase.

---

## 5. MESSAGING SYSTEM

### 5.1 Where conversations and messages are stored

- **Conversations:** `users/{uid}/conversations/{conversationId}`. Each document is one thread in that user’s inbox.
- **Messages:** `users/{uid}/conversations/{conversationId}/messages/{messageId}`. Each document is one message in that thread.

### 5.2 Participants

- **Not stored as a participants array.** Conversations are **per user**: each user has their own copy of “their” conversations. A conversation document holds display info (name, avatar, university, role, tutorId) and last-message preview (`message`, `timestamp`). There is no shared conversation id across users; no “conversation between user A and user B” document. So messaging is **single-participant view**: the logged-in user’s list of threads, with the other party represented by fields on the conversation doc (name, avatar, etc.).

### 5.3 Inbox screen

- **Data source:** `ConversationsContext` loads all docs from `users/{uid}/conversations`, then for each conversation loads all docs from `users/{uid}/conversations/{convId}/messages`. If the conversations subcollection is empty, it seeds default conversations and messages (from in-code defaults) into Firestore, then uses that data.
- **Sorting:** Done in the frontend: conversations sorted by `id`; then `MessagesPage` sorts by pinned (by `pinnedAt`), then unread, then order. Message order in a thread: sort by message `id` in memory.
- **Filtering:** Client-side by search query (name, message text) and role filter (all / tutor / professor / ta / peer).

### 5.4 lastMessage field

- **Yes, but on the conversation doc:** The conversation document has `message` and `timestamp` (both strings). When a new message is added, `addMessage` updates the conversation doc with `message: message.text` and `timestamp: message.time` (merge). So “last message” is denormalized onto the conversation document; there is no separate `lastMessage` subcollection or reference.

### 5.5 Message ordering

- **No Firestore ordering in queries.** All message docs in a thread are read with `getDocs(messagesRef(...))`; ordering is applied in memory by numeric `id` (`a.id - b.id`). New messages get the next numeric id from the client.

---

## 6. CREDENTIALS / PROFILE DATA

### 6.1 Tutor credentials and profile (catalog)

- **Stored in:** `tutors` collection only (see §1.2 and §13). No separate verification or credentials collection.
- **Verification / documents:** Not implemented. No fields or collections for verification status or document uploads.
- **Ratings:** Stored as `rating` (number) and `reviewCount` (number) and a single `review` (string) on each tutor document. No separate reviews/ratings collection.
- **Subjects:** Array of strings on the tutor document: `subjects`.
- **Availability:** Array of strings on the tutor document: `availability` (e.g. `["Mon 2-5pm", "Wed 2-5pm"]`). No separate availability/slots collection or calendar integration in Firestore.

### 6.2 App user profile (students/tutors as users)

- **Profile data:** In `users/{uid}` (name, avatar, university, learning style, etc.). No separate credentials or verification fields.

---

## 7. QUERY PATTERNS

All queries are **full collection** or **single document** reads; no `where`, `orderBy`, or `limit` in the codebase.

| Operation | Collection / path | Filters | Sorting |
|-----------|-------------------|--------|--------|
| Load user profile | `users/{uid}` | — | — |
| Load tutors | `tutors` | None | In memory by `id` |
| Load conversations (inbox) | `users/{uid}/conversations` | None | In memory by `id` |
| Load messages for one conversation | `users/{uid}/conversations/{convId}/messages` | None | In memory by message `id` |
| Send message | Write to `messages/{msgId}` and merge update on `conversations/{convId}` | — | — |
| Create conversation | setDoc `users/{uid}/conversations/{convId}` | — | — |
| Update conversation (pin, unread, etc.) | update merge on `users/{uid}/conversations/{convId}` | — | — |
| Delete conversation | deleteDoc conversation + all message docs in that subcollection | — | — |

---

## 8. FIRESTORE WRITES

| Operation | Location | What is written |
|-----------|----------|------------------|
| Create user (signup) | AuthContext | `setDoc(users/{uid}, newUser)` with id, name, firstName, lastName, email, role. |
| Create user (Google first time) | AuthContext | `setDoc(users/{uid}, newUser)` with id, name, email, role, avatar. |
| Update profile | AuthContext | `updateDoc(users/{uid}, updates)`; may also `deleteField()` for `learningStyleAnswers`. |
| Migration (quiz answers) | AuthContext | `updateDoc(users/{uid}, { learningStyleQuestionAnswers, learningStyleAnswers: deleteField() })`. |
| Send message | ConversationsContext | `setDoc(..., messages/{msgId}, message)` and `setDoc(..., conversations/{convId}, { message, timestamp, id }, { merge: true })`. |
| Create conversation | ConversationsContext | `setDoc(users/{uid}/conversations/{convId}, conversation)`. |
| Update conversation | ConversationsContext | `setDoc(..., { ...updates, id }, { merge: true })`. |
| Delete conversation | ConversationsContext | Delete all docs in `messages` subcollection, then `deleteDoc(conversationRef)`. |
| Replace messages in thread | ConversationsContext | Delete all message docs in the subcollection, then setDoc for each new message. |
| Seed conversations/messages | ConversationsContext | On first load if conversations empty: batch setDoc for default conversations, then batch setDoc for default messages. |
| Seed users | scripts/seed-users.js | Auth `createUser` + `db.collection("users").doc(uid).set(profile)`. |
| Seed tutors | scripts/seed-tutors.js | `tutorsRef.doc(docId).set(tutor)` for each seed tutor. |

There are no Firestore writes in the app for: tutor requests, matches, connections, sessions, or bookings.

---

## 9. CLOUD FUNCTIONS

**None.** The project has no `functions/` directory and no Cloud Functions are referenced in the codebase. All logic is client-side or in Node seed/clear scripts.

---

## 10. INDEXES

- **No composite indexes** are required for current usage: the app performs no compound `where` + `orderBy` queries. All reads are either `getDoc` on a single document or `getDocs` on a collection (no filters). Firestore’s default single-field indexing is sufficient.
- If future features add filtered/sorted queries (e.g. tutors by subject, conversations by timestamp), those would need corresponding composite indexes.

---

## 11. SECURITY RULES

**File:** `firestore.rules` (project root).

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /tutors/{tutorId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Summary:**

- **users/{userId}:** Read and write allowed only when the request is authenticated and `request.auth.uid == userId`. So each user can only access their own user document.
- **tutors/{tutorId}:** Read allowed for everyone (including unauthenticated). Write denied for everyone (only backend/admin via SDK/scripts can write).
- **Subcollections:** The rules file does **not** define rules for `users/{userId}/conversations/...` or `users/{userId}/conversations/{convId}/messages/...`. In Firestore, subcollections are not covered by the parent’s `match`. So with this file only, access to those subcollections would be **denied by default**. If the app works in production, either additional rules are deployed elsewhere (e.g. in the Firebase Console) or the deployed rules differ from this file. An architect should confirm that subcollection rules are in place if the app is expected to read/write conversations and messages.

---

## 12. COLLECTION TREE

```text
users/{uid}                          # User profile (Auth UID)
  └── conversations/{conversationId} # Inbox threads (numeric id as string)
        └── messages/{messageId}     # Messages in that thread (numeric id as string)

tutors/{tutorId}                     # Tutor catalog (numeric id as string; 1, 2, …)
```

No other root collections or subcollections are used in the codebase.

---

## 13. SAMPLE DOCUMENTS

### users/{uid}

```json
{
  "id": "abc123firebaseAuthUid",
  "name": "Jane Doe",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "role": "student",
  "avatar": "data:image/jpeg;base64,...",
  "university": "University of California, Irvine",
  "learningStyle": "Visual",
  "learningStyleQuestionAnswers": [
    { "question": "When studying, I prefer...", "answer": "Charts and diagrams" }
  ],
  "learningStyleCompletedAt": null
}
```

### tutors/{tutorId}

```json
{
  "id": 1,
  "name": "Debra Peterson",
  "avatar": "https://images.unsplash.com/photo-...",
  "university": "University of California, Irvine",
  "major": "Mathematics • Senior",
  "subjects": ["Math", "Math 2A", "Math 2B", "Calculus", "Linear Algebra"],
  "learningStyle": "Visual Learning",
  "rating": 4.5,
  "reviewCount": 127,
  "priceLevel": "$$$",
  "pricePerHour": 45,
  "review": "Debra is the best Math tutor I ever had!",
  "bio": "Hi! I'm Debra, a senior Mathematics major...",
  "availability": ["Mon 2-5pm", "Wed 2-5pm", "Fri 2-5pm"],
  "totalSessions": 234,
  "responseTime": "< 1 hour",
  "experience": "5 years",
  "location": "Remote & In-Person"
}
```

### users/{uid}/conversations/{conversationId}

```json
{
  "id": 1,
  "name": "Debra Peterson",
  "avatar": "https://images.unsplash.com/photo-...",
  "university": "University of California, Irvine",
  "message": "Perfect! I can definitely help with that. When would you like to schedule a session?",
  "timestamp": "10:35 AM",
  "unread": true,
  "pinned": false,
  "pinnedAt": null,
  "role": "tutor",
  "tutorId": 1
}
```

### users/{uid}/conversations/{conversationId}/messages/{messageId}

```json
{
  "id": 1,
  "text": "Hi! I saw your profile and would love to book a session with you.",
  "time": "10:30 AM",
  "isSent": true
}
```

With optional fields:

```json
{
  "id": 2,
  "text": "Here is the attachment.",
  "time": "10:32 AM",
  "isSent": false,
  "attachments": [{ "type": "image", "url": "https://...", "name": "photo.jpg" }],
  "replyTo": { "id": 1, "text": "Previous message", "isSent": true }
}
```

---

*End of report.*
