const mongoose = require("mongoose");
const noteSchema = mongoose.Schema(
  {
    contenu: {
      type: String,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    color: {
      type: String,
    },
  },
  { timestaamp: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
