import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import PayrollDetails from "./PayrollDetails";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/payrolls.css";

const PayrollList = () => {
  const { user } = useContext(AuthContext);

  const [payrolls, setPayrolls] = useState([]);
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

  // ✅ FETCH BOTH APIs
  const fetchData = async () => {
    try {
      const [payrollRes, empRes] = await Promise.all([
        api.get("/payroll/view"),
        api.get("/employees"),
      ]);

      setPayrolls(payrollRes.data.data || []);
      setEmployees(empRes.data.data || []);
    } catch {
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ CREATE EMPLOYEE MAP (FAST LOOKUP)
  const employeeMap = {};
  employees.forEach((emp) => {
    employeeMap[emp.id] = emp;
  });

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
      fetchData(); // refresh table
    } catch (err) {
      alert(err?.response?.data?.message || "Generate failed");
    }
  };

  // ✅ VIEW PAYROLL DETAILS
  const viewPayroll = async (id) => {
    try {
      const res = await api.get(`/payroll/employee/${id}`);
      const payroll = res.data.data;

      const emp = employeeMap[payroll.employee_id] || {};

      // 🔥 merge payroll + employee
      setSelectedPayroll({
        ...payroll,
        ...emp,
      });
    } catch {
      alert("Failed to load payroll details");
    }
  };

  // ✅ DOWNLOAD PAYSLIP
  const downloadPayslip = async (id) => {
    try {
      const res = await api.get(`/payroll/payslip/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip-${id}.pdf`);
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="payroll-container">
      <Sidebar />

      <div className="payroll-main">
        <h2>Payroll Records</h2>

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
        ) : payrolls.length === 0 ? (
          <div className="payroll-card">
            <p>No payroll records found</p>
          </div>
        ) : (
          <div className="payroll-card">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Base Salary</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Net Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {payrolls.map((p) => {
                  const emp = employeeMap[p.employee_id] || {};

                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>

                      <td>{emp.department || "-"}</td>
                      <td>{emp.designation || "-"}</td>
                      <td>₹{emp.salary || "-"}</td>

                      <td>{p.payroll_month}</td>
                      <td>{p.payroll_year}</td>
                      <td>₹{p.net_salary}</td>

                      <td>
                        <button onClick={() => viewPayroll(p.id)}>
                          👁 View
                        </button>

                        <button onClick={() => downloadPayslip(p.id)}>
                          📄 Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ DETAILS MODAL */}
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