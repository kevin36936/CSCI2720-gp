import React, { useState } from 'react';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Store logged-in user info

  const handleLogout = () => {
    setUser(null); // Clear user info on logout
  };

  return (
    <div className="App">
      <header className="App-header">
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <div>
            <h1>Welcome, {user.username}!</h1>
            {user.isAdmin ? (
              <div>
                <p>You have admin permissions.</p>
                {/* Add admin-specific actions here */}
                <button onClick={() => alert('Performing admin action')}>Admin Action</button>
              </div>
            ) : (
              <p>You are logged in as a regular user.</p>
            )}
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
