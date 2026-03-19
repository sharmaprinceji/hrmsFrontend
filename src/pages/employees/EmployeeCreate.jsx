import { useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import "../../styles/employeeForm.css";

const EmployeeCreate = () => {
  const [form, setForm] = useState({
    userId: "",
    employeeCode: "",
    departmentId: "",
    designation: "",
    salary: ""
  });

  const handleSubmit = async () => {
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
            onChange={(e)=>setForm({...form,userId:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Employee Code"
            onChange={(e)=>setForm({...form,employeeCode:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Department ID"
            onChange={(e)=>setForm({...form,departmentId:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Designation"
            onChange={(e)=>setForm({...form,designation:e.target.value})}
          />

          <input
            className="form-input"
            placeholder="Salary"
            onChange={(e)=>setForm({...form,salary:e.target.value})}
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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import Sidebar from "../../components/common/Sidebar";
// import Button from "../../components/ui/Button";
// import "../../styles/employeeForm.css";

// const EmployeeCreate = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     userId: "",
//     employeeCode: "",
//     departmentId: "",
//     designation: "",
//     salary: ""
//   });

//   const [loading, setLoading] = useState(false);

//   // 🔥 Auto-fill userId from Register flow
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("newUserId");

//     if (storedUserId) {
//       setForm((prev) => ({
//         ...prev,
//         userId: storedUserId
//       }));
//     }
//   }, []);

//   // Validation
//   const validate = () => {
//     if (!form.userId) return "User ID required";
//     if (!form.employeeCode) return "Employee Code required";
//     if (!form.departmentId) return "Department required";
//     if (!form.designation) return "Designation required";
//     if (!form.salary) return "Salary required";

//     return null;
//   };

//   // Submit
//   const handleSubmit = async () => {
//     const error = validate();

//     if (error) {
//       alert(error);
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/employees", form);

//       alert(res.data.message || "Employee Created");

//       // 🔥 Clear stored userId after use
//       localStorage.removeItem("newUserId");

//       // Redirect
//       navigate("/employees");

//     } catch (err) {
//       console.error(err);
//       alert("Error creating employee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <Sidebar />

//       <div className="form-main">
//         <div className="form-card">

//           <div className="form-title">Create Employee</div>

//           {/* User ID (auto-filled) */}
//           <input
//             className="form-input"
//             placeholder="User ID"
//             value={form.userId}
//             disabled
//           />

//           <input
//             className="form-input"
//             placeholder="Employee Code"
//             value={form.employeeCode}
//             onChange={(e) =>
//               setForm({ ...form, employeeCode: e.target.value })
//             }
//           />

//           <input
//             className="form-input"
//             placeholder="Department ID"
//             value={form.departmentId}
//             onChange={(e) =>
//               setForm({ ...form, departmentId: e.target.value })
//             }
//           />

//           <input
//             className="form-input"
//             placeholder="Designation"
//             value={form.designation}
//             onChange={(e) =>
//               setForm({ ...form, designation: e.target.value })
//             }
//           />

//           <input
//             className="form-input"
//             placeholder="Salary"
//             type="number"
//             value={form.salary}
//             onChange={(e) =>
//               setForm({ ...form, salary: e.target.value })
//             }
//           />

//           <div className="form-btn">
//             <Button
//               text={loading ? "Creating..." : "Create Employee"}
//               onClick={handleSubmit}
//             />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeCreate;