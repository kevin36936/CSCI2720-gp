import React, { useState } from "react";

export default function CreateEvent() {
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., sending data to an API
    const response = await fetch("http://localhost:5000/createEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventData: eventData }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="create-event-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 style={{ color: "black" }}>Create Event</h1>
          <div className="form-grid">
            {Object.keys(eventData).map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={
                    key.includes("Date") || key === "dateTime"
                      ? "datetime-local"
                      : key === "price"
                      ? "number"
                      : key === "description" || key === "remarks"
                      ? "textarea"
                      : "text"
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
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
