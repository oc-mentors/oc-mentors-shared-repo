/**
 * Firestore reads tuned for Capacitor Android TV / WKWebView:
 * server reads can hang or fail; fall back to cache and retry.
 */
import { Capacitor } from "@capacitor/core";
import {
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  type DocumentReference,
  type DocumentSnapshot,
  type Query,
  type QuerySnapshot,
} from "firebase/firestore";

const SERVER_READ_MS = 20_000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function readDocServerOrCache(ref: DocumentReference): Promise<DocumentSnapshot> {
  const withTimeout = (p: Promise<DocumentSnapshot>) =>
    Promise.race([
      p,
      sleep(SERVER_READ_MS).then(() => {
        throw new Error("read timeout");
      }),
    ]);

  // On Android TV, getDocFromServer often times out; try default getDoc first.
  if (Capacitor.isNativePlatform()) {
    try {
      const cached = await withTimeout(getDoc(ref));
      if (cached.exists()) return cached;
    } catch (e) {
      console.warn("[Firestore] native getDoc failed:", e);
    }
  }

  try {
    return await withTimeout(getDocFromServer(ref));
  } catch (e) {
    console.warn("[Firestore] getDocFromServer failed, using getDoc:", e);
    return getDoc(ref);
  }
}

/** Load a user/profile doc with retries (post-login on TV is often slow). */
export async function loadUserDocWithRetry(
  ref: DocumentReference,
  label: string
): Promise<DocumentSnapshot> {
  const delays = Capacitor.isNativePlatform()
    ? [0, 600, 1500, 3000, 5000]
    : [0, 400, 1000, 2000];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);
    const snap = await readDocServerOrCache(ref);
    if (snap.exists()) {
      console.log(`[Firestore] ${label} loaded (attempt ${i + 1})`);
      return snap;
    }
  }
  return readDocServerOrCache(ref);
}

async function readCollectionServerOrCache(q: Query): Promise<QuerySnapshot> {
  const withTimeout = (p: Promise<QuerySnapshot>) =>
    Promise.race([
      p,
      sleep(SERVER_READ_MS).then(() => {
        throw new Error("getDocs timeout");
      }),
    ]);

  if (Capacitor.isNativePlatform()) {
    try {
      const snap = await withTimeout(getDocs(q));
      if (!snap.empty) return snap;
    } catch (e) {
      console.warn("[Firestore] native getDocs failed:", e);
    }
  }

  try {
    return await withTimeout(getDocsFromServer(q));
  } catch (e) {
    console.warn("[Firestore] getDocsFromServer failed, using getDocs:", e);
    return getDocs(q);
  }
}

export async function loadCollectionWithRetry(
  q: Query,
  label: string
): Promise<QuerySnapshot> {
  const delays = [0, 800, 2000, 4000];
  let lastError: unknown;
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);
    try {
      const snap = await readCollectionServerOrCache(q);
      console.log(`[Firestore] ${label} ok (${snap.size} docs, attempt ${i + 1})`);
      return snap;
    } catch (e) {
      lastError = e;
      console.warn(`[Firestore] ${label} attempt ${i + 1} failed:`, e);
    }
  }
  throw lastError ?? new Error(`${label} failed`);
}
