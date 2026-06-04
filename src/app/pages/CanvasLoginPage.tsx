import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { BottomNav } from "../components/BottomNav";
import { CanvasLogoutButton } from "../components/CanvasLogoutButton";

export default function CanvasLoginPage() {
  const navigate = useNavigate();
  const { connectCanvas, isCanvasConnected } = useCanvasAuth();
  const { loadMockCanvasCatalog } = useCanvasCourses();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Canvas sign-in, then import mock classes
    setTimeout(async () => {
      connectCanvas();
      await loadMockCanvasCatalog();
      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/canvas-classes");
      }, 2000);
    }, 1500);
  };

  if (isCanvasConnected && !showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-[#1a1d29] flex flex-col items-center justify-center px-6 pb-20"
      >
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#22c55e] flex items-center justify-center">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#e8edf5] mb-2">Canvas is connected</h1>
          <p className="text-sm text-[#a8b3cf] mb-8">
            Your courses and assignments are linked to Socratic OC on this device.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/canvas-classes")}
              className="w-full py-3 bg-[#5b7ceb] text-white font-semibold rounded-xl"
            >
              Open Canvas hub
            </motion.button>
            <CanvasLogoutButton className="!border-[rgba(255,255,255,0.12)] !bg-[#1e2139] !text-[#fca5a5]" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 text-[#a8b3cf] font-semibold rounded-xl border border-[rgba(255,255,255,0.12)]"
            >
              Go back
            </motion.button>
          </div>
        </div>
        <BottomNav currentPage="canvas" />
      </motion.div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#1a1d29] flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Success Checkmark Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Outer glow ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#22c55e]"
              />
              
              {/* Main circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-[0_0_40px_rgba(34,197,94,0.4)]"
              />
              
              {/* Checkmark */}
              <svg
                className="absolute inset-0 w-full h-full p-8"
                viewBox="0 0 52 52"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>

          {/* Success Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#e8edf5] mb-2">
              Connected Successfully!
            </h2>
            <p className="text-sm text-[#a8b3cf]">
              Your Canvas account is now linked to Socratic OC
            </p>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-[#5b7ceb] rounded-full"
              />
            ))}
          </motion.div>
        </div>
        <BottomNav currentPage="canvas" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] flex flex-col items-center justify-center px-6 pb-20">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Canvas Logo */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#e13f2b] flex items-center justify-center">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="white">
              <path d="M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2ZM21 20H3V4H21V20Z" />
              <path d="M7 17H9V7H7V17ZM11 17H13V7H11V17ZM15 17H17V7H15V17Z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#e8edf5] mb-2">Connect to Canvas</h1>
          <p className="text-sm text-[#a8b3cf]">
            Sign in with your Canvas credentials to sync your courses and announcements
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#e8edf5] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.edu"
              required
              className="w-full px-4 py-3 bg-[#1e2139] border border-[rgba(255,255,255,0.12)] rounded-xl text-[#e8edf5] placeholder-[#6b7280] focus:outline-none focus:border-[#5b7ceb] transition-colors"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#e8edf5] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#1e2139] border border-[rgba(255,255,255,0.12)] rounded-xl text-[#e8edf5] placeholder-[#6b7280] focus:outline-none focus:border-[#5b7ceb] transition-colors"
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#e13f2b] text-white font-semibold rounded-xl shadow-lg hover:bg-[#c23525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </span>
            ) : (
              "Sign In to Canvas"
            )}
          </motion.button>

          {/* Cancel Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-[#1e2139] text-[#a8b3cf] font-semibold rounded-xl border border-[rgba(255,255,255,0.12)] hover:bg-[#252837] transition-colors"
          >
            Cancel
          </motion.button>
        </motion.form>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-[#1e2139] border border-[rgba(255,255,255,0.08)] rounded-xl"
        >
          <p className="text-xs text-[#a8b3cf] text-center">
            By connecting Canvas, you'll be able to view your courses, assignments, and announcements directly in Socratic OC.
          </p>
        </motion.div>
      </div>
      <BottomNav currentPage="canvas" />
    </div>
  );
}