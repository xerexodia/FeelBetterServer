const mongoose = require("mongoose");
const reactionSchema = mongoose.Schema({
  reaction: {
    type: String,
    enum: ["like", "love", "wow", "lol"],
    default: null,
  },

  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
