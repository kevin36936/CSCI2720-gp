const express = require("express");
const cors = require("cors");
const {XMLParser} = require("fast-xml-parser");

const app = express();
app.use(cors());
app.use(express.json());

// Mock database of users
const users = [
  { username: "admin", password: "admin", isAdmin: true }, // Admin account
  { username: "user1", password: "password1", isAdmin: false }, // Regular user
];

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Request Body:", req.body); // Log incoming request data

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.json({ username: user.username, isAdmin: user.isAdmin });
});

// Admin-only action endpoint
app.post("/admin-action", (req, res) => {
  const { username } = req.body;

  // Check if the user is an admin
  const user = users.find((u) => u.username === username);
  if (!user || !user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  res.json({ message: `Admin action performed by ${username}` });
});

// Add new user endpoint (admin-only)
app.post("/add-user", (req, res) => {
  const { adminUsername, newUsername, newPassword, isAdmin } = req.body;

  // Check if the request comes from an admin
  const adminUser = users.find(
    (u) => u.username === adminUsername && u.isAdmin
  );
  if (!adminUser) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  // Add the new user to the mock database
  users.push({ username: newUsername, password: newPassword, isAdmin });
  res.json({ message: `User ${newUsername} added successfully` });
});

// Protected route for all logged-in users
app.get("/locations", (req, res) => {
  // Example locations data
  const locations = [
    { name: "Location A", events: 5 },
    { name: "Location B", events: 3 },
    { name: "Location C", events: 7 },
  ];

  res.json({ locations });
});

// code for retrieving data from data.gov.hk

// the parser is used to transform xml to json for easy data manipulation
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
});

// this is use to get all the events info
// only this api and the venue api is needed
app.get("/getEventInfo", async (req, res) => {
  try {
    const response = await fetch("https://www.lcsd.gov.hk/datagovhk/event/events.xml");
    const xmlData = await response.text();
    const jsonData = parser.parse(xmlData);
    const events = jsonData.events.event.map((event) => ({
      ...event,
      eventId: event["@id"],
    }));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/getEventVenueInfo", async (req, res) => {
  try {
    const response = await fetch("https://www.lcsd.gov.hk/datagovhk/event/venues.xml");
    const xmlData = await response.text();
    const jsonData = parser.parse(xmlData);

    const venues = {};
    jsonData.venues.venue.forEach((venue) => {
      const id = venue["@id"];
      venues[id] = {
        venuec: venue.venuec.trim(),
        venuee: venue.venuee.trim(),
        latitude: venue.latitude || null, // Default to null if not available
        longitude: venue.longitude || null, // Default to null if not available
      };
    });

    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// end of the code

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
