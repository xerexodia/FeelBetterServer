const express = require("express");
const router = express.Router();

const User = require("../models/User");
const UserPro = require("../models/UserPro");
const multer = require("multer");

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

// update user credentials
router.patch(
  "/update/user/:id",
  uploadOptions.single("image"),
  async (req, res) => {
    const image = req.file;
    const fileName = image?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    try {
      const newUser = await User.findByIdAndUpdate(
        req.params.id,
        { image: `${basePath}${fileName}`, ...req.body },
        {
          new: true,
        }
      );
      res.send({
        msg: "credentials updated successfully",
        status: "success",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
// updte userPro creddentials
router.patch(
  "/update/userPro/:id",
  uploadOptions.single("image"),
  async (req, res) => {
    const image = req.file;
    const fileName = image?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    try {
      const newUser = await UserPro.findByIdAndUpdate(
        req.params.id,
        { image: `${basePath}${fileName}`, ...req.body },
        {
          new: true,
        }
      );
      res.send({
        msg: "credentials updated successfully",
        status: "success",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
    }
    console.log("qsd");
  }
);

module.exports = router;
