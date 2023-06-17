const User = require("../models/User");
const UserPro = require("../models/UserPro");
const Reaction = require("../models/reaction");

const express = require("express");
const router = express.Router();

const REACTIONS = {
  like: "like",
  love: "love",
  wow: "wow",
  lol: "lol",
};
//get by post
router.get("/reaction/:postId", async (req, res) => {
  try {
    const emojis = await Reaction.find({ postId: req.params.postId });
    const data = await Promise.all(
      emojis.map(async (item) => {
        const user = await User.findById(item.creatorId);
        const userPro = await UserPro.findById(item.creatorId);
        if (user) {
          return {
            user: user,
            reaction: item,
          };
        }
        if (userPro) {
          return {
            user: userPro,
            reaction: item,
          };
        }
      })
    );
    res.send({
      status: "success",
      msg: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/reaction/:postId/:creatorId", async (req, res) => {
  const postId = req.params.postId;
  const creatorId = req.params.creatorId;
  const { reaction } = req.body;
  const userReaction = await Reaction.findOne({ creatorId, postId });
  const users = await User.findById(creatorId);
  const userPro = await UserPro.findById(creatorId);
  let user = {};
  if (users) {
    user = users;
  }
  if (userPro) {
    user = userPro;
  }
  if (userReaction) {
    if (userReaction.reaction === reaction) {
      return await Reaction.findByIdAndDelete(userReaction._id);
    }
    if (user.reaction !== reaction) {
      const react = await Reaction.findByIdAndUpdate(
        userReaction._id,
        { reaction },
        { new: true }
      );
      res.send({
        status: "success",
        msg: "reaction updated successfully",
        data: {
          user,
          reaction: react,
        },
      });
      return;
    }
  } else {
    const react = await new Reaction({ postId, creatorId, reaction }).save();
    res.send({
      status: "success",
      msg: "reaction created successfully",
      data: {
        user,
        reaction: react,
      },
    });
    return;
  }
});

module.exports = router;
