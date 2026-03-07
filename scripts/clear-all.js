/**
 * Clear all Firestore data and Firebase Auth users for OC Mentors.
 * Use before re-seeding. Run with same service account as seed scripts.
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *   node scripts/clear-all.js
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

function getProjectId() {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    try {
      const key = JSON.parse(readFileSync(credPath, "utf8"));
      if (key.project_id) return key.project_id;
    } catch (_) {}
  }
  return process.env.FIREBASE_PROJECT_ID || "oc-mentors-socratic";
}

/** Recursively delete a collection and all subcollections. */
async function deleteCollection(db, ref, batchSize = 500) {
  const snap = await ref.limit(batchSize).get();
  if (snap.empty) return 0;
  const batch = db.batch();
  const subcollections = [];
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    const subRefs = await doc.ref.listCollections();
    subcollections.push(...subRefs.map((c) => doc.ref.collection(c.id)));
  }
  await batch.commit();
  let total = snap.size;
  for (const subRef of subcollections) {
    total += await deleteCollection(db, subRef, batchSize);
  }
  if (snap.size === batchSize) {
    total += await deleteCollection(db, ref, batchSize);
  }
  return total;
}

async function main() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  try {
    readFileSync(credPath, "utf8");
  } catch {
    console.error(
      "Missing service account key. Set GOOGLE_APPLICATION_CREDENTIALS or place service-account.json in project root."
    );
    process.exit(1);
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  const projectId = getProjectId();
  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }
  const auth = admin.auth();
  const db = admin.firestore();

  console.log("Clearing all data for project:", projectId);

  // 1. Delete all Auth users
  let pageToken;
  let authDeleted = 0;
  do {
    const list = await auth.listUsers(1000, pageToken);
    if (list.users.length > 0) {
      const uids = list.users.map((u) => u.uid);
      await auth.deleteUsers(uids);
      authDeleted += uids.length;
      console.log("Deleted", authDeleted, "Auth user(s)…");
    }
    pageToken = list.pageToken;
  } while (pageToken);
  if (authDeleted === 0) console.log("No Auth users to delete.");

  // 2. Delete all Firestore root collections
  const collections = await db.listCollections();
  let firestoreDeleted = 0;
  for (const col of collections) {
    const ref = col;
    const n = await deleteCollection(db, ref);
    firestoreDeleted += n;
    if (n > 0) console.log("Deleted", n, "doc(s) from", col.id);
  }
  if (firestoreDeleted === 0) console.log("No Firestore documents to delete.");

  console.log("Clear complete. Auth users removed:", authDeleted, "| Firestore docs removed:", firestoreDeleted);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
