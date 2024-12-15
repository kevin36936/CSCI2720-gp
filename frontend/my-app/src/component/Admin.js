import { useState } from "react";
import CreateEvent from "./adminComponent/CreateEvent";
import CreateUser from "./adminComponent/CreateUser";
import UpdateEvent from "./adminComponent/UpdateEvent";
import UpdateUser from "./adminComponent/UpdateUser";

export default function Admin() {
  const [currentAction, setCurrentAction] = useState(null);

  return (
    <div className="admin-container">
      <div className="admin-actions">
        <button className="admin-action-button" onClick={() => setCurrentAction("createUser")}>
          Create user
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("updateUser")}>
          Update/Delete user
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("createEvent")}>
          Create event
        </button>
        <button className="admin-action-button" onClick={() => setCurrentAction("updateEvent")}>
          Update/Delete event
        </button>
      </div>

      <div className="admin-content">
        {currentAction === "createUser" && <CreateUser />}
        {currentAction === "updateUser" && <UpdateUser />}
        {currentAction === "createEvent" && <CreateEvent />}
        {currentAction === "updateEvent" && <UpdateEvent />}
      </div>
    </div>
  );
}
