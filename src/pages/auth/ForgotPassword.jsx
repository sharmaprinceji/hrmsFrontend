import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await api.post("/auth/forgot-password", { email });

      alert("OTP sent to email 📧");

      navigate("/reset-password", { state: { email } });

    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-title">Forgot Password</div>

        <input
          className="login-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-button" onClick={handleSendOtp}>
          Send OTP
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;