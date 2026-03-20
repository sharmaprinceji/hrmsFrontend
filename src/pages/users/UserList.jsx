import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import "../../styles/user.css";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 5;

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            setUsers(res.data.data || []);
            setFilteredUsers(res.data.data || []);
        } catch (err) {
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Search + Filter
    useEffect(() => {
        let temp = [...users];

        if (search) {
            temp = temp.filter(
                (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter) {
            temp = temp.filter((u) => u.role_name === roleFilter);
        }

        setFilteredUsers(temp);
        setCurrentPage(1);
    }, [search, roleFilter, users]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔢 Pagination
    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete user?")) return;

        try {
            await api.delete(`/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <div className="employee-container">
            <Sidebar />

            <div className="employee-main">

                {/* 🔥 Top Bar */}
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

                {/* 🔍 Search + Filter */}
                <div className="user-filters">
                    <input
                        type="text"
                        placeholder="Search by name/email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>

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
                                {currentUsers.map((u) => (
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
                                ))}
                            </tbody>
                        </table>

                        {/* 🔢 Pagination */}
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;