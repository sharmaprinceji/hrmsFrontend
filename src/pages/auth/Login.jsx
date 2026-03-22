import { useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT LOGIN
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      login({
        accessToken: res.data.data.accessToken,
        user: res.data.data.user,
      });

      navigate("/dashboard");

    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-title">HRMS Login</div>

        <input
          className="login-input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="login-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="forgot-link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

      </div>
    </div>
  );
};

export default Login;