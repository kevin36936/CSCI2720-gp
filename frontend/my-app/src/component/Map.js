import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";

export default function Map() {
  const { locationData, lightMode } = useEventStore();
  const [localLocationData, setLocalLocationData] = useState([]);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 22.3964, lng: 114.1095 });
  const [shownLocations, setShownLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [exactLocation, setExactLocation] = useState(null);
  const [comment, setComment] = useState("");
  const [firstRender, setFirstRender] = useState(false);

  const query = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    setLocalLocationData(locationData);
  }, [locationData]);

  useEffect(() => {
    if (query && localLocationData[0] && !firstRender) {
      const location = localLocationData.find(
        (location) => location.id === Number(query)
      );
      setFirstRender(true);
      setZoom(16);
      setCenter({ lat: location.latitude, lng: location.longitude });
      setExactLocation(location);
    }
  }, [query, localLocationData, locationData, firstRender]);

  useEffect(() => {
    const filteredLocations = localLocationData
      .filter((location) => location.count > 3 && location.latitude)
      .slice(0, 10);
    setShownLocations(filteredLocations);
  }, [localLocationData]);

  const handleMarkerClick = (marker) => {
    setZoom(13);
    const selectedLocation = shownLocations.filter(
      (location) =>
        location.latitude === marker.latitude &&
        location.longitude === marker.longitude
    );
    setCenter({ lat: marker.latitude, lng: marker.longitude });
    setSelectedLocation(selectedLocation);
  };

  const handleExactLocationClick = (location) => {
    setZoom(16);
    setCenter({ lat: location.latitude, lng: location.longitude });
    setExactLocation(location);
    setSelectedLocation(null);
  };

  const handleCommentSubmit = async () => {
    const username = localStorage.getItem("username");
    setLocalLocationData((prevLocationData) => {
      const updatedLocationData = prevLocationData.map((location) => {
        if (location.id === exactLocation.id) {
          return {
            ...location,
            comment: [...location.comment, { username, comment }],
          };
        }
        return location;
      });
      return updatedLocationData;
    });

    setExactLocation((prevLocation) => ({
      ...prevLocation,
      comment: [...prevLocation.comment, { username, comment }],
    }));
    setComment("");

    try {
      const response = await fetch("http://localhost:5000/updateLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: exactLocation.id, username, comment }),
      });
      await response.json();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleFavoriteClick = async (id) => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch("http://localhost:5000/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, username }),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div className="loading">Loading map...</div>;

  return (
    <div className="map-container">
      <h1
        className="map-title"
        style={{ color: lightMode ? "black" : "white" }}
      >
        Interactive Map
      </h1>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerClassName="google-map"
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {shownLocations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={() =>
              handleMarkerClick({
                latitude: location.latitude,
                longitude: location.longitude,
              })
            }
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation[0].latitude,
              lng: selectedLocation[0].longitude,
            }}
            onCloseClick={() => setSelectedLocation(null) || setZoom(12)}
          >
            <div className="info-window">
              {selectedLocation.map((location) => (
                <div key={location.name}>
                  <h3
                    onClick={() => handleExactLocationClick(location)}
                    className="location-name"
                  >
                    {location.name}
                  </h3>
                  <p>Events Count: {location.count}</p>
                </div>
              ))}
            </div>
          </InfoWindow>
        )}

        {exactLocation && (
          <div>
            <Marker
              position={{
                lat: exactLocation.latitude,
                lng: exactLocation.longitude,
              }}
              onClick={() => handleExactLocationClick(exactLocation)}
            />
            <div className="exact-location-panel">
              <button
                className="close-button"
                onClick={() =>
                  setSelectedLocation(null) ||
                  setExactLocation(null) ||
                  setZoom(12)
                }
              >
                &times;
              </button>
              <button
                className="favorite-button"
                onClick={() => handleFavoriteClick(exactLocation.id)}
              >
                Add favorite
              </button>
              <h2 className="location-title">{exactLocation.name}</h2>
              <p className="events-count">
                Events Count: {exactLocation.count}
              </p>
              <div className="comments-section">
                <h3>User Comments</h3>
                <div className="comments-container">
                  {exactLocation.comment.length === 0 ? (
                    <p>No comments yet</p>
                  ) : (
                    exactLocation.comment.map((comment, index) => (
                      <div key={index} className="comment">
                        <strong>{comment.username}:</strong> {comment.comment}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button onClick={handleCommentSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </GoogleMap>

      <style jsx>{`
        .map-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .map-title {
          text-align: center;
          margin: auto;
          color: #333;
          font-size: 2.5rem;
        }

        .google-map {
          width: 100%;
          height: calc(100vh - 180px);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: #333;
        }

        .info-window {
          padding: 10px;
          max-width: 200px;
        }

        .location-name {
          cursor: pointer;
          color: #0066cc;
          margin-bottom: 5px;
        }

        .location-name:hover {
          text-decoration: underline;
        }

        .exact-location-panel {
          position: absolute;
          right: 0;
          top: 0;
          background: white;
          padding: 20px;
          height: 100%;
          width: 300px;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .favorite-button {
          margin-top: 40px;
          padding: 8px 12px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .location-title {
          font-size: 1.5rem;
          margin-top: 20px;
          color: #333;
        }

        .events-count {
          margin-top: 10px;
          font-size: 1rem;
          color: #666;
        }

        .comments-section {
          margin-top: 20px;
          color: #333;
        }

        .comments-container {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
          padding: 10px;
          margin-top: 10px;
        }

        .comment {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .comment-input {
          margin-top: 20px;
          display: flex;
        }

        .comment-input input {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
        }

        .comment-input button {
          padding: 8px 12px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .exact-location-panel {
            width: 100%;
            height: 50%;
            top: auto;
            bottom: 0;
          }

          .google-map {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}
