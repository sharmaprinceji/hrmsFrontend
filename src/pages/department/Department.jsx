import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/department.css";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchDepartments();
    setRole(localStorage.getItem("role")); // ✅ role from login
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data || []);
    } catch (err) {
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
      fetchDepartments();
    } catch (err) {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setForm({
      name: dept.name || "",
      description: dept.description || "",
    });
    setEditingId(dept.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="department-container">
      <Sidebar />

      <div className="department-main">
        <h2>🏢 Department Management</h2>

        {/* ✅ Only Admin / HR can create */}
        {["admin", "hr"].includes(role) && (
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

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setForm({ name: "", description: "" });
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        )}

        {/* ✅ TABLE */}
        <div className="department-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>

                {/* Only admin/hr */}
                {["admin", "hr"].includes(role) && <th>Actions</th>}
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

                    {["admin", "hr"].includes(role) && (
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(d)}
                        >
                          ✏ Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(d.id)}
                        >
                          🗑 Delete
                        </button>
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