const express = require("express");
const Favoris = require("../models/favoris");
const User = require("../models/User");
const router = express.Router();

// add favoris

router.post("/favoris", async (req, res) => {
  const favoris = await Favoris.find({
    creatorId: req.body.creatorId,
    citationId: req.body.citationId,
  });
  if (favoris.length > 0) {
    await Favoris.findByIdAndDelete(favoris[favoris.length - 1]._id);
    res.send({
      status: "success",
      msg: "citaion deleted from your favoris",
    });
  } else {
    await new Favoris(req.body).save();
    res.send({
      status: "success",
      msg: "citation added to ur favorites",
    });
  }
});
//
router.get("/favoris/:id", async (req, res) => {
  const favoris = await Favoris.find({ creatorId: req.params.id }).populate(
    "citationId"
  );
  if (favoris.length > 0) {
    res.send({
      status: "success",
      msg: "data fetched succesfully",
      data: favoris,
    });
  } else {
    res.send({
      status: "success",
      msg: "u haven't favoris yet",
    });
  }
});
//
router.get("/favoris/:id/:postId", async (req, res) => {
  const favoris = await Favoris.find({
    creatorId: req.params.id,
    citationId: req.params.postId,
  });
  if (favoris.length > 0) {
    res.send({
      status: "success",
      msg: "data fetched succesfully",
      data: favoris[0],
    });
  } else {
    res.send({
      status: "success",
      msg: "u haven't favoris yet",
    });
  }
});
router.delete("/favoris/:id", async (req, res) => {
  try {
    await Favoris.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
