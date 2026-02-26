import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string; // Optional - if provided, it's for forgot password (no current password needed)
  isForgotPassword?: boolean;
}

export function ChangePasswordModal({ 
  isOpen, 
  onClose, 
  email: providedEmail,
  isForgotPassword = false 
}: ChangePasswordModalProps) {
  const { colors, accentColor } = useTheme();
  const { user, changePassword } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(providedEmail || "");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(isForgotPassword);
  const [emailSent, setEmailSent] = useState(false);

  // Get stored password for validation
  const getStoredPassword = (email: string): string | null => {
    const stored = localStorage.getItem("user_passwords_v1");
    if (!stored) return null;
    const passwords = JSON.parse(stored);
    return passwords[email] || null;
  };

  const handleSubmit = async () => {
    setError("");
    
    // Forgot password mode - just collect email
    if (forgotPasswordMode && !emailSent) {
      if (!email) {
        setError("Please enter your email");
        return;
      }
      
      // Check if email exists
      const storedPassword = getStoredPassword(email);
      if (!storedPassword) {
        setError("Email not found");
        return;
      }
      
      // Show email sent confirmation
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
      setLoading(false);
      return;
    }
    
    // Forgot password mode - reset password
    if (forgotPasswordMode && emailSent) {
      if (!newPassword) {
        setError("Please enter a new password");
        return;
      }

      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        setLoading(true);
        await changePassword(email, newPassword);
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } catch (err) {
        setError("Failed to change password. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Regular change password mode - validate current password
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    
    // Validate current password matches stored password
    const storedPassword = getStoredPassword(user?.email || "");
    if (storedPassword && currentPassword !== storedPassword) {
      setError("Current password is incorrect");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const emailToUse = user?.email;
      
      if (!emailToUse) {
        setError("No email found");
        return;
      }

      await changePassword(emailToUse, newPassword);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEmail("");
    setError("");
    setSuccess(false);
    setForgotPasswordMode(isForgotPassword);
    setEmailSent(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
            style={{
              backgroundColor: colors.bgCard,
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentColor.background }}
                >
                  {forgotPasswordMode && !emailSent ? (
                    <Mail className="w-5 h-5" style={{ color: accentColor.primary }} />
                  ) : (
                    <Lock className="w-5 h-5" style={{ color: accentColor.primary }} />
                  )}
                </div>
                <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
                  {forgotPasswordMode && !emailSent ? "Forgot Password" : forgotPasswordMode ? "Reset Password" : "Change Password"}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary }}
              >
                <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {success ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: accentColor.background }}
                  >
                    <Lock className="w-8 h-8" style={{ color: accentColor.primary }} />
                  </div>
                  <h3 className="text-[20px] font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Password Changed!
                  </h3>
                  <p className="text-[14px]" style={{ color: colors.textSecondary }}>
                    Your password has been updated successfully.
                  </p>
                </motion.div>
              ) : forgotPasswordMode && !emailSent ? (
                <>
                  {/* Forgot Password - Email Collection */}
                  <div>
                    <p className="text-[14px] mb-4" style={{ color: colors.textSecondary }}>
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: "#FEE2E2" }}
                    >
                      <p className="text-[14px]" style={{ color: "#DC2626" }}>
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                      style={{
                        backgroundColor: colors.bgTertiary,
                        color: colors.textPrimary,
                      }}
                      type="button"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ 
                        backgroundColor: loading ? colors.textSecondary : accentColor.primary,
                        opacity: loading ? 0.7 : 1,
                      }}
                      type="button"
                    >
                      {loading ? "Sending..." : "Send Email"}
                    </motion.button>
                  </div>

                  {/* Back to login link */}
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setForgotPasswordMode(false)}
                      className="text-[14px] font-medium"
                      style={{ color: accentColor.primary }}
                    >
                      Back to Change Password
                    </button>
                  </div>
                </>
              ) : forgotPasswordMode && emailSent ? (
                <>
                  {/* Email Sent Confirmation - Now show password reset fields */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: accentColor.background }}
                    >
                      <Mail className="w-8 h-8" style={{ color: accentColor.primary }} />
                    </div>
                    <h3 className="text-[18px] font-bold mb-2" style={{ color: colors.textPrimary }}>
                      Email Sent!
                    </h3>
                    <p className="text-[14px] mb-4" style={{ color: colors.textSecondary }}>
                      We've sent password reset instructions to <span className="font-semibold">{email}</span>
                    </p>
                    <p className="text-[14px] mb-6" style={{ color: colors.textSecondary }}>
                      Enter your new password below:
                    </p>
                  </motion.div>

                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border transition-colors"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          borderColor: colors.borderPrimary,
                          color: colors.textPrimary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        ) : (
                          <Eye className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border transition-colors"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          borderColor: colors.borderPrimary,
                          color: colors.textPrimary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        ) : (
                          <Eye className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: "#FEE2E2" }}
                    >
                      <p className="text-[14px]" style={{ color: "#DC2626" }}>
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                      style={{
                        backgroundColor: colors.bgTertiary,
                        color: colors.textPrimary,
                      }}
                      type="button"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ 
                        backgroundColor: loading ? colors.textSecondary : accentColor.primary,
                        opacity: loading ? 0.7 : 1,
                      }}
                      type="button"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  {/* Regular Change Password Mode */}
                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border transition-colors"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          borderColor: colors.borderPrimary,
                          color: colors.textPrimary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        ) : (
                          <Eye className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        )}
                      </button>
                    </div>
                    {/* Forgot Password Link */}
                    <div className="mt-2">
                      <button
                        onClick={() => {
                          setForgotPasswordMode(true);
                          setEmail(user?.email || "");
                          setCurrentPassword("");
                          setError("");
                        }}
                        className="text-[12px] font-medium"
                        style={{ color: accentColor.primary }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border transition-colors"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          borderColor: colors.borderPrimary,
                          color: colors.textPrimary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        ) : (
                          <Eye className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border transition-colors"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          borderColor: colors.borderPrimary,
                          color: colors.textPrimary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        ) : (
                          <Eye className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: "#FEE2E2" }}
                    >
                      <p className="text-[14px]" style={{ color: "#DC2626" }}>
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                      style={{
                        backgroundColor: colors.bgTertiary,
                        color: colors.textPrimary,
                      }}
                      type="button"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ 
                        backgroundColor: loading ? colors.textSecondary : accentColor.primary,
                        opacity: loading ? 0.7 : 1,
                      }}
                      type="button"
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}