import { useState } from "react";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usernameRegex = /^.{4,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usernameRegex.test(username)) {
      setError("Username must be at least 4 characters long.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data) {
        setUsername("");
        setPassword("");
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      setError("An error occurred while creating the user.");
    }
  };

  return (
    <div className="create-user-container">
      <h2 className="create-user-title">Create New User</h2>
      <form className="create-user-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="At least 4 characters"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            pattern=".{4,}"
            title="Username must be at least 4 characters long"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="6+ chars, 1 uppercase, 1 lowercase, 1 number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}"
            title="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
          />
        </div>
        <button type="submit" className="create-user-button">
          Create User
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <style jsx>{`
        .create-user-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .create-user-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .create-user-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .input-group label {
          font-size: 0.9rem;
          color: #555;
        }

        .input-group input {
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: border-color 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #3498db;
        }

        .create-user-button {
          padding: 10px;
          font-size: 1rem;
          color: #fff;
          background-color: #3498db;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-user-button:hover {
          background-color: #2980b9;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 10px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .create-user-container {
            padding: 15px;
          }

          .create-user-title {
            font-size: 1.3rem;
          }

          .input-group input,
          .create-user-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateUser;
