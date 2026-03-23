import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/employeeForm.css";

const Register = () => {
  const [roles, setRoles] = useState([]); // 🔥 roles state

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: ""
  });

  const navigate = useNavigate();

  // =========================
  // FETCH ROLES
  // =========================
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data.data || []);
    } catch (err) {
      alert("Failed to load roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async () => {
    if (!form.roleId) return alert("Please select role");

    try {
      const res = await api.post("/auth/register", form);

      alert(res.data.message || "User Created");

      navigate("/users");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <Sidebar />

      <div className="form-main">
        <div className="form-card">

          <div className="form-title">Register User</div>

          <input
            className="form-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="form-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* 🔥 ROLE DROPDOWN */}
          <select
            className="form-input"
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
          >
            <option value="">Select Role</option>

            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button className="form-btn" onClick={handleRegister}>
            Register User
          </button>

        </div>
      </div>
    </div>
  );
};

export default Register;