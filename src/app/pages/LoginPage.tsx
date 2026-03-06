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
  const { login, signup } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [slideDir, setSlideDir] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (role: UserRole) => {
    setSlideDir(1);
    setSelectedRole(role);
  };

  const handleChangeRole = () => {
    setSlideDir(-1);
    setSelectedRole(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    setShowForgotPasswordModal(false);
    try {
      if (mode === "login") {
        await login(email, password, selectedRole);
      } else {
        await signup(name, email, password, selectedRole);
      }
      // Auth context now handles showLoginAnimation + routing redirect
    } catch (error) {
      console.error("Auth error:", error);
      setIsLoading(false);
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
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full rounded-2xl py-4 font-semibold text-white shadow-lg transition-all ${
                    isFormValid
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