import React, { useState } from "react";

export default function UpdateEvent() {
  const [eventId, setEventId] = useState("");
  const [eventData, setEventData] = useState({
    id: "",
    title: "",
    dateTime: "",
    duration: "",
    venueId: "",
    description: "",
    presenter: "",
    ageLimit: "",
    price: "",
    remarks: "",
    saleDate: "",
    submitDate: "",
    programTime: "",
    tagentUrl: "",
    url: "",
  });
  const [error, setError] = useState("");

  const fetchEventById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/getEventInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }); // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const event = await response.json();
      const { _id, ...eventWithoutId } = event[0];
      setEventData(eventWithoutId);
      setError("");
    } catch (err) {
      setError("Event not found");
    }
  };

  const handleIdChange = (e) => {
    setEventId(e.target.value);
  };

  const handleSearch = () => {
    if (eventId) {
      fetchEventById(eventId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/updateEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventData }),
    });
    const data = await response.json();
    alert(data.message);
    // Here you would typically send updated data to your API
  };

  return (
    <div className="modify-event-container">
      <div className="form-container">
        <h1 style={{ color: "black" }}>Modify Event</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Enter Event ID"
            value={eventId}
            onChange={handleIdChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.keys(eventData).map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={
                    key.includes("Date") || key === "price" ? "text" : "text"
                  }
                  id={key}
                  name={key}
                  value={eventData[key]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="submit-button">
            Modify Event
          </button>
        </form>
      </div>
    </div>
  );
}
