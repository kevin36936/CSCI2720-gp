import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";

export default function Map() {
  const { locationData } = useEventStore();

  const [localLocationData, setLocalLocationData] = useState([]);

  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 22.3964, lng: 114.1095 });
  const [shownLocations, setShownLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Track selected marker
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

  // Filter and show top 10 locations
  useEffect(() => {
    const filteredLocations = localLocationData
      .filter((location) => location.count > 3 && location.latitude)
      .slice(0, 10);
    setShownLocations(filteredLocations);
  }, [localLocationData]);

  // Open InfoWindow when a marker is clicked
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
        const commentArray = [...location.comment];
        commentArray.push({ username: username, comment: comment });
        if (location.id === exactLocation.id) {
          return { ...location, comment: commentArray };
        }
        return location;
      });
      return updatedLocationData;
    });

    setExactLocation((prevLocation) => ({
      ...prevLocation,
      comment: [
        ...prevLocation.comment,
        { username: username, comment: comment },
      ],
    }));
    setComment("");
    const response = await fetch("http://localhost:4001/updateLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: exactLocation.id,
        username: username,
        comment: comment,
      }),
    });
    const result = await response.json();
    console.log(result.message);
  };

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>Interactive Map</h1>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: "100%", height: "90vh" }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Render markers */}
        {shownLocations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={() =>
              handleMarkerClick({
                latitude: location.latitude,
                longitude: location.longitude,
              })
            } // Open InfoWindow on click
          />
        ))}

        {/* InfoWindow */}
        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation[0].latitude,
              lng: selectedLocation[0].longitude,
            }}
            onCloseClick={() => setSelectedLocation(null) || setZoom(12)} // Close on click
          >
            <div
              style={{ background: "white", padding: "10px", color: "black" }}
            >
              {selectedLocation.map((location) => (
                <div key={location.name}>
                  <h3
                    onClick={() => handleExactLocationClick(location)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {location.name}
                  </h3>
                  <p>Events Count: {location.count}</p>
                </div>
              ))}
            </div>
          </InfoWindow>
        )}

        {/* Exact location */}
        {exactLocation && (
          <div>
            <Marker
              position={{
                lat: exactLocation.latitude,
                lng: exactLocation.longitude,
              }}
              onClick={() => handleExactLocationClick(exactLocation)} // Open InfoWindow on click
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                background: "white",
                padding: "10px",
                height: "100%",
                width: "25%",
                color: "black",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  color: "blue",
                  position: "absolute",
                  top: 10,
                  right: 20,
                  zIndex: 1,
                  fontSize: 40,
                }}
                onClick={() =>
                  setSelectedLocation(null) ||
                  setExactLocation(null) ||
                  setZoom(12)
                }
              >
                X
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold", marginTop: 50 }}>
                {exactLocation.name}
              </div>
              <div style={{ marginTop: 10, fontSize: 16 }}>
                Events Count: {exactLocation.count}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ marginTop: 10, fontSize: 40 }}>User comment</div>
                <div
                  style={{
                    border: "1px solid black",
                    padding: 10,
                    height: 200,
                    width: "80%",
                  }}
                >
                  {!exactLocation.comment[0]
                    ? "No comment"
                    : exactLocation.comment.map((comment, index) => {
                        return (
                          <div key={index}>
                            {comment.username}: {comment.comment}
                          </div>
                        );
                      })}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Comment"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCommentSubmit();
                      }
                    }}
                  />
                  <button onClick={() => handleCommentSubmit()}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </GoogleMap>
    </div>
  );
}
