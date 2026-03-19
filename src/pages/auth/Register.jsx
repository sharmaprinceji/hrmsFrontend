import { useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/employeeForm.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: ""
  });

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", form);

      alert(res.data.message || "User Created");

      // 🔥 IMPORTANT: save userId for next step
      const userId = res.data.data?.id;
      if (userId) {
        localStorage.setItem("newUserId", userId);
      }

    } catch (err) {
      alert("Registration failed");
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
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Email"
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Role ID (5 = Employee)"
            onChange={(e)=>setForm({...form,roleId:e.target.value})}
          />

          <Button text="Register User" onClick={handleRegister} />

        </div>
      </div>
    </div>
  );
};

export default Register;