import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import "../../styles/sidebar.css";

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="sidebar">

            {/* TOP */}
            <div>
                <div className="sidebar-logo">HRMS</div>

                <div className="sidebar-menu">

                    {/* <NavLink to="/dashboard" className="sidebar-link">
            🏠 Dashboard
          </NavLink> */}

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        🏠 Dashboard
                    </NavLink>

                    {hasPermission(user, "employee", "view") && (
                        <NavLink to="/users" className="sidebar-link">
                            👥 Users
                        </NavLink>
                    )}

                    {/* {hasPermission(user, "employee", "create") && (
                        <NavLink to="/register" className="sidebar-link">
                            👤 Register User
                        </NavLink>
                    )} */}

                    {hasPermission(user, "employee", "view") && (
                        <NavLink to="/employees" className="sidebar-link">
                            👨‍💼 Employees
                        </NavLink>
                    )}

                    {hasPermission(user, "department", "view") && (
                        <NavLink
                            to="/departments"
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            🏢 Departments
                        </NavLink>
                    )}


                    {hasPermission(user, "leave", "view") && (
                        <NavLink to="/leave" className="sidebar-link">
                            🏖️ Leave
                        </NavLink>
                    )}

                    {hasPermission(user, "leave", "view") && (
                        <NavLink to="/leave/balance" className="sidebar-link">
                            🏖️ LeaveBalance
                        </NavLink>
                    )}

                    {hasPermission(user, "leave", "apply") && (
                        <NavLink to="/leave/apply" className="sidebar-link">
                            📝 Apply Leave
                        </NavLink>
                    )}

                    {hasPermission(user, "payroll", "generate") && (
                        <NavLink to="/payroll/add" className="sidebar-link">
                            ➕ Add Payroll
                        </NavLink>
                    )}

                    {hasPermission(user, "payroll", "view") && (
                        <NavLink to="/payroll" className="sidebar-link">
                            💰 Payroll
                        </NavLink>
                    )}

                    {hasPermission(user, "task", "view") && (
                        <NavLink to="/tasks" className="sidebar-link">
                            📋 Tasks
                        </NavLink>
                    )}

                    {hasPermission(user, "attendance", "view") && (
                        <NavLink to="/attendance" className="sidebar-link">
                            📅 Attendance
                        </NavLink>
                    )}
                </div>
            </div>

            {/* BOTTOM */}
            <button className="sidebar-logout" onClick={handleLogout}>
                🚪 Logout
            </button>

        </div>
    );
};

export default Sidebar;