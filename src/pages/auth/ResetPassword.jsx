import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/login.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
  });

  const [timer, setTimer] = useState(60);

  // ⏱ Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔁 Resend OTP
  const resendOtp = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      setTimer(60);
      alert("OTP resent");
    } catch {
      alert("Failed to resend");
    }
  };

  // ✅ Reset Password
  const handleReset = async () => {
    try {
      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      alert("Password reset successful ✅");

      navigate("/");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-title">Reset Password</div>

        <input
          className="login-input"
          placeholder="OTP"
          onChange={(e) =>
            setForm({ ...form, otp: e.target.value })
          }
        />

        <input
          className="login-input"
          type="password"
          placeholder="New Password"
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
        />

        <button className="login-button" onClick={handleReset}>
          Reset Password
        </button>

        {/* ⏱ TIMER */}
        {timer > 0 ? (
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Resend OTP in {timer}s
          </p>
        ) : (
          <p
            className="forgot-link"
            onClick={resendOtp}
          >
            Resend OTP
          </p>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;