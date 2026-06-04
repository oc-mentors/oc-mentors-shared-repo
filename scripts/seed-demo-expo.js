/**
 * Expo demo seed: Maya Chen (student) + James Chen (accessible tutor) + connection + chat.
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *   npm run seed-demo-expo
 *
 * Password for all accounts: password
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const SEED_PASSWORD = "password";
const DEMO_STUDENT_EMAIL = "demo.expo@ocmentors.edu";
const DEMO_TUTOR_EMAIL = "james.chen@ocmentors.edu";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const LEARNING_SUPPORT = {
  dscSupportLevel: "yes",
  conditions: ["ADHD / Attention challenges", "Processing speed differences"],
  accommodations: [
    "Extra time on exams or assignments",
    "Note-taking support",
    "Breaks during exams or study sessions",
  ],
  learningPreferences: ["Shorter study sessions", "Written summaries after sessions"],
  tutoringPreferences: ["Patient pacing", "Step-by-step explanations"],
  learningChallenges: ["Staying focused during long readings", "Starting large assignments"],
};

const JAMES_ACCESSIBILITY = {
  supportedLearningDifferences: [
    "ADHD / Attention challenges",
    "Processing speed differences",
    "Anxiety related to exams or learning",
  ],
  teachingAdjustments: [
    "Breaking problems into smaller steps",
    "Providing written summaries",
    "Flexible pacing during sessions",
    "Allowing extra thinking time before answers",
  ],
  accessibilityExperience: "Yes — I have experience supporting these students",
};

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

async function ensureUser(auth, db, { email, password, displayName, role }) {
  let uid;
  let created = false;
  try {
    const rec = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    uid = rec.uid;
    created = true;
  } catch (err) {
    if (err.code !== "auth/email-already-exists") throw err;
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, { password, displayName, emailVerified: true });
  }

  const isStudent = role === "student";
  const now = admin.firestore.FieldValue.serverTimestamp();
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  await db.collection("users").doc(uid).set(
    {
      uid,
      email,
      firstName,
      lastName,
      name: displayName,
      role,
      roles: { student: isStudent, tutor: !isStudent, admin: false },
      university: "University of California, Irvine",
      status: "active",
      ...(isStudent
        ? {
            year: "Sophomore",
            major: ["Chemistry", "Education Sciences"],
            learningStyle: "Visual",
            learningStyleQuestionAnswers: [
              { question: "When learning something new, I prefer to:", answer: "See diagrams, charts, or videos" },
              { question: "In a lecture, I learn best when the professor:", answer: "Uses slides and visual aids" },
              { question: "When studying for a test, I usually:", answer: "Rewrite notes and use color coding" },
              { question: "I understand a concept best when I:", answer: "Draw it out or watch a demonstration" },
            ],
            learningSupport: LEARNING_SUPPORT,
          }
        : {}),
      updatedAt: now,
      ...(created ? { createdAt: now } : {}),
    },
    { merge: true }
  );

  if (isStudent) {
    await db.collection("studentProfiles").doc(uid).set(
      {
        uid,
        firstName,
        lastName,
        displayName,
        learningStyle: "Visual",
        updatedAt: now,
      },
      { merge: true }
    );
  } else {
    await db.collection("tutorProfiles").doc(uid).set(
      {
        uid,
        displayName,
        firstName,
        lastName,
        headline: "Chemistry & Biology • Senior",
        bio: "Hi! I'm James, a Chemistry and Biology double major. I love helping students with ADHD using shorter bursts, check-ins, and written recaps.",
        subjects: ["Science", "Chemistry", "Biology", "Organic Chemistry"],
        university: "University of California, Irvine",
        isActive: true,
        ratingAvg: 4.7,
        ratingCount: 156,
        ...JAMES_ACCESSIBILITY,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  return { uid, created };
}

async function ensureConnection(db, studentUid, tutorUid) {
  const existing = await db
    .collection("connections")
    .where("studentUid", "==", studentUid)
    .where("tutorUid", "==", tutorUid)
    .limit(1)
    .get();

  if (!existing.empty) {
    const d = existing.docs[0];
    console.log("Connection exists:", d.id);
    return { connectionId: d.id, conversationId: d.data().conversationId };
  }

  const convRef = db.collection("conversations").doc();
  const connRef = db.collection("connections").doc();
  const now = admin.firestore.FieldValue.serverTimestamp();

  await convRef.set({
    type: "direct",
    participantUids: [studentUid, tutorUid],
    participantSummary: {
      [studentUid]: {
        displayName: "Maya Chen",
        firstName: "Maya",
        role: "student",
      },
      [tutorUid]: {
        displayName: "James Chen",
        firstName: "James",
        role: "tutor",
      },
    },
    connectionId: connRef.id,
    lastMessageText: "Hi Maya — want to review limiting reagents before your lab due date?",
    lastMessageSenderUid: tutorUid,
    lastMessageAt: now,
    createdAt: now,
    updatedAt: now,
  });

  await connRef.set({
    studentUid,
    tutorUid,
    requestId: "demo-expo-seed",
    status: "active",
    conversationId: convRef.id,
    studentDisplayName: "Maya Chen",
    createdAt: now,
    endedAt: null,
  });

  const messages = [
    {
      senderUid: tutorUid,
      text: "Hi Maya — want to review limiting reagents before your lab due date?",
    },
    {
      senderUid: studentUid,
      text: "Yes please! I get stuck after I balance the equation.",
    },
    {
      senderUid: tutorUid,
      text: "Perfect — we'll start with what you're given vs. what you need to find. No shortcuts.",
    },
  ];

  for (const m of messages) {
    await convRef.collection("messages").add({
      senderUid: m.senderUid,
      text: m.text,
      createdAt: now,
    });
  }

  console.log("Created connection:", connRef.id, "conversation:", convRef.id);
  return { connectionId: connRef.id, conversationId: convRef.id };
}

async function main() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "service-account.json");
  try {
    readFileSync(credPath, "utf8");
  } catch {
    console.error("Missing service-account.json — set GOOGLE_APPLICATION_CREDENTIALS");
    process.exit(1);
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  const projectId = getProjectId();
  if (!admin.apps.length) admin.initializeApp({ projectId });
  const auth = admin.auth();
  const db = admin.firestore();

  console.log("Seeding Expo demo for project:", projectId);
  console.log("Password:", SEED_PASSWORD);

  const student = await ensureUser(auth, db, {
    email: DEMO_STUDENT_EMAIL,
    password: SEED_PASSWORD,
    displayName: "Maya Chen",
    role: "student",
  });
  console.log(student.created ? "Created student:" : "Updated student:", DEMO_STUDENT_EMAIL);

  const tutor = await ensureUser(auth, db, {
    email: DEMO_TUTOR_EMAIL,
    password: SEED_PASSWORD,
    displayName: "James Chen",
    role: "tutor",
  });
  console.log(tutor.created ? "Created tutor:" : "Updated tutor:", DEMO_TUTOR_EMAIL);

  await ensureConnection(db, student.uid, tutor.uid);

  console.log("\nDone. In the app tap **Expo Demo** on the login screen.");
  console.log("Student:", DEMO_STUDENT_EMAIL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
