import { useState } from "react";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="create-user-container">
      <h1 className="create-user-title">Create User</h1>
      <form className="create-user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="create-user-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="create-user-input"
          required
        />
        <button type="submit" className="create-user-button">
          Create
        </button>
      </form>
    </div>
  );
}
