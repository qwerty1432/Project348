// client/src/ActivityReport.js
import React, { useState, useEffect } from "react";

function ActivityReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityNames, setActivityNames] = useState([]);
  const [report, setReport] = useState(null);

  // Fetch distinct activity names from the backend
  useEffect(() => {
    async function fetchActivityNames() {
      try {
        const res = await fetch("http://localhost:5001/api/reports/activity-names");
        const data = await res.json();
        setActivityNames(data);
      } catch (error) {
        console.error("Error fetching activity names:", error);
      }
    }
    fetchActivityNames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (selectedActivity) params.append("name", selectedActivity); // key "name" matches the field in the schema
    try {
      const res = await fetch(`http://localhost:5001/api/reports/activities?${params.toString()}`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching activity report:", error);
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h1 className="mb-3">Activity Report</h1>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Activity Name:</label>
            <select
              className="form-control"
              style={{
                minWidth: "300px",
                width: "100%",
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "clip"
              }}
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              <option value="">Select an activity</option>
              {activityNames.map((act, index) => (
                <option key={index} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Generate Activity Report</button>
        </form>
        {report && report.length > 0 ? (
          <div>
            <h2>Report Results:</h2>
            <ul className="list-group">
              {report.map((item) => (
                <li key={item._id} className="list-group-item">
                  <strong>{item.name}</strong><br />
                  Description: {item.description}<br />
                  Date: {new Date(item.date).toLocaleDateString()}<br />
                  Time: {item.time}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No activity report data available.</p>
        )}
      </div>
    </div>
  );
}

export default ActivityReport;
