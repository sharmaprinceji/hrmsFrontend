import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import "../../styles/user.css";

/* ✅ Debounce Hook */
const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const debouncedSearch = useDebounce(search, 500);

    // ✅ Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);

            const res = await api.get("/users", {
                params: {
                    search: debouncedSearch,
                    role: roleFilter,
                    page: currentPage,
                    limit: 10
                }
            });

            const responseData = res.data.data;

            setUsers(responseData.data || []);
            setTotalPages(responseData.totalPages || 1);
            setTotalUsers(responseData.total || 0);

        } catch (err) {
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Trigger API
    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, roleFilter, currentPage]);

    // ✅ Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, roleFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete user?")) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <div className="employee-container">
            <Sidebar />

            <div className="employee-main">

                {/* Header */}
                <div className="user-header">
                    <h2>Users</h2>

                    {hasPermission(user, "employee", "create") && (
                        <button
                            className="action-btn edit-btn"
                            onClick={() => navigate("/register")}
                        >
                            ➕ Register User
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="user-filters">
                    <input
                        type="text"
                        placeholder="Search by name/email/id"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="HR Admin">HR</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>

                {/* Info */}
                {!loading && (
                    <p style={{ marginBottom: "10px" }}>
                        Showing {(currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
                    </p>
                )}

                {/* Table */}
                {loading ? (
                    <Loader />
                ) : (
                    <div className="employee-card">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length > 0 ? (
                                    users.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role_name}</td>

                                            <td>
                                                {hasPermission(user, "employee", "update") && (
                                                    <button
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            navigate(`/users/edit/${u.id}`, {
                                                                state: { userData: u }
                                                            })
                                                        }
                                                    >
                                                        ✏
                                                    </button>
                                                )}

                                                {hasPermission(user, "employee", "delete") && (
                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() => handleDelete(u.id)}
                                                    >
                                                        🗑
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="pagination">

                            {/* Prev */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                ⬅ Prev
                            </button>

                            {/* Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* Next */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Next ➡
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;