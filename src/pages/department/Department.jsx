import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import "../../styles/departments.css";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data || []);
    } catch {
      alert("Failed to load departments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Department name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
      } else {
        await api.post("/departments", form);
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      setShowForm(false);

      fetchDepartments();
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setForm({
      name: dept.name,
      description: dept.description
    });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="department-container">
      <Sidebar />

      <div className="department-main">

        {/* 🔥 HEADER */}
        <div className="dept-header">
          <h2>🏢 Department Management</h2>

          {hasPermission(user, "department", "create") && (
            <button
              className="add-btn"
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setForm({ name: "", description: "" });
              }}
            >
              ➕ New Department
            </button>
          )}
        </div>

        {/* ✅ FORM */}
        {showForm && (
          <form className="department-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Department Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button type="submit" disabled={loading}>
              {editingId ? "Update" : "Create"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        )}

        {/* ✅ TABLE */}
        <div className="department-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>

                {hasPermission(user, "department", "update") && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="3">No departments found</td>
                </tr>
              ) : (
                departments.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.description}</td>

                    {hasPermission(user, "department", "update") && (
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(d)}
                        >
                          ✏ Edit
                        </button>

                        {hasPermission(user, "department", "delete") && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(d.id)}
                          >
                            🗑 Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Department;