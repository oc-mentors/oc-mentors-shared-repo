import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.authDomain;

/** Firestore Native (default database) for user profiles. */
export const FIRESTORE_DATABASE_ID = "(default)";

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : (null as unknown as ReturnType<typeof initializeApp>);
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
export const storage = app ? getStorage(app) : (null as unknown as ReturnType<typeof getStorage>);

/** Wait for this before any Firestore read/write so we don't get "client is offline". */
export const firestoreReady =
  isFirebaseConfigured && db && typeof window !== "undefined"
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
  isFirebaseConfigured && app && typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
