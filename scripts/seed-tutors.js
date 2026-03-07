/**
 * Seed Firestore "tutors" collection for OC Mentors catalog.
 *
 * Prerequisites:
 * 1. Same Firebase project as the app (e.g. oc-mentors-socratic).
 * 2. Service account key: Firebase Console → Project Settings → Service accounts →
 *    Generate new private key. Save as e.g. project-root/service-account.json.
 * 3. Run:
 *    export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *    node scripts/seed-tutors.js
 *
 * Or: npm run seed-tutors (after adding script to package.json)
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { seedTutors } from "./seed-tutors-data.js";

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

async function main() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  try {
    readFileSync(credPath, "utf8");
  } catch {
    console.error(
      "Missing service account key. Either:\n" +
        "  export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/key.json\"\n" +
        "  or place key at: " +
        join(projectRoot, "service-account.json")
    );
    process.exit(1);
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  const projectId = getProjectId();
  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }
  const db = admin.firestore();
  const tutorsRef = db.collection("tutors");

  console.log("Seeding tutors collection for project:", projectId);

  // Delete all existing documents in tutors collection
  const existing = await tutorsRef.get();
  if (!existing.empty) {
    const batchSize = 500;
    let deleted = 0;
    for (let i = 0; i < existing.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = existing.docs.slice(i, i + batchSize);
      chunk.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deleted += chunk.length;
    }
    console.log("Deleted", deleted, "existing tutor document(s).");
  }

  for (const tutor of seedTutors) {
    const docId = String(tutor.id);
    await tutorsRef.doc(docId).set(tutor);
    console.log("Upserted tutor:", tutor.name, "(id:", docId + ")");
  }

  console.log("Done. Tutors count:", seedTutors.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
