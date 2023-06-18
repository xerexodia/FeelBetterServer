const mongoose = require("mongoose");
const favorisSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    citationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citation",
    },
  },
  { timestamps: true }
);

const Favoris = mongoose.model("Favoris", favorisSchema);

module.exports = Favoris;
