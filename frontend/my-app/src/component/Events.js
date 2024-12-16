import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapMarkerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { useEventStore } from "../customHook/useEventStore";

export default function Events() {
  const { eventData, locationData, lightMode } = useEventStore();

  const [visibleEvents, setVisibleEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likeStatus, setLikeStatus] = useState({});
  const eventsPerPage = 30; // Number of events to show per page
  const observer = useRef();

  useEffect(() => {
    const tenLocationData = locationData
      .filter((location) => location.count > 3 && location.latitude)
      .slice(0, 10);
    const filteredEventData = eventData.filter((event) =>
      tenLocationData.map((location) => location.id).includes(event.venueId)
    );
    // Load the initial events
    setVisibleEvents(filteredEventData.slice(0, eventsPerPage));
  }, [eventData, locationData]);

  useEffect(() => {
    const loadMoreEvents = (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true); // Set loading to true

        // Delay loading more events by 0.5 seconds
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setIsLoading(false); // Reset loading after events are fetched
        }, 500);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observerInstance = new IntersectionObserver(loadMoreEvents, options);
    if (observer.current) {
      observerInstance.observe(observer.current);
    }

    // Cleanup observer on unmount
    // return () => {
    //   if (observer.current) {
    //     observerInstance.unobserve(observer.current);
    //   }
    // };
  }, [isLoading]);

  useEffect(() => {
    const start = (page - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    setVisibleEvents(eventData.slice(0, end));
  }, [page, eventData]);

  const handleLike = async (id) => {
    if (likeStatus[id] && likeStatus[id].liked) {
      alert("You have already liked this event.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      setLikeStatus((prevStatus) => ({
        ...prevStatus,
        [id]: { liked: true, count: 1 },
      }));
      console.log(data);
    } catch (error) {
      console.error("Error during like:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title" style={{ color: lightMode ? "black" : "white" }}>
        Events Page
      </h1>
      <div className="event-grid">
        {visibleEvents.map((event, index) => (
          <div key={index} className="event-card">
            <div className="event-card-inner">
              <div className="event-card-inner2">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    zIndex: "1",
                  }}
                >
                  <div style={{ color: "black", marginRight: "10px" }}>
                    Like:{" "}
                    {Number(event.like) + likeStatus[event.id]?.count ||
                      event.like ||
                      0}
                  </div>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLike(event.id)}
                  >
                    like
                  </button>
                </div>
                <div style={{ color: "black", marginBottom: "10px" }}>
                  {event.id}
                </div>
                <h2
                  className="event-title"
                  onClick={() => (window.location.href = `/events/${event.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {event.title}
                </h2>
                <div className="event-details">
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faCalendar} className="icons" />
                    <span>{event.dateTime}</span>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faUsers} className="icons" />
                    <span>{event.presenter}</span>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icons" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Loading indicator */}
      {isLoading && (
        <div className="loading">
          <span>Loading more events...</span>
        </div>
      )}
      {/* Loading observer */}
      {!isLoading && <div ref={observer} className="loading-observer"></div>}
    </div>
  );
}
