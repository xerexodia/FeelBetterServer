const express = require("express");
const Mood = require("../models/mood");
const User = require("../models/User");
const router = express.Router();
//statistique
router.post("/getSate", async (req, res) => {
  const curr = new Date();
  const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
  const { name } = req.body;
  const user = await User.find({ name });
  const mood = await Mood.find({
    creatorId: user[0]._id,
    createdAt: { $gte: firstday, $lt: lastday },
  });
  res.send({
    status: "success",
    msg: "data fetched successfully",
    data: mood,
  });
});

module.exports = router;
