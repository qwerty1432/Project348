// server/routes/activityRoutes.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activities");

// CREATE a new activity
router.post("/", async (req, res) => {
  try {
    const { trip_id, name, description, date, time } = req.body;
    const newActivity = new Activity({ trip_id, name, description, date, time });
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single activity by ID
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an activity by ID
router.put("/:id", async (req, res) => {
  try {
    const { trip_id, name, description, date, time } = req.body;
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { trip_id, name, description, date, time },
      { new: true }
    );
    if (!updatedActivity) return res.status(404).json({ error: "Activity not found" });
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an activity by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) return res.status(404).json({ error: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
