import React, { useState } from "react";

export default function UpdateUser() {
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4001/updateUser", {
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
      const response = await fetch("http://localhost:4001/deleteUser", {
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
        <h2 className="update-user-title">Update User</h2>
        <form className="update-user-form" onSubmit={handleUpdate}>
          <div className="input-group">
            <label htmlFor="oldUsername">Old Username</label>
            <input
              id="oldUsername"
              type="text"
              placeholder="Enter old username"
              onChange={(e) => setOldUsername(e.target.value)}
              value={oldUsername}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="newUsername">New Username</label>
            <input
              id="newUsername"
              type="text"
              placeholder="Enter new username"
              onChange={(e) => setNewUsername(e.target.value)}
              value={newUsername}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
          </div>
          <button type="submit" className="update-user-button update-button">
            Update User
          </button>
        </form>
      </div>

      <div className="update-user-section">
        <h2 className="update-user-title">Delete User</h2>
        <form className="update-user-form" onSubmit={handleDelete}>
          <div className="input-group">
            <label htmlFor="deleteUsername">Username to Delete</label>
            <input
              id="deleteUsername"
              type="text"
              placeholder="Enter username to delete"
              onChange={(e) => setOldUsername(e.target.value)}
              value={oldUsername}
              required
            />
          </div>
          <button type="submit" className="update-user-button delete-button">
            Delete User
          </button>
        </form>
      </div>

      <style jsx>{`
        .update-user-container {
          display: flex;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .update-user-section {
          flex: 1;
          min-width: 0;
        }

        .update-user-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .update-user-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.9rem;
          color: #555;
        }

        .input-group input {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .update-user-button {
          padding: 0.75rem;
          font-size: 1rem;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
        }

        .update-user-button:hover {
          transform: translateY(-1px);
        }

        .update-user-button:active {
          transform: translateY(0);
        }

        .update-button {
          background-color: #3498db;
        }

        .update-button:hover {
          background-color: #2980b9;
        }

        .delete-button {
          background-color: #e74c3c;
        }

        .delete-button:hover {
          background-color: #c0392b;
        }

        @media (max-width: 768px) {
          .update-user-container {
            flex-direction: column;
            padding: 1.5rem;
          }

          .update-user-section {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .update-user-container {
            padding: 1rem;
          }

          .update-user-title {
            font-size: 1.3rem;
          }

          .input-group input,
          .update-user-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
