import React, { useState } from "react";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Store logged-in user info

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
