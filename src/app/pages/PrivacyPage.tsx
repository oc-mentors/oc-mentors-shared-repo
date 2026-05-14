import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Introduction",
    body: (
      <p className="text-sm leading-relaxed">
        Socratic OC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of our users,
        including high school students aged 13 to 17 and their parents. This Privacy Policy explains how we collect, use,
        protect, and share personal and educational information. By using our website, you agree to the terms of this
        Privacy Policy.
      </p>
    ),
  },
  {
    title: "Information We Collect",
    body: (
      <>
        <p className="text-sm leading-relaxed mb-2">We may collect the following categories of information:</p>
        <ul className="text-sm space-y-1 ml-4 list-disc">
          <li>
            <strong>Personal information:</strong> Name, email address, and phone number.
          </li>
          <li>
            <strong>Educational information:</strong> Academic records, assignments, grades, and other data provided by
            students, parents, or schools.
          </li>
          <li>
            <strong>Usage data:</strong> Non-identifiable information such as browser type, pages visited, and time
            spent on the site.
          </li>
          <li>
            <strong>Cookies and tracking:</strong> Data collected through cookies and similar technologies to improve
            your experience.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Purposes for Collection",
    body: (
      <>
        <p className="text-sm leading-relaxed mb-2">We use your information to:</p>
        <ol className="text-sm space-y-1 ml-4 list-decimal">
          <li>
            <strong>Educational services:</strong> Provide updates, educational content, and events related to OC
            Mentors.
          </li>
          <li>
            <strong>Account management:</strong> Create and manage user accounts, including parental controls where
            applicable.
          </li>
          <li>
            <strong>Analytics and improvements:</strong> Analyze usage and improve our services.
          </li>
          <li>
            <strong>Compliance:</strong> Meet legal obligations, including FERPA, COPPA, and CCPA/CPRA where applicable.
          </li>
        </ol>
      </>
    ),
  },
  {
    title: "How We Protect Your Information",
    body: (
      <p className="text-sm leading-relaxed">
        We implement reasonable administrative, technical, and physical safeguards to protect your information from
        unauthorized access, disclosure, or misuse, including encryption, secure servers, and access controls.
      </p>
    ),
  },
  {
    title: "Sharing of Information",
    body: (
      <>
        <p className="text-sm leading-relaxed mb-2">
          We do not sell your personal or educational information. We may share information only when:
        </p>
        <ul className="text-sm space-y-1 ml-4 list-disc">
          <li>
            <strong>Service providers:</strong> Trusted vendors who help us operate the platform.
          </li>
          <li>
            <strong>Schools or institutions:</strong> As required for educational services or FERPA compliance.
          </li>
          <li>
            <strong>Legal requirements:</strong> When required by law, subpoena, or court order.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Your Rights",
    body: (
      <>
        <p className="text-sm leading-relaxed mb-2">Depending on applicable law, you may have the right to:</p>
        <ol className="text-sm space-y-1 ml-4 list-decimal">
          <li>
            <strong>Access</strong> the information we hold about you.
          </li>
          <li>
            <strong>Correct</strong> inaccurate or incomplete information.
          </li>
          <li>
            <strong>Delete</strong> your personal information, subject to legal exceptions.
          </li>
          <li>
            <strong>Opt out</strong> of certain sharing if you are aged 13 to 16 in applicable jurisdictions.
          </li>
        </ol>
        <p className="text-sm leading-relaxed mt-3">
          To exercise these rights, contact us at{" "}
          <a href="mailto:octutoringservice@gmail.com" className="font-semibold underline">
            octutoringservice@gmail.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Parental Rights and Consent",
    body: (
      <>
        <p className="text-sm leading-relaxed mb-2">For users under 18, parents or guardians may:</p>
        <ul className="text-sm space-y-1 ml-4 list-disc">
          <li>Review information collected about their child.</li>
          <li>Request deletion of their child&apos;s information.</li>
          <li>Refuse further collection or use of their child&apos;s information.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          We require verifiable parental consent before collecting personal information from children under 13, in line
          with COPPA.
        </p>
      </>
    ),
  },
  {
    title: "Data Retention",
    body: (
      <p className="text-sm leading-relaxed">
        We retain information only as long as necessary for the purposes in this policy or as required by law, then
        securely delete or anonymize it.
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p className="text-sm leading-relaxed">
        Questions about this policy or our practices:{" "}
        <a href="mailto:octutoringservice@gmail.com" className="font-semibold underline">
          octutoringservice@gmail.com
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { colors, accentColor } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (isAuthenticated) navigate("/home");
    else navigate(-1);
  };

  return (
    <div className={isAuthenticated ? "min-h-screen pb-24" : "min-h-screen pb-8"} style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto px-6">
        <div className="relative flex items-center justify-center min-h-[4rem] pt-12 pb-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.bgTertiary }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </motion.button>
          </div>
          <h1 className="text-lg font-bold text-center w-full px-14" style={{ color: colors.textPrimary }}>
            Privacy
          </h1>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex w-16 items-center justify-center">
            {isAuthenticated ? <ProfileButton /> : <span className="inline-block w-10 h-10 shrink-0" aria-hidden />}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.35)] space-y-6 mb-6"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, borderWidth: 1 }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Privacy Policy
          </h2>
          <p className="text-xs" style={{ color: colors.textTertiary }}>
            Socratic OC, last updated 2026
          </p>
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h3 className="text-base font-bold mb-2" style={{ color: accentColor.primary }}>
                {s.title}
              </h3>
              <div style={{ color: colors.textSecondary }}>{s.body}</div>
            </section>
          ))}
          <p className="text-xs italic pt-4 border-t" style={{ color: colors.textTertiary, borderColor: colors.borderSecondary }}>
            As a parent or guardian, you acknowledge you have read and understand this Privacy Policy when your student
            uses Socratic OC.
          </p>
        </div>

        {!isAuthenticated && (
          <p className="text-center pb-8 text-sm">
            <Link to="/login" className="font-semibold underline" style={{ color: accentColor.primary }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
