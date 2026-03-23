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

  const [showForm, setShowForm] = useState(false); // 🔥 toggle

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
  // CREATE ROLE
  // =========================
  const createRole = async () => {
    if (!name) return alert("Role name is required");

    try {
      const permissionIds = permissions
        .filter((p) =>
          selectedPermissions.includes(`${p.module}-${p.action}`)
        )
        .map((p) => p.id);

      await api.post("/roles/create", {
        name,
        description,
        permissions: permissionIds,
      });

      alert("Role created successfully");

      // reset
      setName("");
      setDescription("");
      setSelectedPermissions([]);
      setShowForm(false); // 🔥 auto hide form

      fetchRoles();
    } catch (err) {
      alert("Failed to create role");
    }
  };

  return (
    <div className="role-container">
      <Sidebar />

      <div className="role-main">
        <div className="role-header">
          <h2>Role Management</h2>

          {!showForm && (
            <button
              className="create-btn"
              onClick={() => setShowForm(true)}
            >
              + Create Role
            </button>
          )}
        </div>

        {/* 🔥 CREATE FORM (TOGGLE) */}
        {showForm && (
          <div className="role-card">
            <div className="form-header">
              <h3>Create Role</h3>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
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

            <Button text="Create Role" onClick={createRole} />
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
              </tr>
            </thead>

            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.description}</td>
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