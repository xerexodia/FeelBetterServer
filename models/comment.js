const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    contenu: {
      type: String,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestaamp: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
