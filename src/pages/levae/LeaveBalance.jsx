import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/leave.css";

const LeaveBalance = () => {
  const [balances, setBalances] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const fetchBalance = async () => {
    try {
      let endpoint = "/leaves/all";

      if (role === "employee") {
        endpoint = "/leaves/my";
      }

      const res = await api.get(endpoint);
      setBalances(res.data.data || []);
    } catch (err) {
      console.error("Failed to load balance");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // ✅ GROUP DATA
  const groupedData = {};

  balances.forEach((item) => {
    if (!groupedData[item.employee_name]) {
      groupedData[item.employee_name] = {
        CL: { total: 0, used: 0, remaining: 0 },
        SL: { total: 0, used: 0, remaining: 0 },
        EL: { total: 0, used: 0, remaining: 0 },
      };
    }

    groupedData[item.employee_name][item.leave_type] = {
      total: item.total_leaves,
      used: item.used_leaves,
      remaining: item.remaining_leaves,
    };
  });

  return (
    <div className="leave-container">
      <Sidebar />

      <div className="leave-main">
        <h2>Leave Balance</h2>

        <table className="leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>CL (T/U/R)</th>
              <th>SL (T/U/R)</th>
              <th>EL (T/U/R)</th>
              <th>Total Leaves</th>
              <th>Total Remaining</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedData).map(([name, leaves]) => {
              
              const totalLeaves =
                (leaves.CL.total || 0) +
                (leaves.SL.total || 0) +
                (leaves.EL.total || 0);

              const totalRemaining =
                (leaves.CL.remaining || 0) +
                (leaves.SL.remaining || 0) +
                (leaves.EL.remaining || 0);

              return (
                <tr key={name}>
                  <td className="emp-name">{name}</td>

                  <td>
                    {leaves.CL.total} / {leaves.CL.used} /{" "}
                    <span className={leaves.CL.remaining <= 2 ? "low" : ""}>
                      {leaves.CL.remaining}
                    </span>
                  </td>

                  <td>
                    {leaves.SL.total} / {leaves.SL.used} /{" "}
                    <span className={leaves.SL.remaining <= 2 ? "low" : ""}>
                      {leaves.SL.remaining}
                    </span>
                  </td>

                  <td>
                    {leaves.EL.total} / {leaves.EL.used} /{" "}
                    <span className={leaves.EL.remaining <= 2 ? "low" : ""}>
                      {leaves.EL.remaining}
                    </span>
                  </td>

                  <td className="total">{totalLeaves}</td>

                  <td className={totalRemaining <= 5 ? "low total" : "total"}>
                    {totalRemaining}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalance;