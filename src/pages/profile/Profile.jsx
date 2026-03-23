import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import "../../styles/profile.css";

const Profile = () => {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setData(res.data.data);

      setForm({
        name: res.data.data.name,
        email: res.data.data.email,
      });
    } catch {
      alert("Failed to load profile");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${data.id}`, form);

      alert("Profile updated");
      setEdit(false);
      fetchProfile();
    } catch {
      alert("Update failed");
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <Sidebar />

      <div className="profile-main">
        <div className="profile-card">

          <h2>👤 My Profile</h2>

          {/* NAME */}
          <div className="profile-field">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              disabled={!edit}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              disabled={!edit}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* ROLE (READ ONLY) */}
          <div className="profile-field">
            <label>Role</label>
            <input value={data.role} disabled />
          </div>

          {/* STATUS */}
          <div className="profile-field">
            <label>Status</label>
            <input value={data.status} disabled />
          </div>

          {/* CREATED */}
          <div className="profile-field">
            <label>Joined</label>
            <input
              value={new Date(data.created_at).toLocaleDateString()}
              disabled
            />
          </div>

          {/* BUTTONS */}
          <div className="profile-actions">
            {!edit ? (
              <button onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleUpdate}>
                  Save
                </button>
                <button onClick={() => setEdit(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;