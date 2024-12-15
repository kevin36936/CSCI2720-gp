import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";

function Location() {
  const { locationData } = useEventStore();
  const [shownLocations, setShownLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxDistance, setMaxDistance] = useState(4); // Default max distance in km
  const [sortOption, setSortOption] = useState(""); // Default sort by name

  // Chinese University coordinates
  const CUHK_LAT = 22.419843173273115;
  const CUHK_LNG = 114.20678205390958;
  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getUniqueBracketedTerms = (locations) => {
    const terms = new Set();
    locations.forEach((location) => {
      const match = location.name.match(/\((.*?)\)/);
      if (match) {
        terms.add(match[1]);
      }
    });
    return Array.from(terms);
  };

  useEffect(() => {
    const filteredLocations = locationData
      .filter((location) => {
        return (
          (location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            location.count > 3 &&
            location.latitude) ||
          (String(location.count).includes(searchTerm) &&
            location.count > 3 &&
            location.latitude) // Filter by distance
        );
      })
      .slice(0, 10)
      .filter((location) => {
        const distance = calculateDistance(
          CUHK_LAT,
          CUHK_LNG,
          location.latitude,
          location.longitude
        );
        return distance > maxDistance;
      })
      .filter((location) => {
        return location.name.toLowerCase().includes(sortOption.toLowerCase());
      });

    setShownLocations(filteredLocations);
  }, [locationData, searchTerm, maxDistance, sortOption]); // Include maxDistance in dependencies

  const uniqueTerms = getUniqueBracketedTerms(locationData);

  const handleFavoriteClick = async (id) => {
    const username = localStorage.getItem("username");
    const response = await fetch("http://localhost:5000/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, username: username }),
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className="locations-container">
      <div className="locations-content">
        <h1 className="locations-title">Location Page</h1>

        {/* Search input */}
        <div className="locations-search">
          <input
            type="text"
            placeholder="Search locations or location venue count..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="locations-search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="locations-search-icon" />
        </div>

        {/* Distance input */}
        <div className="locations-distance-slider">
          <label htmlFor="distance">Max Distance: {maxDistance} km</label>
          <input
            type="range"
            id="distance"
            min="0"
            max="50" // Set max distance to 50 km (adjust as needed)
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="locations-distance-input"
          />
        </div>

        {/* Sorting dropdown */}
        <div className="locations-sorting">
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="locations-sort-input"
          >
            <option value="">Select an option</option>
            {uniqueTerms.map((term, index) => (
              <option key={index} value={term}>
                {term}
              </option>
            ))}
          </select>
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
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td>
                      <a href={`/map/?id=${location.id}`}>{location.name}</a>
                    </td>
                    <td>{location.count}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="locations-favorite-icon"
                        onClick={() => handleFavoriteClick(location.id)}
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
