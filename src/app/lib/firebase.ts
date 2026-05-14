import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Capacitor } from "@capacitor/core";

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

/**
 * Default getAuth() uses IndexedDB persistence. On Capacitor WKWebView that often never completes,
 * so onAuthStateChanged never fires (infinite loading). Use localStorage-backed persistence on native.
 */
function createAuth() {
  if (!app) return null as unknown as ReturnType<typeof getAuth>;
  if (typeof window === "undefined") return getAuth(app);
  if (Capacitor.isNativePlatform()) {
    try {
      console.log(
        "[Firebase] Auth: initializeAuth + browserLocalPersistence (avoids IndexedDB hang in WKWebView)"
      );
      return initializeAuth(app, { persistence: browserLocalPersistence });
    } catch (e: unknown) {
      const code =
        typeof e === "object" && e !== null && "code" in e
          ? String((e as { code?: string }).code)
          : "";
      if (code === "auth/already-initialized") {
        return getAuth(app);
      }
      throw e;
    }
  }
  return getAuth(app);
}

export const auth = isFirebaseConfigured && app ? createAuth() : (null as unknown as ReturnType<typeof getAuth>);
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
export const storage = app ? getStorage(app) : (null as unknown as ReturnType<typeof getStorage>);

const FIRESTORE_ENABLE_NETWORK_MS = 12_000;

function firestoreReadyNativeCapacitor(): Promise<void> {
  // enableNetwork() often never settles in Capacitor WKWebView; Firestore still works — skip the wait.
  console.log(
    "[Firebase] Native Capacitor: skipping enableNetwork (avoids WKWebView hang). Project:",
    firebaseConfig.projectId
  );
  return Promise.resolve();
}

function firestoreReadyBrowser(): Promise<void> {
  return Promise.race([
    enableNetwork(db!)
      .then(() => {
        console.log(
          "[Firebase] Using Firestore Native (default) | Project:",
          firebaseConfig.projectId,
          "| In Console: Firestore Database → (default) → Data / Rules."
        );
      })
      .catch((err) => {
        console.warn("[Firebase] enableNetwork failed:", err?.message ?? err);
      }),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn(
          `[Firebase] enableNetwork still pending after ${FIRESTORE_ENABLE_NETWORK_MS}ms; continuing so auth UI is not stuck.`
        );
        resolve();
      }, FIRESTORE_ENABLE_NETWORK_MS);
    }),
  ]);
}

/** Wait for Firestore before reads/writes. On Capacitor iOS/Android, skip enableNetwork — it can hang forever in WKWebView. */
export const firestoreReady =
  isFirebaseConfigured && db && typeof window !== "undefined"
    ? Capacitor.isNativePlatform()
      ? firestoreReadyNativeCapacitor()
      : firestoreReadyBrowser()
    : Promise.resolve();

/** Analytics is not supported in Capacitor / many embedded WebViews; avoid throwing at import time. */
function tryGetAnalytics(): ReturnType<typeof getAnalytics> | null {
  if (!isFirebaseConfigured || !app || typeof window === "undefined") return null;
  try {
    return getAnalytics(app);
  } catch (e) {
    console.warn("[Firebase] Analytics unavailable in this environment:", e);
    return null;
  }
}

export const analytics = tryGetAnalytics();

export default app;
