import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { AvatarWithInitials } from "./AvatarWithInitials";

export function ProfileButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleClick = () => {
    navigate("/profile", { state: { from: location.pathname } });
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
      data-testid="profile-button" id="profile-button" aria-label="Profile"
      role="button"
    >
      <AvatarWithInitials
        src={user?.avatar}
        firstName={user?.firstName}
        lastName={user?.lastName}
        name={user?.name}
        className="w-16 h-16 rounded-full object-cover text-base shadow-lg"
      />
    </div>
  );
}