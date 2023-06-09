const express = require("express");
const Comment = require("../models/comment");
const User = require("../models/User");
const UserPro = require("../models/UserPro");
const router = express.Router();

// add comment
router.post("/comment", async (req, res) => {
  try {
    const comment = await new Comment(req.body).save();
    let users = {};
    const user = await User.findById(comment.creatorId);
    const userPro = await UserPro.findById(comment.creatorId);
    if (user) {
      users = user;
    }
    if (userPro) {
      users = userPro;
    }
    if (comment) {
      res.send({
        status: "success",
        msg: "comment added successfully",
        data: { comment, user: users },
      });
    } else {
      res.send({
        status: "failed",
        msg: "failed to add comment",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get post comments
router.get("/comment/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    if (comments.length > 0) {
      const data = await Promise.all(
        comments.map(async (item) => {
          const user = await User.findById(item.creatorId);
          const userPro = await UserPro.findById(item.creatorId);
          if (user) {
            return {
              comment: item,
              user,
            };
          }
          if (userPro) {
            return {
              comment: item,
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
        msg: "No comments found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// delete comment
router.delete("/comment/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment) {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.send({
        status: "success",
        msg: "comment deleted successfully",
      });
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

module.exports = router;
