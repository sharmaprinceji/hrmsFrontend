import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import "../../styles/employee.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employees");
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Navigate to Edit Page
  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-container">
      <Sidebar />

      <div className="employee-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Employees</h2>

          {/* Create Button */}
          {hasPermission(user, "employee", "create") && (
            <button
              className="action-btn edit-btn"
              onClick={() => navigate("/employees/create")}
            >
              ➕ Add Employee
            </button>
          )}
        </div>

        {/* Loader */}
        {loading ? (
          <Loader />
        ) : employees.length === 0 ? (
          <div className="employee-card">
            <p>No employees found</p>
          </div>
        ) : (
          <div className="employee-card">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Dept</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td>{e.employee_code}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.department}</td>
                    <td>₹{e.salary}</td>

                    <td>
                      {/* Edit */}
                      {hasPermission(user, "employee", "update") &&
                        user?.roleId !== 5 && (
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(e.id)}
                          >
                            ✏️
                          </button>
                        )}

                      {/* Delete */}
                      {hasPermission(user, "employee", "delete") && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(e.id)}
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;