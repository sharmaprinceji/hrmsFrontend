import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/attendance.css";

const Attendance = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const isEmployee = user?.roleId === 5;
  const isHRorManager = user?.roleId === 3 || user?.roleId === 4;

  const today = new Date().toISOString().split("T")[0];

  // ✅ FORMAT DATE
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  // ✅ FORMAT TIME
  const formatTime = (dateTime) => {
    if (!dateTime) return "-";

    return new Date(dateTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ FETCH REPORT
  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/attendance?month=${month}&year=${year}`
      );

      setReport(res.data?.data || []);
    } catch (err) {
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  // ✅ EMPLOYEE TODAY RECORD
  const todayRecord = report.find(
    (r) => r.attendance_date === today
  );

  // 👤 CHECK-IN
  const checkIn = async () => {
    try {
      setLoading(true);
      const res = await api.post("/attendance/checkin");
      alert(res.data.message || "Checked in");
      fetchReport();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  // 👤 CHECK-OUT
  const checkOut = async () => {
    try {
      setLoading(true);
      const res = await api.put("/attendance/checkout");
      alert(res.data.message || "Checked out");
      fetchReport();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // 👨‍💼 HR MARK
  const markAttendance = async (employeeId, status) => {
    try {
      setLoading(true);

      const res = await api.post("/attendance/mark", {
        employeeId,
        status,
      });

      alert(res.data.message || "Marked");
      fetchReport();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      <Sidebar />

      <div className="attendance-main">
        <div className="attendance-card">

          <h2>📅 Attendance</h2>

          {/* FILTER */}
          <div className="filter-bar">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Month {i + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          {/* EMPLOYEE ACTION */}
          {isEmployee && (
            <div className="btn-group">
              <button
                className="btn checkin"
                onClick={checkIn}
                disabled={loading || todayRecord}
              >
                Check In
              </button>

              <button
                className="btn checkout"
                onClick={checkOut}
                disabled={
                  loading ||
                  !todayRecord ||
                  todayRecord?.check_out
                }
              >
                Check Out
              </button>
            </div>
          )}

          {/* TABLE */}
          <div className="attendance-table">
            {report.length === 0 ? (
              <p>No data available</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    {isHRorManager && <th>Name</th>}
                    {isHRorManager && <th>Code</th>}
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    {isHRorManager && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {report.map((r, i) => {
                    const isToday =
                      r.attendance_date === today;

                    const isMarked =
                      r.status !== null && r.status !== undefined;

                    return (
                      <tr key={i}>
                        {isHRorManager && <td>{r.name}</td>}
                        {isHRorManager && (
                          <td>{r.employee_code}</td>
                        )}

                        <td>{formatDate(r.attendance_date)}</td>

                        {/* STATUS */}
                        <td
                          style={{
                            color:
                              r.status === "present"
                                ? "#16a34a"
                                : r.status === "absent"
                                ? "#dc2626"
                                : "#6b7280",
                            fontWeight: 600,
                          }}
                        >
                          {r.status || "-"}
                        </td>

                        <td>{formatTime(r.check_in)}</td>
                        <td>{formatTime(r.check_out)}</td>

                        {/* HR ACTION */}
                        {isHRorManager && (
                          <td>
                            {isToday && !isMarked && (
                              <div className="btn-group">
                                <button
                                  className="btn present"
                                  onClick={() =>
                                    markAttendance(
                                      r.employee_id,
                                      "present"
                                    )
                                  }
                                >
                                  P
                                </button>

                                <button
                                  className="btn absent"
                                  onClick={() =>
                                    markAttendance(
                                      r.employee_id,
                                      "absent"
                                    )
                                  }
                                >
                                  A
                                </button>
                              </div>
                            )}

                            {isToday && isMarked && (
                              <span style={{ color: "#6b7280" }}>
                                Marked
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;