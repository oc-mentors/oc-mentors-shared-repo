/**
 * Seed Firebase Auth users and Firestore user profiles for OC Mentors.
 * All accounts use password: "password".
 *
 * Prerequisites:
 * 1. Firebase project: oc-mentors-socratic (same as .env.local VITE_FIREBASE_*).
 * 2. Service account key: Firebase Console → Project Settings → Service accounts →
 *    Generate new private key. Save as e.g. project-root/service-account.json.
 * 3. Set env and run:
 *    export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *    node scripts/seed-users.js
 *
 * Optional: FIREBASE_PROJECT_ID if not using a service account file that contains it.
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { seedUsers, SEED_PASSWORD } from "./seed-users-data.js";

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

function nameToFirstLast(name) {
  const parts = name.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
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
  const auth = admin.auth();
  const db = admin.firestore();

  console.log("Seeding users for project:", projectId);
  console.log("Password for all accounts:", SEED_PASSWORD);

  for (const u of seedUsers) {
    const { name, email, role, university, avatar } = u;
    const { firstName, lastName } = nameToFirstLast(name);
    try {
      const userRecord = await auth.createUser({
        email,
        password: SEED_PASSWORD,
        displayName: name,
        emailVerified: true,
      });
      const uid = userRecord.uid;
      const profile = {
        id: uid,
        name,
        firstName,
        lastName,
        email,
        role: role === "student" ? "student" : "tutor",
        ...(university && { university }),
        ...(avatar && { avatar }),
      };
      await db.collection("users").doc(uid).set(profile);
      console.log("Created:", email, "(" + role + ")");
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        console.log("Exists (skip):", email);
        continue;
      }
      console.error("Error creating", email, err.message);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
