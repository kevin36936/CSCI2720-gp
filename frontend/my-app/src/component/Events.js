import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapMarkerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { useEventStore } from "../customHook/useEventStore";

export default function Events() {
  const { eventData } = useEventStore();

  const [visibleEvents, setVisibleEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const eventsPerPage = 30; // Number of events to show per page
  const observer = useRef();

  useEffect(() => {
    // Load the initial events
    setVisibleEvents(eventData.slice(0, eventsPerPage));
  }, [eventData]);

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

  return (
    <div className="container">
      <h1 className="title">Events Page</h1>
      <p className="subtitle">Number of events: {eventData.length}</p>
      <div className="event-grid">
        {visibleEvents.map((event, index) => (
          <div
            key={index}
            className="event-card"
            onClick={() => (window.location.href = `/events/${event.id}`)}
          >
            <div className="event-card-inner">
              <div className="event-card-inner2">
                <h2 className="event-title">{event.title}</h2>
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
