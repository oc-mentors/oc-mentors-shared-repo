import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing Firebase config. Copy .env.example to .env.local and add your Firebase web config from the Firebase Console."
  );
}

/** Firestore Native (default database) for user profiles. */
export const FIRESTORE_DATABASE_ID = "(default)";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** Wait for this before any Firestore read/write so we don't get "client is offline". */
export const firestoreReady =
  typeof window !== "undefined"
    ? enableNetwork(db)
        .then(() => {
          console.log(
            "[Firebase] Using Firestore Native (default) | Project:",
            firebaseConfig.projectId,
            "| In Console: Firestore Database → (default) → Data / Rules."
          );
        })
        .catch((err) => {
          console.warn("[Firebase] enableNetwork failed:", err?.message ?? err);
        })
    : Promise.resolve();

// Analytics only in browser
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
