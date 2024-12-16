import React, { useState, useEffect } from "react";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchUserData() {
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/checkToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data); // Pass user data (username and isAdmin flag) to parent
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred. Please try again.");
        }
      }
    }

    fetchUserData();
  }, [setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.message) {
        alert(data.message);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        setUser(data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="input-group">
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .login-form {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          text-align: center;
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-size: 0.9rem;
        }

        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #3a7bc8;
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 1.5rem;
          }

          .login-title {
            font-size: 1.25rem;
          }

          .input,
          .submit-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
