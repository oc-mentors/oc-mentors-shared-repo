import { motion } from "motion/react";
import { X, Trash2, MapPin, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface CalendarEvent {
  id: number;
  type: "class" | "study" | "assignment" | "tutor";
  title: string;
  startTime: string;
  endTime: string;
  day: number;
  date: Date;
  tutor?: string;
  participants?: string[];
  color?: string;
  courseName?: string;
  dueTime?: string;
  location?: string;
}

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<CalendarEvent>) => void;
}

export function EventDetailsModal({ event, onClose, onDelete, onUpdate }: EventDetailsModalProps) {
  const { colors, accentColor } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "class" as "class" | "study" | "tutor",
    location: "",
    startTime: "",
    endTime: "",
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        type: event.type === "assignment" ? "class" : event.type,
        location: event.location || "",
        startTime: event.startTime,
        endTime: event.endTime,
      });
    }
  }, [event]);

  if (!event) return null;

  const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(event.id, {
      title: formData.title,
      type: formData.type,
      location: formData.location,
      startTime: formData.startTime,
      endTime: formData.endTime,
    });
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: colors.borderPrimary }}>
          <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
            {isEditing ? "Edit Event" : "Event Details"}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#ef444433" }}
              >
                <Trash2 className="w-5 h-5 text-[#ef4444]" />
              </motion.button>
            )}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5 pb-8">
            {isEditing ? (
              <>
                {/* Title */}
                <div>
                  <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "class", label: "Class" },
                      { value: "study", label: "Study Session" },
                      { value: "tutor", label: "Tutor Session" },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChange("type", option.value)}
                        className="px-2 py-3 rounded-xl text-[12px] font-semibold transition-all"
                        style={{
                          backgroundColor:
                            formData.type === option.value
                              ? accentColor.primary
                              : colors.bgSecondary,
                          color: formData.type === option.value ? "white" : colors.textPrimary,
                          border: `2px solid ${
                            formData.type === option.value ? accentColor.primary : colors.borderPrimary
                          }`,
                        }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.borderPrimary,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="">Select location</option>
                    <option value="Online">Online</option>
                    <option value="UCI">UCI</option>
                    <option value="Irvine High School">Irvine High School</option>
                    <option value="University High School">University High School</option>
                    <option value="Northwood High School">Northwood High School</option>
                    <option value="Woodbridge High School">Woodbridge High School</option>
                  </select>
                </div>

                {/* Date (Read-only) */}
                <div>
                  <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Date
                  </label>
                  <div
                    className="px-4 py-3 rounded-xl border"
                    style={{
                      backgroundColor: colors.bgTertiary,
                      borderColor: colors.borderPrimary,
                      color: colors.textSecondary,
                    }}
                  >
                    {formatDate(event.date)}
                  </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Start Time
                    </label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => handleChange("startTime", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    >
                      <option value="">Select time</option>
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      End Time
                    </label>
                    <select
                      value={formData.endTime}
                      onChange={(e) => handleChange("endTime", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    >
                      <option value="">Select time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                      <option value="11:00 PM">11:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                    style={{ 
                      backgroundColor: colors.bgTertiary,
                      color: colors.textPrimary,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                    style={{ backgroundColor: accentColor.primary }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className={`rounded-xl p-4 bg-gradient-to-br ${event.color || "from-[#5b7ceb] to-[#7c3aed]"}`}>
                  <h3 className="text-white text-[20px] font-bold mb-2">{event.title}</h3>
                  <div className="text-white/90 text-[14px] space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.tutor && (
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>with {event.tutor}</span>
                      </div>
                    )}
                    {event.participants && event.participants.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.participants.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Type Badge */}
                <div>
                  <span className="inline-block px-4 py-2 rounded-full text-[13px] font-semibold" style={{
                    backgroundColor: accentColor.primary + "20",
                    color: accentColor.primary,
                  }}>
                    {event.type === "tutor" ? "Tutor Session" : event.type === "study" ? "Study Session" : "Class"}
                  </span>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[12px] font-semibold mb-1" style={{ color: colors.textSecondary }}>
                    DATE
                  </label>
                  <p className="text-[16px] font-medium" style={{ color: colors.textPrimary }}>
                    {formatDate(event.date)}
                  </p>
                </div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                  style={{ backgroundColor: accentColor.primary }}
                >
                  Edit Event
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
