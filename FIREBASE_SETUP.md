# Using Firebase as the Backend for OC Mentors

This guide explains how to use **Firebase** (Authentication, Firestore, Storage, optional Cloud Functions) as the backend for this project instead of a custom Node/Express API.

## Why Firebase?

- **No server to maintain** – Auth, database, and file storage are managed by Google
- **Real-time** – Firestore supports live listeners (great for chat)
- **Scales automatically** – Works from prototype to production
- **Free tier** – Generous limits for development and small apps

## Firebase Services You’ll Use

| Backend need (from BACKEND_REQUIREMENTS) | Firebase service |
|------------------------------------------|------------------|
| Auth (login, register, profile)          | **Firebase Authentication** |
| Users, tutors, sessions, messages        | **Cloud Firestore** |
| Avatars, chat attachments                | **Firebase Storage** |
| Optional: Canvas sync, scheduled tasks  | **Cloud Functions** (optional) |

---

## Step 1: Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it (e.g. `oc-mentors`) → create
3. (Optional) Enable Google Analytics
4. In **Project settings** (gear icon), note your **Project ID**

---

## Step 2: Enable Firebase services

### Authentication

1. In the console: **Build** → **Authentication** → **Get started**
2. **Sign-in method** → **Email/Password** → Enable → Save
3. (Optional) Enable **Google** or other providers later

### Firestore

1. **Build** → **Firestore Database** → **Create database**
2. Choose **Start in test mode** for dev (you’ll lock rules later)
3. Pick a region (e.g. `us-central1`)

### Storage

1. **Build** → **Storage** → **Get started**
2. Use default rules for dev, then tighten for production

---

## Step 3: Register your app and get config

1. **Project settings** → **Your apps** → **</>** (Web)
2. App nickname, e.g. `OC Mentors Web`
3. Don’t check Firebase Hosting yet → **Register app**
4. Copy the `firebaseConfig` object (apiKey, authDomain, projectId, etc.)

---

## Step 4: Add config to your project

1. **Install Firebase:**

   ```bash
   npm install firebase
   ```

2. **Create `.env`** in the project root (and add `.env` to `.gitignore`):

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

   Use the values from the Firebase Console “Your apps” config. The `VITE_` prefix makes them available in Vite at build time.

3. **Create the Firebase app** in code (see `src/app/lib/firebase.ts` in this repo). It should:

   - Call `initializeApp(firebaseConfig)`
   - Export `auth`, `db` (getFirestore()), `storage` (getStorage())

---

## Step 5: Firestore collections (maps to your backend)

Use these collection names and document shapes so they match the backend requirements and the services in this repo.

| Collection      | Purpose |
|----------------|---------|
| `users`        | User profiles (after sign-up; link to Firebase Auth UID) |
| `tutors`       | Tutor profiles, subjects, rating, availability |
| `sessions`     | Booked sessions (student, tutor, date, status) |
| `conversations`| Chat threads (participants, lastMessage) |
| `messages`     | Subcollection: `conversations/{id}/messages` |
| `reviews`      | Session reviews and ratings |
| `progress`     | User progress per subject |
| `resources`    | Recommended resources |
| `announcements`| Canvas announcements (if synced) |
| `assignments`  | Canvas assignments (if synced) |

Document IDs can be auto-generated with `addDoc()` or you can use Firebase Auth UID for `users` (and optionally `tutors`).

---

## Step 6: Security rules (important)

In **Firestore** → **Rules**, start with something like this (then refine by role):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Tutors: readable by all, writable by owner
    match /tutors/{tutorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    // Sessions: only participants
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null &&
        (resource.data.studentId == request.auth.uid || resource.data.tutorId == request.auth.uid);
      allow create: if request.auth != null;
    }
    // Conversations and messages
    match /conversations/{convId} {
      allow read, write: if request.auth != null;
      match /messages/{msgId} {
        allow read, write: if request.auth != null;
      }
    }
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    match /progress/{progressId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /resources/{resourceId} {
      allow read: if request.auth != null;
    }
  }
}
```

Lock down further for production (e.g. restrict `progress` by `userId` in the document).

**Deploy the rules from this repo** (required for the app to read/write):

```bash
# From the project root (where firebase.json and firestore.rules live)
firebase login
firebase use oc-mentors-socratic   # or your project ID
firebase deploy --only firestore:rules
```

If you see **"Missing or insufficient permissions"** in the console, the rules in the repo are not deployed yet. Run the commands above and refresh the app.

---

## Step 7: Use Firebase in the app

- **Auth:** Use `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged` from `firebase/auth`. Store extra profile (name, university, etc.) in `users/{uid}`.
- **Data:** Use `getDoc`/`getDocs`, `setDoc`/`addDoc`, `updateDoc`, `deleteDoc`, and `query`/`where` from `firebase/firestore`. Optional: `onSnapshot` for real-time chat and lists.
- **Files:** Use `ref`, `uploadBytes`, `getDownloadURL` from `firebase/storage` for avatars and attachments.

The repo includes example **services** in `src/app/lib/` that you can extend (e.g. `auth.ts`, `firestore.ts`).

---

## Step 8: Environment and deployment

- **Never commit** `.env` or real API keys. Use `.env.example` with placeholder values.
- For production, set the same `VITE_*` variables in your hosting (Vercel, Netlify, Firebase Hosting, etc.).

---

## Optional: Cloud Functions

For Canvas sync, scheduled reminders, or heavy logic, add **Cloud Functions** (Node.js) in a `functions` folder and deploy with Firebase CLI. The frontend stays the same; you call HTTPS callable functions or REST endpoints exposed by functions.

---

## Quick reference

| Task              | Firebase API / approach |
|-------------------|--------------------------|
| Sign up           | `createUserWithEmailAndPassword` + `setDoc(users/{uid}, profile)` |
| Sign in           | `signInWithEmailAndPassword` |
| Sign out          | `signOut(auth)` |
| Current user      | `onAuthStateChanged` or `auth.currentUser` |
| List tutors       | `getDocs(collection(db, 'tutors'))` + optional `where()` |
| Book session      | `addDoc(collection(db, 'sessions'), data)` |
| Send message      | `addDoc(collection(db, 'conversations', convId, 'messages'), data)` |
| Real-time chat    | `onSnapshot(collection(...), callback)` |
| Upload avatar     | `uploadBytes(storageRef, file)` → `getDownloadURL` → save URL in `users` |
| Session reviews   | `addDoc(collection(db, 'reviews'), data)` |

Using this, you can run the entire OC Mentors backend on Firebase and keep your existing frontend structure.
