import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";

import Events from "./Events";
import EventPage from "./EventId";
import Location from "./Location";
import Admin from "./Admin";
import Map from "./Map";
import Favorites from "./Favorites";
import { useEventStore } from "../customHook/useEventStore";

function Homepage({ user, setUser }) {
  const { setEventData, setLocationData } = useEventStore();

  // this is used to get all the data you need the moment you login
  useEffect(() => {
    async function fetchEventData() {
      const response = await fetch("http://localhost:5000/getEventInfo");
      const data = await response.json();

      const venueResponse = await fetch(
        "http://localhost:5000/getEventVenueInfo"
      );
      const venueData = await venueResponse.json();
      const combinedData = data.map((event) => {
        const venue = venueData.find((v) => v.id === event.venueId);

        return {
          ...event,
          venue: venue.name,
          latitude: venue.latitude,
          longitude: venue.longitude,
        };
      });

      const venueEventCounts = venueData.map((venue) => {
        return {
          ...venue,
          count: combinedData.filter((event) => event.venue === venue.name)
            .length,
        };
      });

      setEventData(combinedData);
      setLocationData(venueEventCounts);
    }
    fetchEventData();
  }, [setEventData, setLocationData]);

  const handleLogout = () => {
    setUser(null); // Clear user info on logout
    localStorage.removeItem("token");
  };
  // routing
  return (
    <Router>
      {/* this is the navbar */}
      <nav className="navBar">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/map">Map</Link>
        <Link to="/favorites">Favorites</Link>
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
        <div
          style={{
            position: "absolute",
            right: 10,
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={() => handleLogout()}>Log Out</button>
          <div>Username : {user.username}</div>
        </div>
      </nav>

      {/* navbar come in pair with route */}
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventPage />} />
        <Route path="/locations" element={<Location />} />
        <Route path="/map" element={<Map />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

const Home = ({ user }) => {
  return (
    <div>
      {/* original code below */}
      <h1>Welcome, {user?.username}!</h1>
      {user?.isAdmin ? (
        <div>
          <p>You are logged in as an admin.</p>
        </div>
      ) : (
        <p>You are logged in as a regular user.</p>
      )}
    </div>
  );
};

export default Homepage;
