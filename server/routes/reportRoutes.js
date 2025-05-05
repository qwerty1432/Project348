// server/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");       // Your Trip model
const Activity = require("../models/Activities"); // Your Activity model (named Activities)

// GET /api/reports/trips?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&destination=...&activity=...
router.get("/trips", async (req, res) => {
  const { startDate, endDate, destination, activity } = req.query;
  try {
    // Build the match stage for filtering trips
    const match = {};
    if (startDate || endDate) {
      match.start_date = {};
      if (startDate) {
        match.start_date.$gte = new Date(startDate);
      }
      if (endDate) {
        match.start_date.$lte = new Date(endDate);
      }
    }
    if (destination) {
      match.destination = { $regex: destination, $options: "i" };
    }
    
    const pipeline = [];
    if (Object.keys(match).length) {
      pipeline.push({ $match: match });
    }
    
    // If an activity filter is provided, join activities and filter by activity name
    if (activity) {
      pipeline.push({
        $lookup: {
          from: "activities", // Ensure this matches your collection name
          localField: "_id",
          foreignField: "trip_id",
          as: "activities"
        }
      });
      pipeline.push({
        $match: {
          "activities.name": { $regex: activity, $options: "i" }
        }
      });
    }
    
    // Compute durationDays for each trip
    pipeline.push({
      $addFields: {
        durationDays: {
          $divide: [
            { $subtract: ["$end_date", "$start_date"] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    });
    
    // Optionally, sort by start_date
    pipeline.push({ $sort: { start_date: 1 } });
    
    // Return full details for each matching trip
    const trips = await Trip.aggregate(pipeline);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/activities?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&name=...
router.get("/activities", async (req, res) => {
  const { startDate, endDate, name } = req.query;
  try {
    const match = {};
    if (startDate || endDate) {
      match.date = {};
      if (startDate) {
        match.date.$gte = new Date(startDate);
      }
      if (endDate) {
        match.date.$lte = new Date(endDate);
      }
    }
    if (name) {
      match.name = { $regex: name, $options: "i" };
    }
    // Return all matching activity documents with full details
    const activities = await Activity.find(match).sort({ date: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint: GET distinct trip destinations (for dropdown)
router.get("/trip-destinations", async (req, res) => {
  try {
    const destinations = await Trip.distinct("destination");
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint: GET distinct activity names (for dropdown)
router.get("/activity-names", async (req, res) => {
  try {
    const names = await Activity.distinct("name");
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
