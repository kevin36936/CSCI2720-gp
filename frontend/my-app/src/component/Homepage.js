import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";

import Events from "./Events";
import EventPage from "./EventId";
import Location from "./Location";
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
        const venue = venueData[event.venueid];
        return {
          ...event,
          venuec: venue.venuec,
          venuee: venue.venuee,
          latitude: venue.latitude,
          longitude: venue.longitude,
        };
      });

      setEventData(combinedData);
      setLocationData(venueData);
    }
    fetchEventData();
  }, [setEventData, setLocationData]);

  // routing
  return (
    <Router>
      {/* this is the navbar */}
      <nav className="navBar">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/locations">Locations</Link>
      </nav>

      {/* navbar come in pair with route */}
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventPage />} />
        <Route path="/locations" element={<Location />} />
      </Routes>
    </Router>
  );
}

const Home = ({ user, setUser }) => {
  return (
    <div>
      {/* original code below */}
      <h1>Welcome, {user?.username}!</h1>
      {user?.isAdmin ? (
        <div>
          <p>You have admin permissions.</p>
          {/* Add admin-specific actions here */}
          <button onClick={() => alert("Performing admin action")}>
            Admin Action
          </button>
        </div>
      ) : (
        <p>You are logged in as a regular user.</p>
      )}
      <button onClick={() => setUser(null)}>Log Out</button>
    </div>
  );
};

export default Homepage;
