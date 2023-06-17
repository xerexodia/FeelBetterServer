const express = require("express");
const Mood = require("../models/mood");
const challenge = require("../models/challange");
const getRandom = require("../utils/helpers");
const router = express.Router();

// add mood
router.post("/mood", async (req, res) => {
  const { title, creatorId } = req.body;
  try {
    const mood = await new Mood({ title, creatorId }).save();
    res.send({
      status: "success",
      msg: "u picked a mood",
      data: mood,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
