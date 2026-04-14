import { Link } from "react-router";
import { motion } from "motion/react";
import { Star, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, firestoreReady } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { BottomNav } from "../components/BottomNav";

interface SessionData {
  tutor: string;
  subject: string;
  /** Required to save review to Firestore and update tutor aggregate */
  connectionId?: string;
  tutorUid?: string;
}

export default function RateSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const sessionData = (location.state?.session as SessionData) || {
    tutor: "Debra Peterson",
    subject: "Math 2A - Matrices",
  };

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tags = [
    "Clear explanations",
    "Patient",
    "Knowledgeable",
    "Engaging",
    "Well prepared",
  ];

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent!"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const { connectionId, tutorUid } = sessionData;
      if (user?.id && connectionId && tutorUid) {
        await firestoreReady;
        if (db) {
          await addDoc(collection(db, "reviews"), {
            tutorUid,
            studentUid: user.id,
            connectionId,
            rating,
            text: review || undefined,
            createdAt: serverTimestamp(),
          });
          const tutorRef = doc(db, "tutorProfiles", tutorUid);
          const tutorSnap = await getDoc(tutorRef);
          if (tutorSnap.exists()) {
            const data = tutorSnap.data();
            const prevAvg = data.ratingAvg ?? 0;
            const prevCount = data.ratingCount ?? 0;
            const newCount = prevCount + 1;
            const newAvg = (prevAvg * prevCount + rating) / newCount;
            await updateDoc(tutorRef, {
              ratingAvg: Math.round(newAvg * 10) / 10,
              ratingCount: newCount,
              updatedAt: serverTimestamp(),
            });
          }
        }
      }
      navigate("/schedule", {
        state: { showSuccessMessage: true },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/schedule");
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-3 pb-2">
          <button type="button" onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-[#e8edf5]" />
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-8 pb-6"
        >
          <h1 className="text-[28px] font-bold text-[#e8edf5] mb-2">
            Rate Your Session
          </h1>
          <p className="text-[14px] text-[#a8b3cf]">with {sessionData.tutor}</p>
        </motion.div>

        {/* Session Completed Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-6 mb-8 rounded-xl border border-[rgba(91,124,235,0.3)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] p-6"
          style={{
            backgroundImage:
              "linear-gradient(150.363deg, rgba(91, 124, 235, 0.2) 0%, rgba(91, 124, 235, 0.1) 100%)",
          }}
        >
          <div className="flex flex-col items-center">
            {/* Checkmark Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-[70px] h-[70px] rounded-full mb-4 flex items-center justify-center shadow-[0px_4px_24px_0px_rgba(91,124,235,0.25)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)",
              }}
            >
              <Check className="w-10 h-10 text-white stroke-[3]" />
            </motion.div>

            <h2 className="text-[18px] font-semibold text-[#e8edf5] mb-1">
              Session Completed!
            </h2>
            <p className="text-[13px] text-[#a8b3cf]">
              Great job on completing your lesson
            </p>
          </div>
        </motion.div>

        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-8"
        >
          <h3 className="text-[16px] font-medium text-[#e8edf5] text-center mb-4">
            How was your experience?
          </h3>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-[40px] leading-none transition-all"
              >
                {(hoveredRating || rating) >= star ? "⭐" : "☆"}
              </motion.button>
            ))}
          </div>

          {/* Rating Label */}
          <p className="text-[14px] font-medium text-[#a8b3cf] text-center">
            {ratingLabels[(hoveredRating || rating) - 1]}
          </p>
        </motion.div>

        {/* Review Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-8"
        >
          <label className="block text-[14px] font-medium text-[#e8edf5] mb-2">
            Write a Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this tutor..."
            className="w-full h-[120px] bg-[#2a2f4a] text-[#e8edf5] text-[14px] rounded-xl p-4 border border-[rgba(255,255,255,0.12)] focus:border-[#5b7ceb] focus:outline-none resize-none placeholder:text-[#a8b3cf]"
          />
        </motion.div>

        {/* Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-8"
        >
          <label className="block text-[14px] font-medium text-[#e8edf5] mb-3">
            What did you like?
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-[13px] border transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-[#5b7ceb] border-[#5b7ceb] text-white"
                    : "bg-[#1e2139] border-[rgba(255,255,255,0.12)] text-[#e8edf5]"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {error && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-red-500/20 text-red-200 text-sm">{error}</div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-6 space-y-3 pb-6"
        >
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-xl font-semibold text-white text-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] disabled:opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(171.386deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)",
            }}
          >
            Submit Review
          </motion.button>

          {/* Skip Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSkip}
            className="w-full py-4 rounded-xl font-medium text-[#e8edf5] text-[16px] border-2 border-[rgba(255,255,255,0.12)]"
          >
            Skip for Now
          </motion.button>
        </motion.div>
      </div>

      <BottomNav currentPage="schedule" />
    </div>
  );
}