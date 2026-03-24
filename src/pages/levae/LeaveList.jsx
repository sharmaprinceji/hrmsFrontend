import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/leave.css";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [message,setMessage]=useState("");

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data.data || []);
    } catch (err) {
      alert("Failed to load leaves");
    }
  };

  const approveLeave = async (id) => {
    try {
      let res = await api.put(`/leaves/${id}/approve`);
      setMessage(res.message);
      alert(message || "Leave Approved"); 
      fetchLeaves();
    } catch (err) {
      alert(message || "Yor are not allowed to approve !");
    }
  };

  const rejectLeave = async (id) => {
    try {
      const res = await api.put(`/leaves/${id}/reject`);
      alert(res.data.message || "Leave Rejected"); // ✅ backend message
      fetchLeaves();
    } catch (err) {
       alert(message || "Yor are not allowed to reject !");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="leave-container">
      <Sidebar />

      <div className="leave-main">
        <h2>Leave Requests</h2>

        <div className="leave-card">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.leave_type}</td>

                  <td>
                    {new Date(l.start_date).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(l.end_date).toLocaleDateString()}
                  </td>

                  <td>{l.days}</td>

                  <td>
                    <span className={`status ${l.status}`}>
                      {l.status}
                    </span>
                  </td>

                  <td>
                    {l.status === "pending" && (
                      <>
                        <Button
                          text="Approve"
                          onClick={() => approveLeave(l.id)}
                          className="leave-btn"
                        />

                        <Button
                          text="Reject"
                          type="secondary"
                          onClick={() => rejectLeave(l.id)}
                         />
                      </>
                      
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaves.length === 0 && <p>No leave requests found</p>}
        </div>
      </div>
    </div>
  );
};

export default LeaveList;