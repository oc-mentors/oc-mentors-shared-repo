import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export function ProfileButton() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accentColor } = useTheme();

  const handleClick = () => {
    navigate("/profile");
  };

  const initialsSource = user?.firstName || user?.name || user?.email || "";
  const initial =
    initialsSource.trim().charAt(0).toUpperCase() || "U";

  return (
    <div
      onClick={handleClick}
      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
      style={{ backgroundColor: accentColor.primary }}
    >
      <span className="text-white font-bold text-sm">{initial}</span>
    </div>
  );
}