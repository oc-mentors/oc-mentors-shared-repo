import { motion, AnimatePresence } from "motion/react";
import { X, Camera, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { AvatarWithInitials } from "./AvatarWithInitials";
import { useScrollLock } from "../hooks/useScrollLock";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { colors, accentColor } = useTheme();
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return <EditProfileModalContent isOpen={isOpen} onClose={onClose} />;
}

function EditProfileModalContent({ isOpen, onClose }: EditProfileModalProps) {
  const { colors, accentColor } = useTheme();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setUploadError(null);
    if (!file || !file.type.startsWith("image/")) return;
    if (!user?.id) return;

    if (storage) {
      setUploadingAvatar(true);
      const UPLOAD_TIMEOUT_MS = 20000; // 20 seconds
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Upload timed out. Is Firebase Storage enabled?")), UPLOAD_TIMEOUT_MS)
      );
      try {
        console.log("[Avatar] Upload starting:", file.name, file.size, "bytes");
        const path = `avatars/${user.id}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        await Promise.race([uploadBytes(storageRef, file), timeoutPromise]);
        console.log("[Avatar] uploadBytes done, getting URL...");
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("[Avatar] Success, URL length:", downloadUrl.length);
        setFormData((prev) => ({ ...prev, avatar: downloadUrl }));
        updateUser({ avatar: downloadUrl });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
        console.error("[Avatar] Upload failed:", code || message, err);
        setUploadError(
          code
            ? `${code}: ${message}`
            : message || "Upload failed. In Firebase Console enable Storage and deploy storage.rules."
        );
        const sizeMb = file.size / (1024 * 1024);
        if (sizeMb < 0.5) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
            updateUser({ avatar: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      } finally {
        setUploadingAvatar(false);
      }
    } else {
      console.warn("[Avatar] Firebase Storage not available (storage is null). Using data URL.");
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        if (dataUrl.length < 500_000) updateUser({ avatar: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  const handleSave = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: fullName || user.name,
      university: formData.university,
      email: formData.email,
      avatar: formData.avatar,
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
                    <AvatarWithInitials
                      src={formData.avatar}
                      firstName={formData.firstName}
                      lastName={formData.lastName}
                      name={user.name}
                      className="w-24 h-24 rounded-full object-cover text-[28px]"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCameraClick}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg disabled:opacity-70"
                      style={{ backgroundColor: accentColor.primary }}
                      type="button"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
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
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                      {uploadingAvatar ? "Uploading…" : "Tap to change photo"}
                    </p>
                    {uploadError && (
                      <p className="text-[12px] text-center max-w-[260px]" style={{ color: "#ef4444" }}>
                        {uploadError}
                      </p>
                    )}
                    {/* Remove Picture Button */}
                    {formData.avatar && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemovePicture}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                        style={{ 
                          backgroundColor: "#FF453A20",
                          color: "#FF453A"
                        }}
                        type="button"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove Picture
                      </motion.button>
                    )}
                  </div>
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