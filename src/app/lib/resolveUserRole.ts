import { doc, getDoc, type Firestore } from "firebase/firestore";
import type { UserRoles } from "../types/firestore";

export type AppUserRole = "student" | "tutor" | "admin";

export function rolesToRole(roles: UserRoles): AppUserRole {
  if (roles.admin) return "admin";
  if (roles.tutor) return "tutor";
  return "student";
}

/** Read role from a users/{uid} document (new or legacy schema). */
export function roleFromUserDoc(data: Record<string, unknown> | undefined): AppUserRole | null {
  if (!data) return null;
  if (typeof data.roles === "object" && data.roles !== null) {
    return rolesToRole(data.roles as UserRoles);
  }
  const legacy = data.role;
  if (legacy === "student" || legacy === "tutor" || legacy === "admin") {
    return legacy;
  }
  return null;
}

/**
 * When users/{uid} is missing or unreadable on TV, infer role from profile collections.
 * tutorProfiles wins over studentProfiles.
 */
export async function resolveRoleWithProfileFallback(
  db: Firestore,
  uid: string,
  preferred?: AppUserRole | null
): Promise<AppUserRole> {
  if (preferred === "tutor" || preferred === "admin") return preferred;

  try {
    const [tutorSnap, studentSnap, userSnap] = await Promise.all([
      getDoc(doc(db, "tutorProfiles", uid)),
      getDoc(doc(db, "studentProfiles", uid)),
      getDoc(doc(db, "users", uid)),
    ]);

    const fromUser = userSnap.exists()
      ? roleFromUserDoc(userSnap.data() as Record<string, unknown>)
      : null;
    if (fromUser === "admin" || fromUser === "tutor") return fromUser;
    if (tutorSnap.exists()) return "tutor";
    if (fromUser === "student") return "student";
    if (studentSnap.exists()) return "student";
    if (preferred === "student") return "student";
  } catch (e) {
    console.warn("[Auth] resolveRoleWithProfileFallback failed:", e);
  }

  return preferred ?? "student";
}
