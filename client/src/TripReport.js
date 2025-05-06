// client/src/TripReport.js
import React, { useState, useEffect } from "react";

function TripReport() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [activityFilter, setActivityFilter] = useState("");
  const [report, setReport] = useState(null);

  // Fetch distinct destinations for the dropdown
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch(`${API}/api/reports/trip-destinations`);
        const data = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    }
    fetchDestinations();
  }, [API]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (startDate)           params.append("startDate", startDate);
    if (endDate)             params.append("endDate", endDate);
    if (selectedDestination) params.append("destination", selectedDestination);
    if (activityFilter)      params.append("activity", activityFilter);

    try {
      const res = await fetch(`${API}/api/reports/trips?${params.toString()}`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching trip report:", error);
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h1 className="mb-3">Trip Report</h1>
        <form onSubmit={handleReportSubmit} className="mb-3">
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
            <label>Destination:</label>
            <select
              className="form-control"
              style={{
                minWidth: "300px",
                width: "100%",
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "clip"
              }}
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="">Select a destination</option>
              {destinations.map((dest, idx) => (
                <option key={idx} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Activity Filter (Optional):</label>
            <input
              type="text"
              className="form-control"
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              placeholder="Enter activity name"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Generate Report
          </button>
        </form>

        {report && report.length > 0 ? (
          <div>
            <h2>Report Results:</h2>
            <ul className="list-group">
              {report.map((trip) => (
                <li key={trip._id} className="list-group-item">
                  <h4>{trip.title}</h4>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p><strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(trip.end_date).toLocaleDateString()}</p>
                  <p><strong>Duration:</strong> {trip.durationDays?.toFixed(2) || "N/A"} days</p>
                  {trip.activities?.length > 0 && (
                    <div>
                      <strong>Activities:</strong>
                      <ul>
                        {trip.activities.map((act) => (
                          <li key={act._id}>
                            {act.name} — {act.description} on {new Date(act.date).toLocaleDateString()} at {act.time}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No report data available.</p>
        )}
      </div>
    </div>
  );
}

export default TripReport;
