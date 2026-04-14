import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, GraduationCap, Users, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, UserRole } from "../contexts/AuthContext";
import { ChangePasswordModal } from "../components/ChangePasswordModal";

// Slide direction variants: dir=1 → forward (role→form), dir=-1 → back (form→role)
const panelVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -40,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LoginPage() {
  const { login, signup, loginWithGoogle } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [slideDir, setSlideDir] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (role: UserRole) => {
    setSlideDir(1);
    setSelectedRole(role);
    setError(null);
  };

  const handleChangeRole = () => {
    setSlideDir(-1);
    setSelectedRole(null);
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    setError(null);
    setShowForgotPasswordModal(false);

    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => {
      setError("This is taking longer than usual. Check your connection and try again.");
      setIsLoading(false);
    }, timeoutMs);

    try {
      if (mode === "login") {
        await login(email, password, selectedRole);
      } else {
        await signup(name, email, password, selectedRole);
      }
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      let message: string;
      if (code === "auth/user-not-found") {
        message = "No account found. Please sign up first.";
        if (mode === "login") setMode("signup");
      } else if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        message = "Wrong email or password. Please try again.";
      } else if (code === "auth/email-already-in-use") {
        message = "This email is already registered. Try signing in.";
      } else if (code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else {
        message = "Something went wrong. Please try again.";
      }
      setError(message);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRole) return;
    setIsGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle(selectedRole);
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "code" in err
        ? (err as { code: string }).code === "auth/popup-closed-by-user"
          ? "Sign-in was cancelled."
          : "Something went wrong with Google sign-in. Try again."
        : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isFormValid = selectedRole && email && password && (mode === "login" || name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#2a2f45] to-[#1a1d29] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] rounded-3xl flex items-center justify-center shadow-[0px_8px_24px_0px_rgba(67,97,217,0.4)]">
            <span className="text-4xl font-bold text-white">OC</span>
          </div>
          <h1 className="text-3xl font-bold text-[#e8edf5] mb-2">
            {mode === "login" ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-[#a8b3cf]">
            {mode === "login" ? "Sign in to continue your learning" : "Create your account to begin"}
          </p>
        </motion.div>

        {/* Single AnimatePresence — role picker OR auth form */}
        <AnimatePresence mode="wait" custom={slideDir}>
          {!selectedRole ? (
            <motion.div
              key="role-picker"
              custom={slideDir}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="mb-6"
            >
              <h2 className="text-lg font-semibold text-[#e8edf5] mb-4 text-center">
                I am a...
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Student Role */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("student")}
                  className="bg-[#1e2139] rounded-2xl p-6 border-2 border-transparent hover:border-[#5b7ceb] transition-all shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] rounded-2xl flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-base font-semibold text-[#e8edf5]">Student</span>
                  </div>
                </motion.button>

                {/* Tutor/Admin Role */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("tutor")}
                  className="bg-[#1e2139] rounded-2xl p-6 border-2 border-transparent hover:border-[#8b5cf6] transition-all shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-base font-semibold text-[#e8edf5]">Tutor/Admin</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              custom={slideDir}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Selected Role Badge */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  selectedRole === "student" 
                    ? "bg-[#4361d9]/20 border border-[#4361d9]/40" 
                    : "bg-[#8b5cf6]/20 border border-[#8b5cf6]/40"
                }`}>
                  {selectedRole === "student" ? (
                    <GraduationCap className="w-4 h-4 text-[#5b7ceb]" />
                  ) : (
                    <Users className="w-4 h-4 text-[#8b5cf6]" />
                  )}
                  <span className={`text-sm font-medium ${
                    selectedRole === "student" ? "text-[#5b7ceb]" : "text-[#8b5cf6]"
                  }`}>
                    {selectedRole === "student" ? "Student" : "Tutor/Admin"}
                  </span>
                </div>
                <button
                  onClick={handleChangeRole}
                  className="text-sm text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Signup only) */}
                <AnimatePresence>
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-[#1e2139] rounded-2xl p-4 flex items-center gap-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
                        <User className="w-5 h-5 text-[#a8b3cf]" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className="flex-1 bg-transparent text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div className="bg-[#1e2139] rounded-2xl p-4 flex items-center gap-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
                  <Mail className="w-5 h-5 text-[#a8b3cf]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="flex-1 bg-transparent text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none"
                  />
                </div>

                {/* Password Field */}
                <div className="bg-[#1e2139] rounded-2xl p-4 flex items-center gap-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
                  <Lock className="w-5 h-5 text-[#a8b3cf]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="flex-1 bg-transparent text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-2">
                    {error}
                  </p>
                )}

                {/* Forgot Password Link */}
                {mode === "login" && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-sm text-[#a8b3cf] hover:text-[#5b7ceb] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isFormValid && !isGoogleLoading ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid && !isGoogleLoading ? 0.98 : 1 }}
                  type="submit"
                  disabled={!isFormValid || isLoading || isGoogleLoading}
                  className={`w-full rounded-2xl py-4 font-semibold text-white shadow-lg transition-all ${
                    isFormValid && !isGoogleLoading
                      ? "bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] hover:shadow-[0px_8px_24px_0px_rgba(67,97,217,0.4)]"
                      : "bg-[#2a2f45] cursor-not-allowed opacity-50"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Please wait...</span>
                    </div>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </motion.button>

                {/* Google Sign-In */}
                <motion.button
                  whileHover={{ scale: isGoogleLoading || isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isGoogleLoading || isLoading ? 1 : 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-3 font-semibold transition-all shadow-[0px_4px_16px_0px_rgba(0,0,0,0.4)]"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#3c4043",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                      <span>Signing in with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        <path fill="none" d="M0 0h48v48H0z"/>
                      </svg>
                      <span>{mode === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-[#a8b3cf]">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-[#5b7ceb] font-semibold hover:text-[#7c9ef5] transition-colors"
                  >
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChangePasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        isForgotPassword={true}
      />
    </div>
  );
}