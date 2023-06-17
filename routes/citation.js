const express = require("express");
const Citation = require("../models/Citation");
const router = express.Router();
const multer = require("multer");
const UserPro = require("../models/UserPro");

const FILE_TAP_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fielname = "citationImage";
    const extension = FILE_TAP_MAP[file.mimetype];
    cb(null, `${fielname}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// adding citation
router.post("/citation", uploadOptions.single("image"), async (req, res) => {
  const image = req.file;
  const fileName = image?.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    const user = await UserPro.findById(req.body.creatorId);
    const citation = await new Citation({
      image: `${basePath}${fileName}`,
      ...req.body,
    })
      .save()
      .then((t) => t.populate("creatorId"));

    if (citation) {
      res.send({
        msg: "citation created successfullly",
        data: citation,
        status: "success",
      });
    } else {
      res.send({
        msg: "something went wrong",
        status: "failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// getting all citations
router.get("/citation", async (req, res) => {
  const citations = await Citation.find().populate("creatorId");
  if (citations) {
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data: citations,
    });
  } else {
    res.send({
      status: "failed",
      msg: "something went wrong",
    });
  }
});
// getting all citations by userId
router.get("/citation/user/:id", async (req, res) => {
  const citations = await Citation.find({ creatorId: req.params.id });
  if (citations) {
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data: citations,
    });
  } else {
    res.send({
      status: "failed",
      msg: "something went wrong",
    });
  }
});

// delete citation
router.delete("citation/:id", async (req, res) => {
  try {
    const citation = Citation.findById(req.params.id);
    if (citation) {
      await Citation.findByIdAndDelete(req.params.id);
      res.send({
        status: "success",
        msg: "citation deleted successfully",
      });
    } else {
      res.send({
        status: "failed",
        msg: "no data found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
