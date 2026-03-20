import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/employeeForm.css";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    roleId: "",
    roleName: ""
  });

  useEffect(() => {
    if (location.state?.userData) {
      const u = location.state.userData;

      setForm({
        name: u.name,
        email: u.email,
        roleId: u.role_id,     // ✅ important for payload
        roleName: u.role_name  // only for UI
      });
    } else {
      alert("No user data found");
      navigate("/users");
    }
  }, []);

 const handleUpdate = async () => {
  try {
    const payload = {
      name: form.name,
      email: form.email
    };

    await api.put(`/users/${id}`, payload);

    alert("User updated");
    navigate("/users");
  } catch {
    alert("Update failed");
  }
};

  return (
    <div className="form-container">
      <Sidebar />

      <div className="form-main">
        <div className="form-card">
          <div className="form-title">Edit User</div>

          {/* ✅ Editable */}
          <input
            className="form-input"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Name"
          />

          {/* ❌ Readonly */}
          <input
            className="form-input"
            value={form.email}
            disabled
          />

          {/* ❌ Readonly Role */}
          <input
            className="form-input"
            value={form.roleName}
            disabled
          />

          <button className="form-btn" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;