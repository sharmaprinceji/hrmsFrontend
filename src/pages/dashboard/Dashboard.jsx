// import Sidebar from "../../components/common/Sidebar";
// import Topbar from "../../components/common/Topbar";
// import "../../styles/dashboard.css";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">

//       <Sidebar />

//       <div className="dashboard-main fade-in">

//         <Topbar />

//         <div className="dashboard-grid">

//           <div className="dashboard-card">
//             <div className="card-title">Total Employees</div>
//             <div className="card-value">120</div>
//           </div>

//           <div className="dashboard-card">
//             <div className="card-title">Pending Leaves</div>
//             <div className="card-value">5</div>
//           </div>

//           <div className="dashboard-card">
//             <div className="card-title">Active Tasks</div>
//             <div className="card-value">12</div>
//           </div>

//           <div className="dashboard-card">
//             <div className="card-title">Attendance Today</div>
//             <div className="card-value">98%</div>
//           </div>

//           <div className="dashboard-card">
//             <div className="card-title">Payroll Processed</div>
//             <div className="card-value">₹12L</div>
//           </div>

//           <div className="dashboard-card">
//             <div className="card-title">Departments</div>
//             <div className="card-value">8</div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import "../../styles/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main fade-in">
        <Topbar />

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <div className="card-title">Total Employees</div>
            <div className="card-value">{data.totalEmployees}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-title">Pending Leaves</div>
            <div className="card-value">{data.pendingLeaves}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-title">Active Tasks</div>
            <div className="card-value">{data.activeTasks}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-title">Attendance Today</div>
            <div className="card-value">{data.attendanceToday}%</div>
          </div>

          <div className="dashboard-card">
            <div className="card-title">Payroll Processed</div>
            <div className="card-value">₹{data.payrollProcessed}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-title">Departments</div>
            <div className="card-value">{data.departments}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;