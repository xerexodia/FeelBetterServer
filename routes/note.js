const express = require("express");
const Note = require("../models/note");
const router = express.Router();

router.post("/note", async (req, res) => {
  try {
    const note = await new Note(req.body).save();
    res.send({
      data: note,
      msg: "note created successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/note/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ creatorId: req.params.userId }).populate(
      "creatorId"
    );
    res.send({
      data: notes,
      msg: "data fetched successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
router.patch("/note/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("creatorId");
    res.send({
      data: note,
      msg: "data fetched successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
router.delete("/note/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.send({
      msg: "data fetched successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
