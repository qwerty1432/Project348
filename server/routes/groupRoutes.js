// server/routes/groupMemberRoutes.js
const express = require("express");
const router = express.Router();
const GroupMember = require("../models/GroupMember");

// CREATE a new group member
router.post("/", async (req, res) => {
  try {
    const { trip_id, user_id, assigned_task } = req.body;
    const newGroupMember = new GroupMember({ trip_id, user_id, assigned_task });
    const savedMember = await newGroupMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all group members
router.get("/", async (req, res) => {
  try {
    const groupMembers = await GroupMember.find();
    res.json(groupMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optionally: Get group members for a specific trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const members = await GroupMember.find({ trip_id: req.params.tripId });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a group member by ID
router.put("/:id", async (req, res) => {
  try {
    const { trip_id, user_id, assigned_task } = req.body;
    const updatedMember = await GroupMember.findByIdAndUpdate(
      req.params.id,
      { trip_id, user_id, assigned_task },
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ error: "Group member not found" });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a group member by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await GroupMember.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ error: "Group member not found" });
    res.json({ message: "Group member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
