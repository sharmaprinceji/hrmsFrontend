import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeCreate from "../pages/employees/EmployeeCreate";
import LeaveList from "../pages/levae/LeaveList";
import LeaveApply from "../pages/levae/LeaveApply";
import PayrollList from "../pages/payroll/PayrollList";
import TaskList from "../pages/tasks/TaskList";
import Attendance from "../pages/attendance/Attendance";

import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployeeEdit from "../pages/employees/EmployeeEdit";
import Register from "../pages/auth/Register";
import Department from "../pages/department/Department";
import UserList from "../pages/users/UserList";
import UserEdit from "../pages/users/UserEdit";
import LeaveBalance from "../pages/levae/LeaveBalance";
import AddPayroll from "../pages/payroll/AddPayroll";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import RolePage from "../pages/role/RolePage";
import Profile from "../pages/profile/Profile";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />

                {/* Dashboard (everyone logged-in only) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/roles"
                    element={
                        <ProtectedRoute module="role" action="create">
                            <RolePage />
                        </ProtectedRoute>
                    }
                />

                {/* Employees */}
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute module="employee" action="view">
                            <EmployeeList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute module="employee" action="view">
                            <UserList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users/edit/:id"
                    element={
                        <ProtectedRoute module="employee" action="update">
                            <UserEdit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <ProtectedRoute module="employee" action="create">
                            <Register />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/edit/:id"
                    element={
                        <ProtectedRoute module="employee" action="update">
                            <EmployeeEdit />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/create"
                    element={
                        <ProtectedRoute module="employee" action="create">
                            <EmployeeCreate />
                        </ProtectedRoute>
                    }
                />

                {/* Leave */}
                <Route
                    path="/leave"
                    element={
                        <ProtectedRoute module="leave" action="view">
                            <LeaveList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leave/balance"
                    element={
                        <ProtectedRoute module="leave" action="view">
                            <LeaveBalance />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leave/apply"
                    element={
                        <ProtectedRoute module="leave" action="apply">
                            <LeaveApply />
                        </ProtectedRoute>
                    }
                />

                {/* Payroll */}
                <Route
                    path="/payroll"
                    element={
                        <ProtectedRoute module="payroll" action="view">
                            <PayrollList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payroll/add"
                    element={
                        <ProtectedRoute>
                            <AddPayroll />
                        </ProtectedRoute>
                    }
                />

                {/* Tasks */}
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute module="task" action="view">
                            <TaskList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/departments"
                    element={
                        <ProtectedRoute module="department" action="view">
                            <Department />
                        </ProtectedRoute>
                    }
                />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute module="attendance" action="view">
                            <Attendance />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;