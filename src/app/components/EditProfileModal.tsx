import { motion, AnimatePresence } from "motion/react";
import { X, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { colors, accentColor } = useTheme();
  
  if (!isOpen) return null;
  
  return <EditProfileModalContent isOpen={isOpen} onClose={onClose} />;
}

function EditProfileModalContent({ isOpen, onClose }: EditProfileModalProps) {
  const { colors, accentColor } = useTheme();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    university: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        university: user.university || "",
        email: user.email,
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            avatar: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: fullName || user.name,
      university: formData.university,
      email: formData.email,
      avatar: formData.avatar || user.avatar,
    });
    onClose();
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
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
            style={{
              backgroundColor: colors.bgCard,
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b flex-shrink-0"
              style={{ borderColor: colors.borderPrimary }}
            >
              <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
                Edit Profile
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.borderPrimary }}
              >
                <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5 pb-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <ImageWithFallback
                      src={formData.avatar || user.avatar || ""}
                      alt={`${formData.firstName} ${formData.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCameraClick}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: accentColor.primary }}
                      type="button"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </motion.button>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,capture=camera"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                    Tap to change photo
                  </p>
                </div>

                {/* First Name */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* University */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => handleChange("university", e.target.value)}
                    placeholder="Enter your university"
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Role
                  </label>
                  <div
                    className="px-4 py-3 rounded-xl border capitalize"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      borderColor: colors.borderPrimary,
                      color: colors.textSecondary,
                    }}
                  >
                    {user.role}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
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
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                    style={{ backgroundColor: accentColor.primary }}
                    type="button"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
