import { Link } from "react-router";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import svgPaths from "../../imports/svg-2ctauirw4p";
import { ProfileButton } from "../components/ProfileButton";
import { EditProfileModal } from "../components/EditProfileModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight, Bell, Mail, Volume2, Lock, Shield, LogOut, Globe, Palette, Moon, Sun, Check } from "lucide-react";
import { useTheme, accentColors } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const { mode, accentColor, setMode, setAccentColor, toggleMode, colors } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAccentModal, setShowAccentModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with Profile Button */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>Settings</h1>
            <ProfileButton />
          </div>
        </div>

        {/* Settings Content */}
        <div className="px-6">
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Account
            </h2>
            <div className="space-y-3">
              {/* Edit Profile */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
                onClick={() => setShowEditProfileModal(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip-user)">
                        <circle cx="10" cy="10" r="8.33" stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="10" cy="8.33" r="2.5" stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p327551d3} stroke={accentColor.primary} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip-user">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>

              {/* Change Password */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
                onClick={() => setShowChangePasswordModal(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip-lock)">
                        <rect x="2.5" y="9.17" width="15" height="9.17" rx="1.67" stroke="#AD46FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p16b5f400} stroke="#AD46FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip-lock">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.button>

              {/* Academic Information */}
              <Link to="/progress">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                        <g clipPath="url(#clip-academic)">
                          <path d={svgPaths.p2004c080} stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.33 8.33V13.33" stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={svgPaths.p916cd00} stroke="#F6339A" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip-academic">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Academic Information</span>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Notifications
            </h2>
            <div className="space-y-3">
              {/* Push Notifications */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Bell className="w-5 h-5 text-[#FF9500]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Push Notifications</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: pushNotifications ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: pushNotifications ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>

              {/* Email Updates */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Mail className="w-5 h-5 text-[#34C759]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Email Updates</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors"
                  style={{ backgroundColor: emailUpdates ? accentColor.primary : colors.bgTertiary }}
                >
                  <motion.div
                    animate={{ x: emailUpdates ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: colors.textSecondary }}>
              Preferences
            </h2>
            <div className="space-y-3">
              {/* Language */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Globe className="w-5 h-5" style={{ color: accentColor.primary }} />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px]" style={{ color: colors.textSecondary }}>English</span>
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </div>
              </motion.button>

              {/* Theme */}
              <Link to="/theme-customization">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                      {mode === "dark" ? (
                        <Moon className="w-5 h-5" style={{ color: accentColor.primary }} />
                      ) : (
                        <Sun className="w-5 h-5" style={{ color: accentColor.primary }} />
                      )}
                    </div>
                    <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Appearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full shadow-md"
                      style={{ backgroundColor: accentColor.primary }}
                    />
                    <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  </div>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage="profile" />
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}