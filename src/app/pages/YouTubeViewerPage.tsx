import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Extract YouTube video ID from various URL formats.
 */
export function getYouTubeVideoId(urlOrId: string): string | null {
  const s = urlOrId.trim();
  if (!s) return null;
  // Already a short id (e.g. dQw4w9WgXcQ)
  if (/^[\w-]{10,12}$/.test(s)) return s;
  try {
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("?")[0] || null;
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const m = url.pathname.match(/^\/embed\/([\w-]+)/);
      if (m) return m[1];
    }
  } catch {
    return null;
  }
  return null;
}

export default function YouTubeViewerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { colors } = useTheme();

  const searchQuery = searchParams.get("search")?.trim() || "";
  const videoId =
    searchParams.get("v") || getYouTubeVideoId(searchParams.get("url") || "");

  // Search mode: YouTube blocks embedding search results in iframes, so we open in a new tab
  if (searchQuery) {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: colors.bgPrimary }}>
        <p className="text-center mb-2" style={{ color: colors.textPrimary }}>
          Search YouTube for “{searchQuery}”
        </p>
        <p className="text-center mb-6 text-sm" style={{ color: colors.textSecondary }}>
          Opens in a new tab (YouTube doesn’t allow search inside the app)
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl font-medium"
            style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
          >
            Go back
          </motion.button>
          <a href={searchUrl} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "#ff0000" }}
            >
              Open YouTube search
            </motion.button>
          </a>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: colors.bgPrimary }}>
        <p className="text-center mb-4" style={{ color: colors.textSecondary }}>
          No video specified. Use ?v=VIDEO_ID, ?url=YOUTUBE_URL, or ?search=QUERY
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl font-medium"
          style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
        >
          Go back
        </motion.button>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3" style={{ backgroundColor: colors.bgSecondary }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          YouTube
        </span>
      </div>
      <div className="flex-1 min-h-0 p-4">
        <div className="h-full w-full rounded-2xl overflow-hidden bg-black">
          <iframe
            title="YouTube video"
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
