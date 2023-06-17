const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
