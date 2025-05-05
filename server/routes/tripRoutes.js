// server/routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// CREATE a new trip
router.post("/", async (req, res) => {
  try {
    const { title, destination, startDate, endDate } = req.body;
    const newTrip = new Trip({ title, destination, startDate, endDate });
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single trip by ID
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a trip by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, destination, startDate, endDate } = req.body;
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { title, destination, startDate, endDate },
      { new: true }
    );
    if (!updatedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a trip by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
