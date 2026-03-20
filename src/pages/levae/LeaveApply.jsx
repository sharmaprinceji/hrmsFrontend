import { useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/leaveForm.css";

const LeaveApply = () => {
  const [form, setForm] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const applyLeave = async () => {
    try {
      const res = await api.post("/leaves/apply", form); // ✅ FIX endpoint

      alert(res.data.message || "Leave Applied");

      // reset form
      setForm({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: ""
      });

    } catch (err) {
      alert("Failed to apply leave");
    }
  };

  return (
    <div className="leave-form-container">
      <Sidebar />

      <div className="leave-form-main">
        <div className="leave-form-card">

          <div className="leave-form-title">Apply Leave</div>

          <input
            className="leave-form-input"
            placeholder="Leave Type ID (e.g. 1 = CL)"
            value={form.leaveTypeId}
            onChange={(e)=>setForm({...form,leaveTypeId:e.target.value})}
          />

          <input
            className="leave-form-input"
            type="date"
            value={form.startDate}
            onChange={(e)=>setForm({...form,startDate:e.target.value})}
          />

          <input
            className="leave-form-input"
            type="date"
            value={form.endDate}
            onChange={(e)=>setForm({...form,endDate:e.target.value})}
          />

          <input
            className="leave-form-input"
            placeholder="Reason"
            value={form.reason}
            onChange={(e)=>setForm({...form,reason:e.target.value})}
          />

          <div className="leave-form-btn">
            <Button text="Apply Leave" onClick={applyLeave} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaveApply;