import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
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

  return (
    <div className="leave-container">
      <Sidebar />

      <div className="leave-main">
        <h2>Leave Balance</h2>

        <div className="balance-grid">
          {balances.map((b) => (
            <Card key={b.id} className="balance-card">
              
              {/* ✅ Employee Name */}
              <h4 className="employee-name">{b.employee_name}</h4>

              {/* Leave Type */}
              <h3>{b.leave_type}</h3>

              <p>Total: {b.total_leaves}</p>
              <p>Used: {b.used_leaves}</p>

              <p
                className={
                  b.remaining_leaves <= 2
                    ? "remaining low"
                    : "remaining"
                }
              >
                Remaining: {b.remaining_leaves}
              </p>

            </Card>
          ))}
        </div>

        {balances.length === 0 && <p>No balance found</p>}
      </div>
    </div>
  );
};

export default LeaveBalance;