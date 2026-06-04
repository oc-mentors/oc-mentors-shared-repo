/**
 * Create tutor accounts from Tutors/*.png (filename = full name).
 * Email: {firstname}@uci.edu  |  Password: password
 *
 * Writes users/{uid} + tutorProfiles/{uid}. Avatars compressed and uploaded to
 * Firebase Storage at tutors/{uid}.jpg when the bucket exists; else /tutors/...
 *
 *   npm run seed-folder-tutors
 */

import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join, extname, basename } from "path";
import { compressImageFile } from "./lib/compressAvatarImage.mjs";

const SEED_PASSWORD = "password";
const UNIVERSITY = "University of California, Irvine";
const STORAGE_PREFIX = "tutors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const tutorsDir = join(projectRoot, "Tutors");
const publicTutorsDir = join(projectRoot, "public", "tutors");

function getStorageBucket() {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "oc-mentors-socratic.firebasestorage.app"
  );
}

function nameToFirstLast(name) {
  const parts = name.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function emailFromFirstName(firstName) {
  const local = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${local}@uci.edu`;
}

function listTutorImages() {
  const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
  return readdirSync(tutorsDir)
    .filter((f) => allowed.has(extname(f).toLowerCase()))
    .map((f) => ({
      fileName: f,
      filePath: join(tutorsDir, f),
      name: basename(f, extname(f)).trim(),
    }))
    .filter((t) => t.name.length > 0);
}

function syncPublicCopies(tutors) {
  mkdirSync(publicTutorsDir, { recursive: true });
  for (const t of tutors) {
    const dest = join(publicTutorsDir, t.fileName);
    if (!existsSync(dest) || readFileSync(dest).length !== readFileSync(t.filePath).length) {
      copyFileSync(t.filePath, dest);
    }
  }
}

function publicAvatarUrl(fileName) {
  return `/tutors/${encodeURIComponent(fileName)}`;
}

function storageDownloadUrl(bucketName, objectPath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

async function storageBucketReady() {
  const bucket = getStorage().bucket();
  const [exists] = await bucket.exists();
  return exists ? bucket : null;
}

async function uploadTutorAvatar(bucket, uid, filePath) {
  const { buffer, contentType } = await compressImageFile(filePath);
  const objectPath = `${STORAGE_PREFIX}/${uid}.jpg`;
  const token = randomUUID();
  const file = bucket.file(objectPath);
  await file.save(buffer, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return {
    url: storageDownloadUrl(bucket.name, objectPath, token),
    kb: (buffer.length / 1024).toFixed(1),
  };
}

async function resolvePhotoURL(tutor, bucket, uid) {
  if (bucket) {
    try {
      const { url, kb } = await uploadTutorAvatar(bucket, uid, tutor.filePath);
      return { url, source: "storage", detail: `${kb} KB` };
    } catch (err) {
      console.warn("  Storage upload failed:", tutor.fileName, err.message);
    }
  }
  return { url: publicAvatarUrl(tutor.fileName), source: "local", detail: "" };
}

async function upsertTutor({ auth, db, tutor, bucket }) {
  const { name, fileName } = tutor;
  const { firstName, lastName } = nameToFirstLast(name);
  const email = emailFromFirstName(firstName);
  const displayName = [firstName, lastName].filter(Boolean).join(" ").trim() || firstName;

  if (!firstName) {
    console.warn("Skip (no first name):", fileName);
    return;
  }

  let uid;
  let created = false;

  try {
    const userRecord = await auth.createUser({
      email,
      password: SEED_PASSWORD,
      displayName,
      emailVerified: true,
    });
    uid = userRecord.uid;
    created = true;
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
      await auth.updateUser(uid, {
        password: SEED_PASSWORD,
        displayName,
        emailVerified: true,
      });
      console.log("Exists (updating profile):", email);
    } else {
      throw err;
    }
  }

  const { url: photoURL, source, detail } = await resolvePhotoURL(tutor, bucket, uid);

  try {
    await auth.updateUser(uid, { photoURL });
  } catch {
    /* non-https URLs may be rejected */
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  await db.collection("users").doc(uid).set(
    {
      uid,
      email,
      firstName,
      lastName,
      name: displayName,
      role: "tutor",
      photoURL,
      avatar: photoURL,
      roles: { student: false, tutor: true, admin: false },
      university: UNIVERSITY,
      status: "active",
      tutorOnboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  await db.collection("tutorProfiles").doc(uid).set(
    {
      uid,
      firstName,
      lastName,
      displayName,
      photoURL,
      headline: "UCI Tutor",
      university: UNIVERSITY,
      subjects: ["General"],
      isActive: true,
      verificationStatus: "approved",
      ratingAvg: 4.8,
      ratingCount: 12,
      priceLevel: "$$",
      pricePerHour: 35,
      responseTime: "< 1 hour",
      experienceLabel: "Experienced",
      experience: "Experienced",
      updatedAt: now,
      ...(created ? { createdAt: now } : {}),
    },
    { merge: true }
  );

  const sizeNote = detail ? ` ${detail}` : "";
  console.log(
    created ? "Created:" : "Updated:",
    displayName,
    `(${email})`,
    `[${source}${sizeNote}]`
  );
}

async function main() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(credPath, "utf8"));
  } catch {
    console.error(
      "Missing service account key. Set GOOGLE_APPLICATION_CREDENTIALS or place service-account.json in project root."
    );
    process.exit(1);
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  const tutors = listTutorImages();
  if (tutors.length === 0) {
    console.error("No images found in:", tutorsDir);
    process.exit(1);
  }

  syncPublicCopies(tutors);

  const projectId = serviceAccount.project_id || "oc-mentors-socratic";
  const storageBucket = getStorageBucket();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
      storageBucket,
    });
  }

  const auth = admin.auth();
  const db = admin.firestore();
  const bucket = await storageBucketReady();

  console.log("Seeding folder tutors for project:", projectId);
  console.log("Storage bucket:", storageBucket);
  console.log("Password for all accounts:", SEED_PASSWORD);
  console.log("Copied images to public/tutors/");
  console.log("Found", tutors.length, "tutor image(s)\n");

  if (!bucket) {
    console.warn("Storage bucket not found — using local /tutors/ avatar paths.\n");
  } else {
    console.log("Storage ready — compressing and uploading avatars.\n");
  }

  for (const tutor of tutors) {
    try {
      await upsertTutor({ auth, db, tutor, bucket });
    } catch (err) {
      console.error("Failed:", tutor.name, err.message);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
