/**
 * Clear learning style quiz data for a student so they see the quiz again on next login.
 *
 *   node scripts/reset-learning-quiz.js arie@uci.edu
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const QUIZ_FIELDS = [
  "learningStyle",
  "learningStyleAnswers",
  "learningStyleQuestionAnswers",
  "learningStyleCompletedAt",
  "learningSupport",
];

function deleteFields() {
  const out = {};
  for (const key of QUIZ_FIELDS) out[key] = admin.firestore.FieldValue.delete();
  return out;
}

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  if (!email) {
    console.error("Usage: node scripts/reset-learning-quiz.js <email>");
    process.exit(1);
  }

  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  const serviceAccount = JSON.parse(readFileSync(credPath, "utf8"));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }

  const auth = admin.auth();
  const db = admin.firestore();
  const userRecord = await auth.getUserByEmail(email);
  const uid = userRecord.uid;
  const clears = deleteFields();

  await db.collection("users").doc(uid).set(clears, { merge: true });
  await db.collection("studentProfiles").doc(uid).set(clears, { merge: true });

  console.log("Cleared learning quiz for:", email, `(${uid})`);
  console.log("Log out in the app, then sign in again to take the quiz from the start.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
