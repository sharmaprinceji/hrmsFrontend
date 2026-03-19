import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/employeeForm.css";

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    designation: "",
    salary: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch employee details
  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}`);
      const data = res.data.data;

      setForm({
        designation: data.designation,
        salary: data.salary
      });
    } catch (err) {
      alert("Error loading employee");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/employees/${id}`, form);
      alert("Employee updated");
      navigate("/employees");
    } catch (err) {
      alert("Update failed");
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <div className="form-container">
      <Sidebar />

      <div className="form-main">
        <div className="form-card">

          <div className="form-title">Edit Employee</div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <input
                className="form-input"
                placeholder="Designation"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />

              <input
                className="form-input"
                placeholder="Salary"
                value={form.salary}
                onChange={(e) =>
                  setForm({ ...form, salary: e.target.value })
                }
              />

              <Button text="Update Employee" onClick={handleUpdate} />
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default EmployeeEdit;