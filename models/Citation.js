const mongoose = require("mongoose");
const citationSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPro",
    },
  },
  { timestamp: true }
);

const Citation = mongoose.model("Citation", citationSchema);

module.exports = Citation;
