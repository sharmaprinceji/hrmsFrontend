// import { useEffect, useState, useContext } from "react";
// import api from "../../services/api";
// import Sidebar from "../../components/common/Sidebar";
// import { AuthContext } from "../../context/AuthContext";
// import "../../styles/attendance.css";

// const Attendance = () => {
//   const { user } = useContext(AuthContext);

//   const [status, setStatus] = useState("not_checked_in");
//   const [loading, setLoading] = useState(false);
//   const [employeeId, setEmployeeId] = useState("");

//   // ✅ Month & Year
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());

//   useEffect(() => {
//     fetchStatus();
//   }, [month, year]);

//   // 🔥 FETCH ATTENDANCE BY MONTH/YEAR
//   const fetchStatus = async () => {
//     try {
//       const res = await api.get(`/attendance`);

//       const records = res.data?.data || [];

//       if (records.length > 0) {
//         setStatus(records[0].status); // latest record
//       } else {
//         setStatus("not_checked_in");
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 👤 CHECK-IN
//   const checkIn = async () => {
//     try {
//       setLoading(true);

//       const res = await api.post("/attendance/checkin");

//       setStatus("present");
//       alert(res.data.message);

//     } catch (err) {
//       alert(err?.response?.data?.message || "Check-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 👤 CHECK-OUT
//   const checkOut = async () => {
//     try {
//       setLoading(true);

//       const res = await api.put("/attendance/checkout");

//       setStatus("present");
//       alert(res.data.message);

//     } catch (err) {
//       alert(err?.response?.data?.message || "Check-out failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 👨‍💼 HR / MANAGER MARK
//   const markAttendance = async (markStatus) => {
//     try {
//       setLoading(true);

//       const payload = {
//         employeeId: Number(employeeId),
//         status: markStatus,
//       };

//       const res = await api.post("/attendance/mark", payload);

//       alert(res.data.message);
//       setEmployeeId("");

//     } catch (err) {
//       alert(err?.response?.data?.message || "Failed to mark attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔐 ROLE CHECK
//   const isEmployee = user?.roleId === 5;
//   const isHRorManager = user?.roleId === 3 || user?.roleId === 4;

//   return (
//     <div className="attendance-container">
//       <Sidebar />

//       <div className="attendance-main">
//         <div className="attendance-card">

//           <h2>📅 Attendance</h2>

//           {/* 🔥 FILTER */}
//           <div className="filter-bar">
//             <select value={month} onChange={(e) => setMonth(e.target.value)}>
//               {[...Array(12)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   Month {i + 1}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="number"
//               value={year}
//               onChange={(e) => setYear(e.target.value)}
//             />
//           </div>

//           {/* 👤 EMPLOYEE STATUS */}
//           {isEmployee && (
//             <p className={`status ${status}`}>
//               Status: {status.replace("_", " ").toUpperCase()}
//             </p>
//           )}

//           {/* 👤 EMPLOYEE ACTIONS */}
//           {isEmployee && (
//             <div className="btn-group">
//               <button
//                 className="btn checkin"
//                 onClick={checkIn}
//                 disabled={loading || status !== "not_checked_in"}
//               >
//                 Check In
//               </button>

//               <button
//                 className="btn checkout"
//                 onClick={checkOut}
//                 disabled={loading || status !== "present"}
//               >
//                 Check Out
//               </button>
//             </div>
//           )}

//           {/* 👨‍💼 HR / MANAGER */}
//           {isHRorManager && (
//             <>
//               <input
//                 type="number"
//                 placeholder="Enter Employee ID"
//                 value={employeeId}
//                 onChange={(e) => setEmployeeId(e.target.value)}
//                 className="form-input"
//               />

//               <div className="btn-group">
//                 <button
//                   className="btn present"
//                   onClick={() => markAttendance("present")}
//                   disabled={loading || !employeeId}
//                 >
//                   Mark Present
//                 </button>

//                 <button
//                   className="btn absent"
//                   onClick={() => markAttendance("absent")}
//                   disabled={loading || !employeeId}
//                 >
//                   Mark Absent
//                 </button>
//               </div>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;

import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/attendance.css";

const Attendance = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  // 🔥 REPORT DATA
  const [report, setReport] = useState([]);

  // ✅ Month & Year
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // 🔥 FETCH MONTHLY REPORT
  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/attendance?month=${month}&year=${year}`
      );

      const data = res.data?.data || [];

      if (data.length === 0) {
        setReport([]);
        alert("No attendance data found for selected month");
      } else {
        setReport(data);
      }

    } catch (err) {
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  // 👤 CHECK-IN
  const checkIn = async () => {
    try {
      setLoading(true);
      const res = await api.post("/attendance/checkin");
      alert(res.data.message || "Checked in");
      fetchReport(); // refresh
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

  // 👨‍💼 HR / MANAGER MARK
  const markAttendance = async (markStatus) => {
    try {
      setLoading(true);

      const payload = {
        employeeId: Number(employeeId),
        status: markStatus,
      };

      const res = await api.post("/attendance/team/mark", payload);

      alert(res.data.message || "Attendance marked");

      setEmployeeId("");
      fetchReport();

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 ROLE
  const isEmployee = user?.roleId === 5;
  const isHRorManager = user?.roleId === 3 || user?.roleId === 4;

  return (
    <div className="attendance-container">
      <Sidebar />

      <div className="attendance-main">
        <div className="attendance-card">

          <h2>📅 Attendance Report</h2>

          {/* 🔥 FILTER */}
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

          {/* 👤 EMPLOYEE ACTION */}
          {isEmployee && (
            <div className="btn-group">
              <button
                className="btn checkin"
                onClick={checkIn}
                disabled={loading}
              >
                Check In
              </button>

              <button
                className="btn checkout"
                onClick={checkOut}
                disabled={loading}
              >
                Check Out
              </button>
            </div>
          )}

          {/* 👨‍💼 HR / MANAGER */}
          {isHRorManager && (
            <>
              <input
                type="number"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="form-input"
              />

              <div className="btn-group">
                <button
                  className="btn present"
                  onClick={() => markAttendance("present")}
                  disabled={loading || !employeeId}
                >
                  Mark Present
                </button>

                <button
                  className="btn absent"
                  onClick={() => markAttendance("absent")}
                  disabled={loading || !employeeId}
                >
                  Mark Absent
                </button>
              </div>
            </>
          )}

          {/* 📊 REPORT TABLE */}
          <div className="attendance-table">
            {report.length === 0 ? (
              <p>No data available</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee Code</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                  </tr>
                </thead>

                <tbody>
                  {report.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.employee_code}</td>
                      <td>{r.present_days}</td>
                      <td>{r.absent_days}</td>
                    </tr>
                  ))}
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