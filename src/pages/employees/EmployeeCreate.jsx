import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/employeeForm.css";

const EmployeeCreate = () => {
  const [departments, setDepartments] = useState([]); // 🔥 NEW

  const [form, setForm] = useState({
    userId: "",
    employeeCode: "",
    departmentId: "",
    designation: "",
    salary: ""
  });

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data || []);
    } catch (err) {
      alert("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!form.departmentId) return alert("Please select department");

    try {
      await api.post("/employees", form);
      alert("Employee Created");
    } catch (err) {
      alert("Error creating employee");
    }
  };

  return (
    <div className="form-container">
      <Sidebar />

      <div className="form-main">
        <div className="form-card">

          <div className="form-title">Create Employee</div>

          <input
            className="form-input"
            placeholder="User ID"
            value={form.userId}
            onChange={(e) =>
              setForm({ ...form, userId: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Employee Code"
            value={form.employeeCode}
            onChange={(e) =>
              setForm({ ...form, employeeCode: e.target.value })
            }
          />

          {/* 🔥 DEPARTMENT DROPDOWN */}
          <select
            className="form-input"
            value={form.departmentId}
            onChange={(e) =>
              setForm({ ...form, departmentId: e.target.value })
            }
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

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
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

          <div className="form-btn">
            <Button text="Create Employee" onClick={handleSubmit} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeCreate;