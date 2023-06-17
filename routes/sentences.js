const express = require("express");
const sentence_seggestions = require("../models/sentence");
const router = express.Router();

//   admin to get all sentences
router.get("/sentenceAll", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  try {
    const data = await sentence_seggestions.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//   post a sentence
router.post("/sentenceAdd", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  let data1 = req.body.data;
  try {
    const data = await sentence_seggestions.create(data1);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//delete
router.delete("/sentence/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const { id } = req.params;
  try {
    const data = await sentence_seggestions.findByIdAndDelete(id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// users to get entences
router.get("/sentences", async (req, res) => {
  const sentences = await sentence_seggestions.find();
  const numRandom = getRandom();
  const randomSentence = sentences[numRandom];
  res.send({
    status: "success",
    msg: "data fetched successfully",
    data: randomSentence,
  });
});
