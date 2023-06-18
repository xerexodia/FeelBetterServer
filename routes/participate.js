const express = require("express");
const router = express.Router();
const multer = require("multer");
const Participate = require("../models/participateChallenge");
const FILE_TAP_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fielname = "userCredentials";
    const extension = FILE_TAP_MAP[file.mimetype];
    cb(null, `${fielname}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

router.post("/participate", uploadOptions.single("image"), async (req, res) => {
  try {
    const image = req.file;
    const fileName = image?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const data = await new Participate({
      image: `${basePath}${fileName}`,
      ...req.body,
    }).save();
    res.send("success");
  } catch (error) {
    console.log(error);
  }
});

router.get("/participate", async (req, res) => {
  try {
    const data = await Participate.find().populate("challengeId");
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
