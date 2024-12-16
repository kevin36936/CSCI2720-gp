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
    <div>
      <form className="create-user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="create-user-input"
          required
          pattern=".{4,}"
          title="Username must be at least 4 characters long"
        />
        <div style={{ color: "red" }}>
          Username must be at least 4 characters long.
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="create-user-input"
          required
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}"
          title="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
        />
        <div style={{ color: "red" }}>
          Password must be at least 6 characters long and contain at least one
          uppercase letter, one lowercase letter, and one number.
        </div>
        <button type="submit" className="create-user-button">
          Create
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <style jsx>{`
        .error-message {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default CreateUser;
