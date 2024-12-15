const express = require("express");
const cors = require("cors");
const { XMLParser } = require("fast-xml-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Event = require("./models/Event");
const Venue = require("./models/Venue");

const app = express();
app.use(cors());
app.use(express.json());

// mongobd setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/projectDatabase");
const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");
  // your code here
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    // fetching event data to database
    const eventResponse = await fetch(
      "https://www.lcsd.gov.hk/datagovhk/event/events.xml"
    );
    const eventXmlData = await eventResponse.text();
    const eventJsonData = parser.parse(eventXmlData);
    const events = eventJsonData.events.event.map((event) => ({
      ...event,
      eventId: event["@id"],
    }));
    events.forEach(async (event) => {
      const existingEvent = await Event.exists({ id: event.eventId });

      if (existingEvent) {
        Event.findOneAndReplace(
          { id: event.eventId },
          {
            id: event.eventId,
            title: event.titlee,
            description: event.desce,
            dateTime: event.predateE,
            duration: event.progtimee,
            venueId: event.venueid,
            presenter: event.presenterorge,
            ageLimit: event.agelimite,
            price: event.pricee,
            remarks: event.remarke,
            saleDate: event.saledate,
            submitDate: event.submitdate,
            programTime: event.progtimee,
            tagentUrl: event.tagenturle,
            url: event.urle,
          },
          { upsert: true }
        );
        return;
      }

      const newEvent = new Event({
        id: event.eventId,
        title: event.titlee,
        description: event.desce,
        dateTime: event.predateE,
        duration: event.progtimee,
        venueId: event.venueid,
        presenter: event.presenterorge,
        ageLimit: event.agelimite,
        price: event.pricee,
        remarks: event.remarke,
        saleDate: event.saledate,
        submitDate: event.submitdate,
        programTime: event.progtimee,
        tagentUrl: event.tagenturle,
        url: event.urle,
      });
      await newEvent.save();
    });

    // fetching venue data to database
    const venueResponse = await fetch(
      "https://www.lcsd.gov.hk/datagovhk/event/venues.xml"
    );
    const venueXmlData = await venueResponse.text();
    const venueJsonData = parser.parse(venueXmlData);

    venueJsonData.venues.venue.forEach(async (venue) => {
      const id = venue["@id"];
      const existingVenue = await Venue.exists({ id: id });

      if (existingVenue) {
        Venue.findOneAndReplace(
          { id: id },
          {
            id: id,
            name: venue.venuee,
            latitude: venue.latitude,
            longitude: venue.longitude,
            comment: [],
          },
          { upsert: true }
        );
        return;
      }

      const newVenue = new Venue({
        id: id,
        name: venue.venuee,
        latitude: venue.latitude,
        longitude: venue.longitude,
        comment: [],
      });
      await newVenue.save();
    });

    // common login stuff
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    const hashedPassword = await bcrypt.hash(password, 10);

    // if (
    //   defaultUsers.find(
    //     (u) => u.username === username && u.password === password
    //   )
    // ) {
    //   const token = jwt.sign(
    //     {
    //       username: username,
    //       password: hashedPassword,
    //       isAdmin: true,
    //     },
    //     "secret"
    //   );
    //   return res.json({ username: username, isAdmin: true, token: token });
    // }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    const accessToken = jwt.sign(
      {
        username: user.username,
        isAdmin: user.isAdmin,
        password: hashedPassword,
      },
      "secret"
    );

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    if (unhashedPassword) {
      return res.json({
        username: user.username,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
    } else {
      return res.json({ comment: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/checkToken", async (req, res) => {
  try {
    const { token } = req.body;

    const verify = jwt.verify(token, "secret");

    res.json({ username: verify.username, isAdmin: verify.isAdmin });
  } catch (err) {
    res.json({ comment: "token has outdate" });
  }
});

// Admin-only action endpoint
app.post("/createUser", async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    const existingUser = await User.exists({ username: username });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      favorites: [],
    });
    await user.save();

    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/updateUser", async (req, res) => {
  try {
    const { oldUsername, newUsername, newPassword } = req.body;

    const existingUser = await User.exists({ username: oldUsername });
    if (!existingUser) {
      return res.json({ message: "User does not exist" });
    }

    const existingNewUser = await User.exists({ username: newUsername });
    if (existingNewUser) {
      return res.json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { username: oldUsername },
      { username: newUsername, password: hashedPassword }
    );

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    const { oldUsername } = req.body;

    const existingUser = await User.exists({ username: oldUsername });
    if (!existingUser) {
      return res.json({ message: "User does not exist" });
    }

    await User.findOneAndDelete({ username: oldUsername });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/updateLocation", async (req, res) => {
  try {
    const { id, username, comment } = req.body;
    const venue = await Venue.findOne({ id: id });
    await Venue.findOneAndUpdate(
      { id: id },
      { comment: [...venue.comment, { username: username, comment: comment }] }
    );
    return res.json({ message: "Location updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/favorite", async (req, res) => {
  try {
    const { id, username } = req.body;

    const user = await User.findOne({ username: username });
    if (user.favorites.includes(id)) {
      return res.json({ message: "Favorite already exists" });
    }

    console.log(user);

    await User.findOneAndUpdate(
      { username: username },
      { favorites: [...user.favorites, id] }
    );
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    return res.json({ message: "Favorite added successfully" });
  } catch (error) {
    console.log(error);
  }
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
    const response = await Event.find({});
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/getEventVenueInfo", async (req, res) => {
  try {
    const response = await Venue.find({}); // find all venues in the database
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// end of the code

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
