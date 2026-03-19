import Card from "../../components/ui/Card";

const LeaveBalance = ({ balance }) => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Card>CL: {balance.CL}</Card>
      <Card>SL: {balance.SL}</Card>
      <Card>EL: {balance.EL}</Card>
    </div>
  );
};

export default LeaveBalance;