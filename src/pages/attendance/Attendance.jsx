import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/attendance.css";

const Attendance = () => {
  const { user } = useContext(AuthContext);

  const [status, setStatus] = useState("not_checked_in");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/attendance/today");

      // fallback safety
      setStatus(res.data.status || "not_checked_in");
    } catch (err) {
      console.error(err);
    }
  };

  // 👤 EMPLOYEE ACTIONS
  const checkIn = async () => {
    try {
      setLoading(true);
      const res=await api.post("/attendance/checkin");
      setStatus("checked_in");
    } catch (err) {
      alert(res.data.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      const res=await api.put("/attendance/checkout");
       alert(res.data.message);
    } catch (err) {
      alert("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // 👨‍💼 HR / MANAGER ACTION
  const markAttendance = async (markStatus) => {
    try {
      setLoading(true);

      const res=await api.post("/attendance/team/mark", {
        employeeId: user.id, // 🔥 you can change if selecting others
        status: markStatus,
      });

       alert(res.data.message);
    } catch (err) {
      alert("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const isEmployee = user?.roleId === 5;
  const isHRorManager = user?.roleId === 3 || user?.roleId === 4;

  return (
    <div className="attendance-container">
      <Sidebar />

      <div className="attendance-main">
        <div className="attendance-card">

          <h2>📅 Attendance</h2>

          {/* STATUS (ONLY EMPLOYEE) */}
          {isEmployee && (
            <p className={`status ${status}`}>
              Status: {status.replace("_", " ").toUpperCase()}
            </p>
          )}

          {/* EMPLOYEE UI */}
          {isEmployee && (
            <div className="btn-group">
              <button
                className="btn checkin"
                onClick={checkIn}
                disabled={loading || status !== "not_checked_in"}
              >
                Check In
              </button>

              <button
                className="btn checkout"
                onClick={checkOut}
                disabled={loading || status !== "checked_in"}
              >
                Check Out
              </button>
            </div>
          )}

          {/* HR / MANAGER UI */}
          {isHRorManager && (
            <div className="btn-group">
              <button
                className="btn present"
                onClick={() => markAttendance("present")}
                disabled={loading}
              >
              Present
              </button>

              <button
                className="btn absent"
                onClick={() => markAttendance("absent")}
                disabled={loading}
              >
                Absent
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Attendance;