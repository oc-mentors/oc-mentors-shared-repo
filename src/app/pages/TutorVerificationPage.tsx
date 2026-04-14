import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Upload, FileCheck } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, firestoreReady } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { BottomNav } from "../components/BottomNav";
import type { TutorVerificationDoc } from "../types/firestore";

const DOC_TYPES = [
  { id: "student_id", label: "Student ID" },
  { id: "transcript", label: "Transcript / proof of enrollment" },
];

export default function TutorVerificationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("student_id");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const uid = user?.id ?? "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!uid || !file || !db || !storage) return;
    setError(null);
    setSubmitting(true);
    try {
      await firestoreReady;
      const ext = file.name.split(".").pop() || "jpg";
      const path = `verifications/${uid}/${selectedType}-${Date.now()}.${ext}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const verRef = doc(db, "tutorVerifications", uid);
      const verSnap = await getDoc(verRef);
      const existing = verSnap.exists() ? (verSnap.data() as TutorVerificationDoc) : null;
      const documentRefs = existing?.documentRefs ?? [];
      documentRefs.push({ type: selectedType, storagePath: path });

      await setDoc(
        verRef,
        {
          uid,
          status: "pending",
          submittedAt: serverTimestamp(),
          reviewedAt: null,
          reviewedBy: null,
          notes: existing?.notes ?? "",
          documentRefs,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setStatus("Submitted. Your verification is under review.");
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">Tutor Verification</h1>
          </div>
        </div>

        <div className="px-6 space-y-6">
          <p className="text-[#a8b3cf] text-sm">
            Upload documents to verify your identity. Files are stored securely and reviewed by the team.
          </p>

          {status && (
            <div className="p-3 rounded-xl bg-[#4361d9]/20 text-[#a8e6cf] text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 flex-shrink-0" />
              {status}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 text-red-200 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#e8edf5] mb-2">Document type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#2a2f45] text-[#e8edf5] rounded-xl py-3 px-4 border border-[rgba(255,255,255,0.12)] focus:border-[#5b7ceb] outline-none"
            >
              {DOC_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8edf5] mb-2">File</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-[#a8b3cf] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#4361d9] file:text-white"
            />
            {file && <p className="mt-1 text-xs text-[#a8b3cf]">{file.name}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmit}
            disabled={!file || submitting}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {submitting ? "Uploading…" : "Submit for review"}
          </motion.button>
        </div>
      </div>
      <BottomNav currentPage="tutors" />
    </div>
  );
}
