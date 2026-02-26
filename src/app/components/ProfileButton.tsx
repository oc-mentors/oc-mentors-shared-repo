import { useNavigate } from "react-router";

export function ProfileButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <div
      onClick={handleClick}
      className="w-9 h-9 bg-[#5b7ceb] rounded-full flex items-center justify-center cursor-pointer shadow-lg"
    >
      <span className="text-white font-bold text-sm">D</span>
    </div>
  );
}