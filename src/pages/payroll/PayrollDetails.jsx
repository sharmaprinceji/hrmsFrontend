import "../../styles/payrollDetails.css";

const PayrollDetails = ({ payroll, onClose }) => {
  if (!payroll) return null;

  return (
    <div className="payroll-overlay">
      <div className="payroll-detail-card">

        {/* 🔹 HEADER */}
        <h2 className="payroll-title">
          {payroll.name || "Employee"}
        </h2>

        <p className="payroll-sub">
          {payroll.designation || "-"} | {payroll.department || "-"}
        </p>

        {/* 🔹 PERIOD */}
        <div className="payroll-meta">
          <span>Month: {payroll.payroll_month || "-"}</span>
          <span>Year: {payroll.payroll_year || "-"}</span>
        </div>

        {/* ✅ EARNINGS */}
        <div className="payroll-section">
          <h4>Earnings</h4>
          <p>Basic: ₹{payroll.basic_salary ?? payroll.salary ?? 0}</p>
          <p>HRA: ₹{payroll.hra ?? 0}</p>
          <p>Allowances: ₹{payroll.allowances ?? 0}</p>
        </div>

        <hr />

        {/* ✅ DEDUCTIONS */}
        <div className="payroll-section">
          <h4>Deductions</h4>
          <p>PF: ₹{payroll.pf ?? 0}</p>
          <p>ESI: ₹{payroll.esi ?? 0}</p>
          <p>TDS: ₹{payroll.tds ?? 0}</p>
        </div>

        <hr />

        {/* 🔹 SUMMARY */}
        <div className="payroll-summary">
          <p>Gross: ₹{payroll.gross_salary ?? 0}</p>
          <p>Deductions: ₹{payroll.deductions ?? 0}</p>
        </div>

        {/* ✅ NET SALARY */}
        <div className="net-salary">
          Net Salary: ₹{payroll.net_salary ?? 0}
        </div>

        {/* 🔙 BUTTON */}
        <button className="back-btn" onClick={onClose}>
          ⬅ Back
        </button>

      </div>
    </div>
  );
};

export default PayrollDetails;