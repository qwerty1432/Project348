// client/src/App.js
import React, { useState } from "react";
import UserManagement from "./UserManagement";
import TripReport from "./TripReport";
import ActivityReport from "./ActivityReport";

function App() {
  const [view, setView] = useState("users");

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light my-4">
        <span className="navbar-brand">Travel Itinerary Planner</span>
        <div className="navbar-nav">
          <button className="nav-item nav-link btn btn-link" onClick={() => setView("users")}>
            User Management
          </button>
          <button className="nav-item nav-link btn btn-link" onClick={() => setView("tripReport")}>
            Trip Report
          </button>
          <button className="nav-item nav-link btn btn-link" onClick={() => setView("activityReport")}>
            Activity Report
          </button>
        </div>
      </nav>
      {view === "users" && <UserManagement />}
      {view === "tripReport" && <TripReport />}
      {view === "activityReport" && <ActivityReport />}
    </div>
  );
}

export default App;
