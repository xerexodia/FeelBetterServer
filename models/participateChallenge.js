const mongoose = require("mongoose");
const participateSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "challenge",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Participate = mongoose.model("participate", participateSchema);

module.exports = Participate;
