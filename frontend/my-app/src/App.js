import React, { useState, useEffect } from "react";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Store logged-in user info

  useEffect(() => {
    const createAdminUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "admin",
            password: "admin",
            isAdmin: true,
          }),
        });
        const data = await response.json();
      } catch (error) {
        console.error("Error during admin user creation:", error);
      }
    };
    createAdminUser();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Login component */}
        {!user && <Login setUser={setUser} />}

        {/* Homepage component */}
        {user && <Homepage user={user} setUser={setUser} />}
      </header>
    </div>
  );
}

export default App;
