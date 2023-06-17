const express = require("express");
const router = express.Router();
const challenge = require("../models/challange");
const Mood = require("../models/mood");

// add challenge
router.post("/ChallangeAdd", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  let data1 = req.body.data;
  try {
    const data = await challenge.create(data1);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all challenges
router.get("/challengeAll", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  try {
    const data = await challenge.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// update challenge
router.put("/challangeUpdate/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  console.log(req.body);
  try {
    const { id } = req.params;

    const cha = await challenge.findByIdAndUpdate(id, req.body.data);

    if (!cha) {
      return res
        .status(404)
        .json({ message: `cannot find any challange with ID ${id}` });
    }
    console.log("succes");
    const updatedchallange = await challenge.findById(id);
    res.status(200).json(updatedchallange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete challenege
router.delete("/ChallangeDelete/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const { id } = req.params;
  try {
    const data = await challenge.findOneAndDelete({ _id: id });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get challenge by mood of user
router.get("/challenge/:userId", async (req, res) => {
  const id = req.params.userId;
  const date = new Date();
  const endDate = subtractSeconds(date, 1000);
  try {
    const mood = await Mood.find({
      creatorId: id,
      createdAt: { $gte: date, $lt: endDate },
    });
    if (mood) {
      const challenge = await challenge.find({ mode: mood[0]?.title });
      const num = getRandom(challenge.length);
      const randomchallenge = challenge[num];

      res.send({
        status: "success",
        msg: "data fetched successfully",
        data: randomchallenge,
      });
    } else {
      res.send({
        status: "success",
        msg: "u have not pickcked a mood yet",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
