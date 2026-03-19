import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="topbar">
      <h3>Dashboard</h3>

      <div className="profile">
        👤 {user?.name || "User"}
      </div>
    </div>
  );
};

export default Topbar;