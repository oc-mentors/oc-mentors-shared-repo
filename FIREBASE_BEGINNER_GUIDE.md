# Firebase for OC Mentors – Complete Beginner Guide

This guide assumes you’ve never used Firebase. It explains what it is, what was added to your project, and how to set it up step by step.

---

## Part 1: What is Firebase?

**Firebase** is a “backend in the cloud” from Google. Instead of building and running your own server, database, and auth system, you use theirs.

- **You write frontend code** (React) and call Firebase from the browser.
- **Google runs** the servers, database, and auth for you.
- **You don’t need** to install PostgreSQL, write API routes, or manage passwords yourself.

### The 3 parts you’ll use

| Service | What it does | In your app |
|--------|----------------|-------------|
| **Authentication** | Sign up, login, logout, “who is this user?” | Login/register, profile, protected pages |
| **Firestore** | Database (save and load data) | Tutors, sessions, messages, progress, etc. |
| **Storage** | Store files (images, PDFs) | Profile photos, chat attachments |

You get a **free tier** that’s enough for development and small projects.

---

## Part 2: What Was Added to Your Project

These are the files that were added so your app can talk to Firebase.

### 1. `src/app/lib/firebase.ts`

- **What it does:** Connects your app to your Firebase project using the keys in `.env`.
- **You don’t edit this** unless you change project or env var names.
- **Uses:** `auth`, `db` (Firestore), `storage` so the rest of the app can use them.

### 2. `src/app/lib/firebase-auth.ts`

- **What it does:** Wraps Firebase Auth in simple functions:
  - `register(email, password, displayName)` – create account
  - `login(email, password)` – sign in
  - `logout()` – sign out
  - `subscribeAuth(callback)` – run code when login state changes
  - `getCurrentUser()` – get the logged-in user (or null)
- **You use this** wherever you need login/register/logout or “is someone logged in?”.

### 3. `src/app/lib/firebase-firestore.ts`

- **What it does:** Reads and writes data in Firestore:
  - **Users:** `setUserProfile(uid, data)`, `getUserProfile(uid)`
  - **Tutors:** `getTutors()`, `getTutors(filters)`, `getTutorById(id)`
  - **Sessions:** `getSessionsByUser(userId)`, `createSession(data)`, `cancelSession(id, reason)`
  - **Messages:** `addMessage(conversationId, data)`, `subscribeMessages(conversationId, callback)` (real-time)
  - **Reviews:** `addReview(data)`, `getReviewsByTutor(tutorId)`
  - **Progress:** `getProgressByUser(userId)`, `setProgress(userId, subjectId, data)`
  - **Resources:** `getResources()`
- **You use this** in your pages/components when you want to load or save that data (instead of hardcoded arrays).

### 4. `.env.example`

- **What it does:** Template for your secret Firebase config.
- **You do:** Copy it to `.env` and paste your real values from the Firebase Console (so they never go in Git).

### 5. `package.json`

- **What was added:** The `firebase` dependency.
- **You do:** Run `npm install` once so the Firebase SDK is installed.

### 6. `FIREBASE_SETUP.md`

- **What it is:** A shorter, technical reference for Firebase (Auth, Firestore, Storage, rules).
- **Use it** after you finish this guide, when you want to tweak rules or add more features.

---

## Part 3: Step-by-Step Implementation

Do these in order. You need a Google account (Gmail).

---

### Step 1: Create a Firebase project (about 2 minutes)

1. Open: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Sign in with your Google account.
3. Click **“Add project”** (or “Create a project”).
4. **Project name:** e.g. `oc-mentors` (or any name you like).
5. Click **Continue**.
6. If it asks about Google Analytics: you can turn it **Off** for now, then **Create project**.
7. Wait until it says “Your project is ready”, then click **Continue**.

You now have a Firebase project. All the next steps happen inside this project.

---

### Step 2: Turn on Email/Password login (about 1 minute)

1. In the left sidebar, click **“Build”** → **“Authentication”**.
2. Click **“Get started”**.
3. Open the **“Sign-in method”** tab.
4. Click **“Email/Password”**.
5. Turn **Enable** ON.
6. Leave “Email link” OFF.
7. Click **Save**.

Now users can sign up and sign in with email and password.

---

### Step 3: Create the Firestore database (about 1 minute)

1. In the left sidebar, click **“Build”** → **“Firestore Database”**.
2. Click **“Create database”**.
3. Choose **“Start in test mode”** (we’ll lock it down later with rules).
4. Click **Next**.
5. Pick a **location** (e.g. `us-central1`). You can’t change it later.
6. Click **Enable**. Wait until the database is ready.

Now you have a place to store users, tutors, sessions, messages, etc.

---

### Step 4: (Optional) Turn on Storage (about 1 minute)

1. In the left sidebar, click **“Build”** → **“Storage”**.
2. Click **“Get started”**.
3. Use the default rules for now → **Next** → choose same region as Firestore → **Done**.

You’ll use this later for profile pictures and file uploads.

---

### Step 5: Register your app and get the config keys (about 2 minutes)

1. Click the **gear icon** next to “Project Overview” in the sidebar → **“Project settings”**.
2. Scroll down to **“Your apps”**.
3. Click the **</>** (Web) icon to add a web app.
4. **App nickname:** e.g. `OC Mentors Web`.
5. **Do not** check “Firebase Hosting” for now.
6. Click **“Register app”**.
7. You’ll see a code block with `firebaseConfig` that looks like:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123..."
   };
   ```

8. **Copy those 6 values** (you’ll paste them into `.env` in the next step). You can click **“Continue to console”** after.

---

### Step 6: Put the config in your project (about 2 minutes)

1. **Open your project folder** in your editor (the same folder that has `package.json`).

2. **Copy the example env file:**
   - Find the file named **`.env.example`** in the root.
   - Duplicate it and name the copy **`.env`** (exactly, no .example).
   - Or create a new file named **`.env`** in the root.

3. **Open `.env`** and fill it like this (use your real values from Step 5):

   ```env
   VITE_FIREBASE_API_KEY=AIza...your-api-key...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```

   - No quotes around the values.
   - No spaces around `=`.
   - **Important:** The names must start with `VITE_` so Vite can use them in the browser.

4. **Save the file.**  
   `.env` is in `.gitignore`, so it will never be committed to GitHub. Never put this file or these keys in Git.

---

### Step 7: Install Firebase in the project (about 1 minute)

1. Open a terminal in your project root (same folder as `package.json`).
2. Run:

   ```bash
   npm install
   ```

   This installs the `firebase` package (and everything else in `package.json`).

3. If you already had `node_modules` and want to be sure Firebase is there:

   ```bash
   npm install firebase
   ```

---

### Step 8: Confirm the app still runs

1. In the terminal, run:

   ```bash
   npm run dev
   ```

2. Open the URL it shows (e.g. `http://localhost:5173`) in your browser.
3. The app should load exactly as before.  
   At this point you’ve only *connected* Firebase; you haven’t changed any UI or data flow yet.

If you see any error about “API key” or “config”, double-check:
- The file is named `.env` (not `.env.txt`).
- It’s in the **root** of the project (same level as `package.json`).
- You restarted the dev server after creating/editing `.env` (`Ctrl+C`, then `npm run dev` again).

---

### Step 9: Use Firebase in your app (what to do next)

You have two levels of “using” Firebase:

**A) Just have it ready (current state)**  
- Config is in `.env`, `firebase` is installed, and the files in `src/app/lib/` are there.  
- You don’t have to change any pages yet. When you’re ready, you’ll call the functions from those files.

**B) Actually wire it in (example: login)**

1. **Where you want login (e.g. a Login page or modal):**
   - Import: `import { login } from '../lib/firebase-auth';`
   - On “Sign in” button click: call `await login(email, password)`.
   - If it succeeds, Firebase has signed the user in. You can then redirect (e.g. to home or dashboard).

2. **Where you want to know “is someone logged in?”:**
   - Import: `import { subscribeAuth, getCurrentUser } from '../lib/firebase-auth';`
   - In a `useEffect`, call `subscribeAuth((user) => { ... })`. If `user` is not null, they’re logged in; store that in state or context.
   - Or call `getCurrentUser()` when you need it (e.g. to show “Hi, [name]” or to protect a route).

3. **Where you want to load tutors from the database instead of a hardcoded list:**
   - Import: `import { getTutors } from '../lib/firebase-firestore';`
   - In `useEffect`, call `const tutors = await getTutors();` and set state with the result, then render that state.
   - Right now Firestore is empty, so you’d get an empty list until you add tutor documents (via the Firebase Console or a future “admin” or seed script).

So:
- **Steps 1–8** = Firebase is set up and ready.
- **Step 9** = You gradually replace hardcoded data and fake login with `firebase-auth.ts` and `firebase-firestore.ts`.

---

## Part 4: Quick Reference – What Each File Is For

| Goal | File to use | Functions to use |
|------|-------------|-------------------|
| Sign up | `firebase-auth.ts` | `register(email, password, displayName)` |
| Sign in | `firebase-auth.ts` | `login(email, password)` |
| Sign out | `firebase-auth.ts` | `logout()` |
| React to login state | `firebase-auth.ts` | `subscribeAuth(callback)` |
| Current user | `firebase-auth.ts` | `getCurrentUser()` |
| Save/load user profile | `firebase-firestore.ts` | `setUserProfile(uid, data)`, `getUserProfile(uid)` |
| List tutors | `firebase-firestore.ts` | `getTutors()` or `getTutors({ subject, search })` |
| One tutor | `firebase-firestore.ts` | `getTutorById(id)` |
| User’s sessions | `firebase-firestore.ts` | `getSessionsByUser(userId)` |
| Book session | `firebase-firestore.ts` | `createSession(data)` |
| Cancel session | `firebase-firestore.ts` | `cancelSession(sessionId, reason)` |
| Send message | `firebase-firestore.ts` | `addMessage(conversationId, data)` |
| Real-time messages | `firebase-firestore.ts` | `subscribeMessages(conversationId, callback)` |
| Submit review | `firebase-firestore.ts` | `addReview(data)` |
| Progress | `firebase-firestore.ts` | `getProgressByUser(userId)`, `setProgress(...)` |
| Resources | `firebase-firestore.ts` | `getResources()` |

---

## Part 5: Firestore – Where data lives

Think of Firestore like a big set of folders and documents:

- **Collection** = folder (e.g. `tutors`, `sessions`).
- **Document** = one file in that folder, with fields (e.g. `name`, `rating`).

The code in `firebase-firestore.ts` is already written to use these collection names:

- `users` – one document per user (use Firebase Auth UID as document id).
- `tutors` – one document per tutor.
- `sessions` – one document per booked session.
- `conversations` – one document per chat; each has a subcollection `messages`.
- `reviews`, `progress`, `resources` – as in the table above.

You can add the first documents by hand in the Firebase Console (Firestore → “Start collection”), or later with a small script. The app will read them with the functions above.

---

## Summary checklist

- [ ] Create Firebase project (Step 1)
- [ ] Enable Email/Password in Authentication (Step 2)
- [ ] Create Firestore database in test mode (Step 3)
- [ ] (Optional) Enable Storage (Step 4)
- [ ] Register web app and copy config (Step 5)
- [ ] Create `.env` and paste the 6 values (Step 6)
- [ ] Run `npm install` (Step 7)
- [ ] Run `npm run dev` and confirm app loads (Step 8)
- [ ] When ready, use `firebase-auth.ts` and `firebase-firestore.ts` in your pages (Step 9)

If you tell me which part you’re on (e.g. “I’m at Step 6” or “I want to add login to the Canvas login page”), I can give you the exact code for that step next.
