import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Button from "../../components/ui/Button";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/role.css";

const RolePage = () => {
  const { user } = useContext(AuthContext);

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // =========================
  // FETCH ROLES
  // =========================
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data.data || []);
    } catch (err) {
      alert("Failed to load roles");
    }
  };

  useEffect(() => {
    if (user?.permissions) {
      setPermissions(user.permissions);
    }
    fetchRoles();
  }, [user]);

  // =========================
  // HANDLE CHECKBOX
  // =========================
  const handleCheckbox = (perm) => {
    const key = `${perm.module}-${perm.action}`;

    setSelectedPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  // =========================
  // EDIT ROLE
  // =========================
  const handleEdit = (role) => {
    setEditId(role.id);
    setName(role.name);
    setDescription(role.description);

    // ⚠️ If backend not sending permissions, skip this part
    if (role.permissions) {
      const selected = permissions
        .filter((p) =>
          role.permissions.some((rp) => rp.id === p.id)
        )
        .map((p) => `${p.module}-${p.action}`);

      setSelectedPermissions(selected);
    }

    setShowForm(true);
  };

  // =========================
  // DELETE ROLE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      await api.delete(`/roles/${id}`);
      alert("Role deleted");
      fetchRoles();
    } catch {
      alert("Delete failed");
    }
  };

  // =========================
  // CREATE / UPDATE ROLE
  // =========================
  const saveRole = async () => {
    if (!name) return alert("Role name required");

    const permissionIds = permissions
      .filter((p) =>
        selectedPermissions.includes(`${p.module}-${p.action}`)
      )
      .map((p) => p.id);

    try {
      if (editId) {
        await api.put(`/roles/${editId}`, {
          name,
          description,
          permissions: permissionIds,
        });

        alert("Role updated");
      } else {
        await api.post("/roles/create", {
          name,
          description,
          permissions: permissionIds,
        });

        alert("Role created");
      }

      // reset
      setEditId(null);
      setName("");
      setDescription("");
      setSelectedPermissions([]);
      setShowForm(false);

      fetchRoles();

    } catch {
      alert("Operation failed");
    }
  };

  return (
    <div className="role-container">
      <Sidebar />

      <div className="role-main">

        {/* HEADER */}
        <div className="role-header">
          <h2>Role Management</h2>

          {!showForm && (
            <button
              className="create-btn"
              onClick={() => {
                setEditId(null);
                setName("");
                setDescription("");
                setSelectedPermissions([]);
                setShowForm(true);
              }}
            >
              + Create Role
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="role-card">
            <div className="form-header">
              <h3>{editId ? "Edit Role" : "Create Role"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                ✖
              </button>
            </div>

            <input
              type="text"
              placeholder="Role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="role-input"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="role-input"
            />

            <h4>Assign Permissions</h4>

            <div className="permission-box">
              {permissions.map((p, index) => {
                const key = `${p.module}-${p.action}`;
                return (
                  <label key={index} className="permission-item">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(key)}
                      onChange={() => handleCheckbox(p)}
                    />
                    {p.module} - {p.action}
                  </label>
                );
              })}
            </div>

            <Button
              text={editId ? "Update Role" : "Create Role"}
              onClick={saveRole}
            />
          </div>
        )}

        {/* ROLE LIST */}
        <div className="role-card">
          <h3>All Roles</h3>

          <table className="role-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.description}</td>
                  <td>
                    {r.id !== 1 && (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(r)}
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(r.id)}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {roles.length === 0 && <p>No roles found</p>}
        </div>

      </div>
    </div>
  );
};

export default RolePage;