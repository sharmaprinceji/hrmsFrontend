import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import PayrollDetails from "./PayrollDetails"; // ✅ import
import "../../styles/payrolls.css";

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const fetchPayroll = async () => {
    try {
      const res = await api.get("/payroll/view");
      setPayrolls(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Error loading payroll");
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async (id) => {
    try {
      const res = await api.get(`/payroll/payslip/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div className="payroll-container">
      <Sidebar />

      <div className="payroll-main">
        <h2>Payroll</h2>

        {/* ✅ SHOW DETAILS VIEW */}
        {selectedPayroll ? (
          <PayrollDetails
            payroll={selectedPayroll}
            onClose={() => setSelectedPayroll(null)}
          />
        ) : loading ? (
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
                  <th>Month</th>
                  <th>Year</th>
                  <th>Net Salary</th>
                  <th>Payslip</th>
                  <th>View</th> {/* ✅ added */}
                </tr>
              </thead>

              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.payroll_month}</td>
                    <td>{p.payroll_year}</td>
                    <td className="salary">₹{p.net_salary}</td>

                    <td>
                      <button
                        className="download-btn"
                        onClick={() => downloadPayslip(p.id)}
                      >
                        📄 Download
                      </button>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedPayroll(p)}
                      >
                        👁 View
                      </button>
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

export default PayrollList;