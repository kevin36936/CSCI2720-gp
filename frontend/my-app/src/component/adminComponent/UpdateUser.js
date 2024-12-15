import React, { useState } from "react";

export default function UpdateUser() {
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldUsername, newUsername, newPassword }),
      });
      const data = await response.json();
      if (data) {
        setOldUsername("");
        setNewUsername("");
        setNewPassword("");
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during user update:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldUsername }),
      });
      const data = await response.json();
      if (data) {
        setOldUsername("");
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during user deletion:", error);
    }
  };

  return (
    <div className="update-user-container">
      <div className="update-user-section">
        <h1 className="update-user-title">Update User</h1>
        <form className="update-user-form" onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Old username"
            onChange={(e) => setOldUsername(e.target.value)}
            value={oldUsername}
            className="update-user-input"
            required
          />
          <input
            type="text"
            placeholder="New username"
            onChange={(e) => setNewUsername(e.target.value)}
            value={newUsername}
            className="update-user-input"
            required
          />
          <input
            type="password"
            placeholder="New password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            className="update-user-input"
            required
          />
          <button type="submit" className="update-user-button update-button">
            Update
          </button>
        </form>
      </div>

      <div className="update-user-section">
        <h1 className="update-user-title">Delete User</h1>
        <form className="update-user-form" onSubmit={handleDelete}>
          <input
            type="text"
            placeholder="Username to delete"
            onChange={(e) => setOldUsername(e.target.value)}
            value={oldUsername}
            className="update-user-input"
            required
          />
          <button type="submit" className="update-user-button delete-button">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
