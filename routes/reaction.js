const User = require("../models/User");
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
    console.log(emojis);
    const data = await Promise.all(
      emojis.map(async (item) => {
        const user = await User.findById(item.creatorId);
        console.log(user);
        if (user) {
          return {
            user: user,
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
  const user = await User.findById(creatorId);
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
