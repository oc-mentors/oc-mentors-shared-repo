/**
 * Create student accounts from judges/*.png (filename = full name).
 * Email: {firstname}@uci.edu  |  Password: password
 *
 * Avatars: compressed (same limits as EditProfileModal) and uploaded to
 * Firebase Storage at judges/{uid}.jpg when the bucket exists.
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *   npm run seed-judge-students
 */

import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, readdirSync } from "fs";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join, extname, basename } from "path";
import { compressImageFile } from "./lib/compressAvatarImage.mjs";

const SEED_PASSWORD = "password";
const UNIVERSITY = "University of California, Irvine";
const STORAGE_PREFIX = "judges";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const judgesDir = join(projectRoot, "judges");

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

function listJudgeImages() {
  const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
  return readdirSync(judgesDir)
    .filter((f) => allowed.has(extname(f).toLowerCase()))
    .map((f) => ({
      fileName: f,
      filePath: join(judgesDir, f),
      name: basename(f, extname(f)).trim(),
    }))
    .filter((j) => j.name.length > 0);
}

function publicAvatarUrl(fileName) {
  return `/judges/${encodeURIComponent(fileName)}`;
}

function storageDownloadUrl(bucketName, objectPath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

async function storageBucketReady() {
  const bucket = getStorage().bucket();
  const [exists] = await bucket.exists();
  return exists ? bucket : null;
}

async function uploadJudgeAvatar(bucket, uid, filePath) {
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
  const kb = (buffer.length / 1024).toFixed(1);
  return {
    url: storageDownloadUrl(bucket.name, objectPath, token),
    kb,
  };
}

async function resolvePhotoURL(judge, bucket, uid) {
  if (bucket) {
    try {
      const { url, kb } = await uploadJudgeAvatar(bucket, uid, judge.filePath);
      return { url, source: "storage", detail: `${kb} KB` };
    } catch (err) {
      console.warn("  Storage upload failed:", judge.fileName, err.message);
    }
  }
  return { url: publicAvatarUrl(judge.fileName), source: "local", detail: "" };
}

async function upsertStudent({ auth, db, judge, bucket }) {
  const { name, fileName } = judge;
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

  const { url: photoURL, source, detail } = await resolvePhotoURL(judge, bucket, uid);

  try {
    await auth.updateUser(uid, { photoURL });
  } catch {
    /* Auth may reject non-https photoURL; Firestore still stores it */
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.collection("users").doc(uid).set(
    {
      uid,
      email,
      firstName,
      lastName,
      name: displayName,
      role: "student",
      photoURL,
      avatar: photoURL,
      roles: { student: true, tutor: false, admin: false },
      university: UNIVERSITY,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  await db.collection("studentProfiles").doc(uid).set(
    {
      uid,
      firstName,
      lastName,
      displayName,
      photoURL,
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

  const judges = listJudgeImages();
  if (judges.length === 0) {
    console.error("No images found in:", judgesDir);
    process.exit(1);
  }

  const projectId = serviceAccount.project_id || getProjectId();
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

  console.log("Seeding judge students for project:", projectId);
  console.log("Storage bucket:", storageBucket);
  console.log("Password for all accounts:", SEED_PASSWORD);
  console.log("Found", judges.length, "judge image(s)\n");

  if (!bucket) {
    console.warn(
      "Firebase Storage bucket not found. Enable Storage in Firebase Console (Build → Storage → Get started)."
    );
    console.warn(
      "GCP billing must be enabled. Falling back to local /judges/ paths.\n"
    );
  } else {
    console.log("Storage ready — compressing and uploading avatars (max 512px, ~280 KB).\n");
  }

  for (const judge of judges) {
    try {
      await upsertStudent({ auth, db, judge, bucket });
    } catch (err) {
      console.error("Failed:", judge.name, err.message);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
