import { Link } from "react-router";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import svgPaths from "../../imports/svg-2ctauirw4p";
import { ProfileButton } from "../components/ProfileButton";

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [sound, setSound] = useState(false);

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with Profile Button */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-[#e8edf5]">Settings</h1>
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
            <h2 className="text-[13px] font-semibold text-[#a8b3cf] uppercase tracking-wider mb-4">
              Account
            </h2>
            <div className="space-y-3">
              {/* Edit Profile */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip-user)">
                        <circle cx="10" cy="10" r="8.33" stroke="#2B7FFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="10" cy="8.33" r="2.5" stroke="#2B7FFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p327551d3} stroke="#2B7FFF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip-user">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#e8edf5]">Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
              </motion.button>

              {/* Change Password */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
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
                  <span className="text-[15px] font-medium text-[#e8edf5]">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
              </motion.button>

              {/* Academic Information */}
              <Link to="/progress">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
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
                    <span className="text-[15px] font-medium text-[#e8edf5]">Academic Information</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
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
            <h2 className="text-[13px] font-semibold text-[#a8b3cf] uppercase tracking-wider mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              {/* Push Notifications */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#FF9500]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#e8edf5]">Push Notifications</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                    pushNotifications ? "bg-[#5b7ceb]" : "bg-[#4a4f6a]"
                  }`}
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
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#34C759]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#e8edf5]">Email Updates</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                    emailUpdates ? "bg-[#5b7ceb]" : "bg-[#4a4f6a]"
                  }`}
                >
                  <motion.div
                    animate={{ x: emailUpdates ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </motion.div>

              {/* Sound */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-[#5856D6]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#e8edf5]">Sound</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSound(!sound)}
                  className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                    sound ? "bg-[#5b7ceb]" : "bg-[#4a4f6a]"
                  }`}
                >
                  <motion.div
                    animate={{ x: sound ? 20 : 0 }}
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
            <h2 className="text-[13px] font-semibold text-[#a8b3cf] uppercase tracking-wider mb-4">
              Preferences
            </h2>
            <div className="space-y-3">
              {/* Language */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2a2f4a] rounded-[16px] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#5b7ceb]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#e8edf5]">Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-[#a8b3cf]">English</span>
                  <ChevronRight className="w-5 h-5 text-[#a8b3cf]" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage="profile" />
    </div>
  );
}