import { useState, useEffect } from "react";
import api from "../api";
import styles from "./css/Profile.module.css";

export default function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await api.patch("/users/me/", {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <h1>Your Profile</h1>

      <div className={styles.card}>
        {!editing ? (
          <>
            <div className={styles.row}>
              <span>Name</span>
              <strong>
                {user.first_name} {user.last_name}
              </strong>
            </div>

            <div className={styles.row}>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className={styles.row}>
              <span>Role</span>
              <strong className={styles.role}>{user.role}</strong>
            </div>

            <button className="btn btnPrimary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <label>
              First name
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label>
              Last name
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <div className={styles.actions}>
              <button
                className="btn btnPrimary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                className="btn btnOutline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
