import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import PayrollDetails from "./PayrollDetails";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/payrolls.css";

const PayrollList = () => {
  const { user } = useContext(AuthContext);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    tds: "",
  });

  const isHRorAdmin = user?.roleId === 1 || user?.roleId === 3;

  // ✅ FETCH EMPLOYEES ONLY
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.data || []);
    } catch {
      alert("Error loading employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ GENERATE PAYROLL
  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      await api.post("/payroll/generate", {
        employeeId: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        tds: Number(form.tds || 0),
      });

      alert("Payroll generated successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Generate failed");
    }
  };

  // ✅ DOWNLOAD PAYSLIP
  const downloadPayslip = async (employeeId) => {
    try {
      const res = await api.get(`/payroll/payslip/${employeeId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip-${employeeId}.pdf`);
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="payroll-container">
      <Sidebar />

      <div className="payroll-main">
        <h2>Employee Payroll</h2>

        {/* ✅ GENERATE FORM */}
        {isHRorAdmin && (
          <form className="payroll-form" onSubmit={generatePayroll}>
            <select
              value={form.employeeId}
              onChange={(e) =>
                setForm({ ...form, employeeId: e.target.value })
              }
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
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
            />

            <input
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="TDS"
              value={form.tds}
              onChange={(e) =>
                setForm({ ...form, tds: e.target.value })
              }
            />

            <button type="submit">Generate</button>
          </form>
        )}

        {/* ✅ TABLE */}
        {loading ? (
          <Loader />
        ) : employees.length === 0 ? (
          <div className="payroll-card">
            <p>No employees found</p>
          </div>
        ) : (
          <div className="payroll-card">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.department || "-"}</td>
                    <td>{emp.designation || "-"}</td>
                    <td>₹{emp.salary || "-"}</td>

                    <td>{form.month}</td>
                    <td>{form.year}</td>

                    <td>
                      <button
                        onClick={() => setSelectedPayroll(emp)}
                      >
                        👁 View
                      </button>

                      <button
                        onClick={() => downloadPayslip(emp.id)}
                      >
                        📄 Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ VIEW DETAILS */}
        {selectedPayroll && (
          <PayrollDetails
            payroll={selectedPayroll}
            onClose={() => setSelectedPayroll(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PayrollList;