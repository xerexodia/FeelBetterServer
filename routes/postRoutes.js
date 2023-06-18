const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const UserPro = require("../models/UserPro");
const router = express.Router();
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
    const fielname = "postImage";
    const extension = FILE_TAP_MAP[file.mimetype];
    cb(null, `${fielname}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// adding post
router.post("/post", uploadOptions.single("image"), async (req, res) => {
  const image = req.file;
  const fileName = image?.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    const post = await new Post({
      image: `${basePath}${fileName}`,
      ...req.body,
    }).save();
    if (post) {
      res.send({
        msg: "post created successfullly",
        data: post,
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

// getting all posts
router.get("/post", async (req, res) => {
  const posts = await Post.find();
  if (posts) {
    console.log(posts);
    const data = await Promise.all(
      posts.map(async (item) => {
        const user = await User.findById(item.userId);
        const userPro = await UserPro.findById(item.userId);
        if (user) {
          return {
            post: item,
            user: user,
          };
        }
        if (userPro) {
          return {
            post: item,
            user: userPro,
          };
        }
      })
    );
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data: data,
    });
  } else {
    res.send({
      status: "failed",
      msg: "something went wrong",
    });
  }
});
// getting all posts by userId
router.get("/post/user/:id", async (req, res) => {
  const posts = await Post.find({ userId: req.params.id });
  if (posts) {
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data: posts,
    });
  } else {
    res.send({
      status: "failed",
      msg: "something went wrong",
    });
  }
});

// gettting posts by user id
router.get("post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      const posts = await Post.find({ userId: id });
      if (posts.length > 0) {
        res.send({
          status: "success",
          msg: "data fetched successfully",
          data: {
            posts: posts,
            user: user,
          },
        });
      } else {
        res.send({
          status: "success",
          msg: "you have not posted any thing yet",
        });
      }
    } else {
      res.send({
        status: "failed",
        msg: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// delete post
router.delete("post/:id", async (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (post) {
      await Post.findByIdAndDelete(req.params.id);
      res.send({
        status: "success",
        msg: "post deleted successfully",
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

//l'enregistrement des images et des fichiers local dans le serveur BF URl
//
