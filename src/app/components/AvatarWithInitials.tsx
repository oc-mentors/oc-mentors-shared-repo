import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AvatarWithInitialsProps {
  src?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getInitials(firstName?: string, lastName?: string, name?: string): string {
  // Priority: firstName + lastName > name > default "U" (User)
  if (firstName !== undefined && firstName !== null) {
    const firstInitial = String(firstName).trim()[0]?.toUpperCase() || "";
    const lastInitial = lastName != null ? String(lastName).trim()[0]?.toUpperCase() || "" : "";
    const combined = firstInitial + lastInitial;
    return combined || "U";
  }

  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (trimmedName) {
    const nameParts = trimmedName.split(/\s+/).filter(Boolean);
    if (nameParts.length >= 2) {
      return (nameParts[0][0]?.toUpperCase() ?? "") + (nameParts[nameParts.length - 1][0]?.toUpperCase() ?? "");
    }
    return nameParts[0]?.[0]?.toUpperCase() || "U";
  }

  return "U";
}

// Deterministic background color from name (like Google) – same name = same color
const AVATAR_COLORS = [
  "#5b7ceb", "#4361d9", "#6b4c9a", "#c27aff", "#e60076",
  "#155dfc", "#51a2ff", "#10b981", "#f59e0b", "#ef4444",
];

function getAvatarColor(firstName?: string, lastName?: string, name?: string): string {
  const str = [firstName, lastName].filter(Boolean).join(" ") || name || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function AvatarWithInitials({ 
  src, 
  firstName, 
  lastName, 
  name, 
  className = "",
  style = {}
}: AvatarWithInitialsProps) {
  const initials = getInitials(firstName, lastName, name);
  
  // If there's a valid src, show the image
  if (src) {
    return (
      <ImageWithFallback
        src={src}
        alt={`${firstName || name || "User"}'s avatar`}
        className={className}
        style={style}
      />
    );
  }
  
  // Otherwise show initials with a consistent background color (like Google)
  const bgColor = getAvatarColor(firstName, lastName, name);
  return (
    <div
      className={`flex items-center justify-center font-bold text-white ${className}`}
      style={{
        backgroundColor: bgColor,
        ...style
      }}
    >
      {initials}
    </div>
  );
}
