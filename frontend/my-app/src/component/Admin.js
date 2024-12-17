import { useState } from "react";
import CreateEvent from "./adminComponent/CreateEvent";
import CreateUser from "./adminComponent/CreateUser";
import UpdateEvent from "./adminComponent/UpdateEvent";
import UpdateUser from "./adminComponent/UpdateUser";
import { useEventStore } from "../customHook/useEventStore";

export default function Admin() {
  const { lightMode } = useEventStore();
  const [currentAction, setCurrentAction] = useState(null);

  return (
    <div className="admin-container">
      <h1 className="admin-title" style={{ color: lightMode ? "black" : "white" }}>
        Admin Panel
      </h1>
      <div className="admin-actions">
        <button className="admin-action-button" onClick={() => setCurrentAction("createUser")}>
          Create User
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("updateUser")}>
          Update/Delete User
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("createEvent")}>
          Create Event
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("updateEvent")}>
          Update/Delete Event
        </button>
      </div>

      <div className="admin-content">
        {currentAction === "createUser" && <CreateUser />}
        {currentAction === "updateUser" && <UpdateUser />}
        {currentAction === "createEvent" && <CreateEvent />}
        {currentAction === "updateEvent" && <UpdateEvent />}
        {!currentAction && <p className="admin-placeholder">Select an action from the buttons above</p>}
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 10px;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .admin-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 2rem;
          text-align: center;
        }

        .admin-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .admin-action-button {
          padding: 1rem;
          font-size: 1rem;
          color: #fff;
          background-color: #3498db;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          flex: 1 1 200px;
          max-width: 250px;
        }

        .admin-action-button:hover {
          background-color: #2980b9;
        }

        .admin-content {
          width: auto;
          border-radius: 8px;
          padding: 2rem;
        }

        .admin-placeholder {
          color: #777;
          font-style: italic;
          text-align: center;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .admin-title {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }

          .admin-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-action-button {
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .admin-title {
            font-size: 1.75rem;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
