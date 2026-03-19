import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";
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

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<Login />} />

                {/* Dashboard (everyone logged-in only) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
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