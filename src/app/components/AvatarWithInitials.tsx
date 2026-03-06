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
  // Priority: firstName + lastName > name > default "?"
  if (firstName) {
    const firstInitial = firstName.trim()[0]?.toUpperCase() || "";
    const lastInitial = lastName?.trim()[0]?.toUpperCase() || "";
    return firstInitial + lastInitial;
  }
  
  if (name) {
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return nameParts[0][0]?.toUpperCase() + nameParts[1][0]?.toUpperCase();
    }
    return nameParts[0][0]?.toUpperCase() || "?";
  }
  
  return "?";
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
  
  // Otherwise show initials
  return (
    <div
      className={`flex items-center justify-center font-bold text-white ${className}`}
      style={{
        backgroundColor: "#5b7ceb",
        ...style
      }}
    >
      {initials}
    </div>
  );
}
