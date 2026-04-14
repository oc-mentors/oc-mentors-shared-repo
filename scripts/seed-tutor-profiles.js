/**
 * Seed Firebase Auth + tutorProfiles for OC Mentors (blueprint architecture).
 * Creates one Auth user per tutor and writes tutorProfiles/{uid}.
 * Run after setting GOOGLE_APPLICATION_CREDENTIALS (same as seed-users.js).
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *   node scripts/seed-tutor-profiles.js
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { seedTutors } from "./seed-tutors-data.js";

const SEED_PASSWORD = "password";

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

function emailFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "") + "@tutor.ocmentors.edu";
}

async function main() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  try {
    readFileSync(credPath, "utf8");
  } catch {
    console.error("Missing service account key. Set GOOGLE_APPLICATION_CREDENTIALS or place service-account.json in project root.");
    process.exit(1);
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  const projectId = getProjectId();
  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }
  const auth = admin.auth();
  const db = admin.firestore();

  console.log("Seeding tutor Auth + tutorProfiles for project:", projectId);

  for (const t of seedTutors) {
    const email = emailFromName(t.name);
    try {
      const userRecord = await auth.createUser({
        email,
        password: SEED_PASSWORD,
        displayName: t.name,
        emailVerified: true,
      });
      const uid = userRecord.uid;
      const profile = {
        uid,
        displayName: t.name,
        photoURL: t.avatar ?? null,
        headline: t.major ?? null,
        bio: t.bio ?? null,
        major: t.major ?? null,
        subjects: t.subjects ?? [],
        pricePerHour: t.pricePerHour ?? null,
        priceLevel: t.priceLevel ?? null,
        university: t.university ?? null,
        availability: t.availability ?? [],
        responseTime: t.responseTime ?? null,
        experienceLabel: t.experience ?? null,
        experience: t.experience ?? null,
        location: t.location ?? null,
        review: t.review ?? null,
        isActive: true,
        ratingAvg: t.rating ?? null,
        ratingCount: t.reviewCount ?? null,
        totalSessions: t.totalSessions ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("tutorProfiles").doc(uid).set(profile);
      console.log("Created tutor:", t.name, "(", email, ")");
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        const existing = await auth.getUserByEmail(email);
        const uid = existing.uid;
        const profile = {
          uid,
          displayName: t.name,
          photoURL: t.avatar ?? null,
          headline: t.major ?? null,
          bio: t.bio ?? null,
          major: t.major ?? null,
          subjects: t.subjects ?? [],
          pricePerHour: t.pricePerHour ?? null,
          priceLevel: t.priceLevel ?? null,
          university: t.university ?? null,
          availability: t.availability ?? [],
          responseTime: t.responseTime ?? null,
          experienceLabel: t.experience ?? null,
          experience: t.experience ?? null,
          location: t.location ?? null,
          review: t.review ?? null,
          isActive: true,
          ratingAvg: t.rating ?? null,
          ratingCount: t.reviewCount ?? null,
          totalSessions: t.totalSessions ?? null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection("tutorProfiles").doc(uid).set(profile, { merge: true });
        console.log("Exists (updated profile):", t.name);
      } else {
        console.error("Error creating", t.name, err.message);
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
