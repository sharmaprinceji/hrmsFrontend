// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import Sidebar from "../../components/common/Sidebar";
// import Loader from "../../components/common/Loader";
// import PayrollDetails from "./PayrollDetails"; // ✅ import
// import "../../styles/payrolls.css";

// const PayrollList = () => {
//   const [payrolls, setPayrolls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPayroll, setSelectedPayroll] = useState(null);

//   const fetchPayroll = async () => {
//     try {
//       const res = await api.get("/payroll/view");
//       setPayrolls(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Error loading payroll");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPayslip = async (id) => {
//     try {
//       const res = await api.get(`/payroll/payslip/${id}`, {
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `payslip-${id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   useEffect(() => {
//     fetchPayroll();
//   }, []);

//   return (
//     <div className="payroll-container">
//       <Sidebar />

//       <div className="payroll-main">
//         <h2>Payroll</h2>

//         {/* ✅ SHOW DETAILS VIEW */}
//         {selectedPayroll ? (
//           <PayrollDetails
//             payroll={selectedPayroll}
//             onClose={() => setSelectedPayroll(null)}
//           />
//         ) : loading ? (
//           <Loader />
//         ) : payrolls.length === 0 ? (
//           <div className="payroll-card">
//             <p>No payroll records found</p>
//           </div>
//         ) : (
//           <div className="payroll-card">
//             <table className="payroll-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Month</th>
//                   <th>Year</th>
//                   <th>Net Salary</th>
//                   <th>Payslip</th>
//                   <th>View</th> {/* ✅ added */}
//                 </tr>
//               </thead>

//               <tbody>
//                 {payrolls.map((p) => (
//                   <tr key={p.id}>
//                     <td>{p.name}</td>
//                     <td>{p.payroll_month}</td>
//                     <td>{p.payroll_year}</td>
//                     <td className="salary">₹{p.net_salary}</td>

//                     <td>
//                       <button
//                         className="download-btn"
//                         onClick={() => downloadPayslip(p.id)}
//                       >
//                         📄 Download
//                       </button>
//                     </td>

//                     <td>
//                       <button
//                         className="view-btn"
//                         onClick={() => setSelectedPayroll(p)}
//                       >
//                         👁 View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayrollList;

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

  // 🔥 FETCH PAYROLL
  const fetchPayroll = async () => {
    try {
      const res = await api.get("/payroll/view");
      setPayrolls(res.data.data || []);
    } catch {
      alert("Error loading payroll");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FETCH EMPLOYEES
  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.data || []);
  };

  useEffect(() => {
    fetchPayroll();
    fetchEmployees();
  }, []);

  // 🔥 GENERATE PAYROLL
  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      await api.post("/payroll/generate", {
        employeeId: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        tds: Number(form.tds || 0),
      });

      alert("Payroll generated");
      fetchPayroll();

    } catch (err) {
      alert(err?.response?.data?.message || "Generate failed");
    }
  };

  // 🔥 DOWNLOAD
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
        <h2>Payroll</h2>

        {/* 🔥 GENERATE FORM (HR/ADMIN ONLY) */}
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

        {/* 🔥 DETAILS VIEW */}
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
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.payroll_month}</td>
                    <td>{p.payroll_year}</td>
                    <td>₹{p.net_salary}</td>

                    <td>
                      <button onClick={() => downloadPayslip(p.id)}>
                        📄
                      </button>
                    </td>

                    <td>
                      <button onClick={() => setSelectedPayroll(p)}>
                        👁
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