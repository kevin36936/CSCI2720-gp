import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import {
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faTicketAlt,
  faLanguage,
  faClock as faRuntime,
  faExclamationTriangle,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export default function EventPage() {
  const { eventData } = useEventStore();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEvent(eventData.find((event) => event.id === eventId));
    const loadingTimeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(loadingTimeout);
  }, [eventId, eventData]);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-12">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  //   if (!event && !isLoading) {
  //     return (
  //       <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
  //         <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-12">
  //           <div className="p-8">
  //             <h1 className="text-3xl font-bold text-gray-900 mb-4">
  //               Event not found
  //             </h1>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="eventid-container">
      <div className="eventid-content">
        <h1 className="eventid-title">{event?.title}</h1>

        <div className="eventid-detail-section">
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faCalendar} className="eventid-detail-icon" />
            <span>{event?.dateTime}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faClock} className="eventid-detail-icon" />
            <span>{event?.programTime}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="eventid-detail-icon" />
            <span>{event?.venue}</span>
          </div>
        </div>

        <div className="eventid-detail-section">
          <h2 className="eventid-detail-header">Movie Details</h2>
          <p className="eventid-textColor">{event?.presenter}</p>
        </div>

        <div className="eventid-detail-section">
          <h2 className="eventid-detail-header">Description</h2>
          <p className="eventid-textColor">{event?.description}</p>
        </div>

        <div className="eventid-grid">
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faExclamationTriangle} className="eventid-detail-icon" />
            <span>Age Limit: {event?.ageLimit || "N/A"}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faTicketAlt} className="eventid-detail-icon" />
            <span>Price: {event?.price}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faLanguage} className="eventid-detail-icon" />
            <span>{event?.remarks || "N/A"}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faRuntime} className="eventid-detail-icon" />
            <span>Runtime: {event?.programTime}</span>
          </div>
        </div>

        <div className="eventid-space-y-2">
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faCalendar} className="eventid-detail-icon" />
            <span>Sale Date: {event?.saleDate}</span>
          </div>
          <div className="eventid-detail">
            <FontAwesomeIcon icon={faCalendar} className="eventid-detail-icon" />
            <span>Submit Date: {event?.submitDate}</span>
          </div>
          <div className="eventid-ticket-link">
            <FontAwesomeIcon icon={faLink} className="eventid-detail-icon" />
            <a href={event?.tagentUrl} target="_blank" rel="noopener noreferrer">
              Ticket Purchase
            </a>
          </div>
          <div className="eventid-ticket-link">
            <FontAwesomeIcon icon={faLink} className="eventid-detail-icon" />
            <a href={event?.url} target="_blank" rel="noopener noreferrer">
              Event Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
