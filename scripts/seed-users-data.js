/**
 * Seed users from the UI: tutors, professors, TAs, peers, students.
 * All accounts use password: "password"
 */
export const SEED_PASSWORD = "password";

export const seedUsers = [
  // —— Tutors (TutorDetailPage) ——
  { name: "Debra Peterson", email: "debra.peterson@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1600081687786-ce51e1e49ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Adam Smith", email: "adam.smith@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1621533463397-f292bd0745f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Maarya Khan", email: "maarya.khan@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "James Chen", email: "james.chen@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Emily Rodriguez", email: "emily.rodriguez@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Sarah Martinez", email: "sarah.martinez@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "David Kim", email: "david.kim@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  // Tutors from SubjectTutorsPage
  { name: "Michael Torres", email: "michael.torres@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  { name: "Jennifer Lee", email: "jennifer.lee@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  { name: "David Park", email: "david.park@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  { name: "Jessica Park", email: "jessica.park@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  // —— Professors (app role: tutor for faculty) ——
  { name: "Dr. Robert Chen", email: "robert.chen@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Dr. Sarah Chen", email: "sarah.chen@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  { name: "Dr. Martinez", email: "martinez@ocmentors.edu", role: "tutor", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { name: "Dr. Sarah Johnson", email: "sarah.johnson@ocmentors.edu", role: "tutor", university: "University of California, Irvine" },
  // —— TA (Emily is tutor; add a dedicated TA if needed - reusing professor-style for "TA" role we'd need role "tutor" or "admin" - app has student | tutor | admin, so TAs as tutors) ——
  // Peer
  { name: "Marcus Williams", email: "marcus.williams@ocmentors.edu", role: "student", university: "University of California, Irvine", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  // —— Students (TutorStudentsPage) ——
  { name: "Emily Johnson", email: "emily.johnson@ocmentors.edu", role: "student", university: "University of California, Irvine" },
  { name: "Marcus Chen", email: "marcus.chen@ocmentors.edu", role: "student", university: "University of California, Irvine" },
  { name: "Sarah Williams", email: "sarah.williams@ocmentors.edu", role: "student", university: "University of California, Irvine" },
  { name: "Alex Rivera", email: "alex.rivera@ocmentors.edu", role: "student", university: "University of California, Irvine" },
  { name: "Jessica Park", email: "jessica.park.student@ocmentors.edu", role: "student", university: "University of California, Irvine" },
];
