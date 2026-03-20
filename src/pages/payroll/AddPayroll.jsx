import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/addPayroll.css";

const AddPayroll = () => {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    tds: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.data || []);
    } catch {
      alert("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Submit payroll
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/payroll/generate", {
        employeeId: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        tds: Number(form.tds || 0),
      });

      alert("Payroll generated successfully ✅");

      setForm({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        tds: "",
      });

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to generate payroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addpayroll-container">
      <Sidebar />

      <div className="addpayroll-main">
        <h2>➕ Generate Payroll</h2>

        <form className="addpayroll-form" onSubmit={handleSubmit}>
          <select
            value={form.employeeId}
            onChange={(e) =>
              setForm({ ...form, employeeId: e.target.value })
            }
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Month"
            value={form.month}
            onChange={(e) =>
              setForm({ ...form, month: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="TDS"
            value={form.tds}
            onChange={(e) =>
              setForm({ ...form, tds: e.target.value })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Payroll"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPayroll;