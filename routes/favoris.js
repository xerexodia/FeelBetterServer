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
  if (favoris) {
    await Favoris.findByIdAndDelete(favoris[0]._id);
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

router.get("/favoris/:id", async (req, res) => {
  const favoris = await Favoris.find({ creatorId: req.params.id });
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

module.exports = router;
