import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";

function Location() {
  const { locationData, eventData } = useEventStore();
  const [shownLocations, setShownLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const locations = Object.entries(locationData)
      .map((location) => {
        const eventAmount = eventData.filter(
          (event) => Number(event.venueid) === Number(location[0])
        ).length;
        return [location[0], { ...location[1], eventAmount: eventAmount }];
      })
      .sort((a, b) => b[1].eventAmount - a[1].eventAmount)
      .slice(0, 10);
    setShownLocations(locations);
  }, [locationData, eventData]);

  useEffect(() => {
    const locations = Object.entries(locationData)
      .map((location) => {
        const eventAmount = eventData.filter(
          (event) => Number(event.venueid) === Number(location[0])
        ).length;
        return [location[0], { ...location[1], eventAmount: eventAmount }];
      })
      .sort((a, b) => b[1].eventAmount - a[1].eventAmount)
      .slice(0, 10);
    const filteredLocations = locations.filter(
      (location) =>
        location[1].venuee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location[0].includes(searchTerm)
    );
    setShownLocations(filteredLocations);
  }, [locationData, eventData, searchTerm]);

  return (
    <div className="locations-container">
      <div className="locations-content">
        <h1 className="locations-title">Location Page</h1>

        {/* Search input */}
        <div className="locations-search">
          <input
            type="text"
            placeholder="Search locations or location IDs..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="locations-search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="locations-search-icon" />
        </div>

        {/* Location table */}
        <div className="locations-table-container">
          <div className="overflow-x-auto">
            <table className="locations-table">
              <thead>
                <tr className="locations-table-header">
                  <th>Location ID</th>
                  <th>Location Name</th>
                  <th>Number of Events</th>
                  <th>Favorite</th>
                </tr>
              </thead>
              <tbody className="locations-table-body">
                {shownLocations.map((location) => (
                  <tr key={location[0]}>
                    <td>{location[0]}</td>
                    <td>{location[1].venuee}</td>
                    <td>{location[1].eventAmount}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="locations-favorite-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {shownLocations.length === 0 && (
          <p className="locations-no-results">No locations found</p>
        )}
      </div>
    </div>
  );
}

export default Location;
