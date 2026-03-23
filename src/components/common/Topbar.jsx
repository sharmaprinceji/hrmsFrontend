import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="topbar">
      <h3>Dashboard</h3>

      <div
        className="profile"
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      >
        👤 {user?.name || "User"}
      </div>
    </div>
  );
};

export default Topbar;