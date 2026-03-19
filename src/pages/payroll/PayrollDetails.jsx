import "../../styles/payrollDetails.css";

const PayrollDetails = ({ payroll, onClose }) => {
  if (!payroll) return null;

  return (
    <div className="payroll-overlay">
      <div className="payroll-detail-card">

        <div className="payroll-title">{payroll.name}</div>

        <div className="payroll-section">
          <p>Basic: ₹{payroll.basic_salary}</p>
          <p>HRA: ₹{payroll.hra}</p>
          <p>Allowances: ₹{payroll.allowances}</p>
        </div>

        <hr />

        <div className="payroll-section">
          <p>PF: ₹{payroll.pf}</p>
          <p>ESI: ₹{payroll.esi}</p>
          <p>TDS: ₹{payroll.tds}</p>
        </div>

        <div className="net-salary">
          Net Salary: ₹{payroll.net_salary}
        </div>

        <button className="back-btn" onClick={onClose}>
          ⬅ Back
        </button>

      </div>
    </div>
  );
};

export default PayrollDetails;