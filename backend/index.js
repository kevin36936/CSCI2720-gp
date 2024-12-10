const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock database of users
const users = [
  { username: 'admin', password: 'admin', isAdmin: true }, // Admin account
  { username: 'user1', password: 'password1', isAdmin: false }, // Regular user
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Request Body:', req.body); // Log incoming request data

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  res.json({ username: user.username, isAdmin: user.isAdmin });
});

// Admin-only action endpoint
app.post('/admin-action', (req, res) => {
  const { username } = req.body;

  // Check if the user is an admin
  const user = users.find((u) => u.username === username);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  res.json({ message: `Admin action performed by ${username}` });
});

// Add new user endpoint (admin-only)
app.post('/add-user', (req, res) => {
  const { adminUsername, newUsername, newPassword, isAdmin } = req.body;

  // Check if the request comes from an admin
  const adminUser = users.find((u) => u.username === adminUsername && u.isAdmin);
  if (!adminUser) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // Add the new user to the mock database
  users.push({ username: newUsername, password: newPassword, isAdmin });
  res.json({ message: `User ${newUsername} added successfully` });
});

// Protected route for all logged-in users
app.get('/locations', (req, res) => {
  // Example locations data
  const locations = [
    { name: 'Location A', events: 5 },
    { name: 'Location B', events: 3 },
    { name: 'Location C', events: 7 },
  ];

  res.json({ locations });
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
