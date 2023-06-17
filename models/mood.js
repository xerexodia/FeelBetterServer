const mongoose = require("mongoose");
const moodSchema = mongoose.Schema(
  {
    iamge: {
      type: String,
    },
    title: {
      type: String,
      enum: [
        "Really Sad",
        "Super Awesome",
        "Pretty Good",
        "I'm Okay",
        "Somewhat Bad",
      ],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
