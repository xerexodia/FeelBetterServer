const mongoose = require("mongoose");
const userProSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },

  age: {
    type: Number,
  },

  password: {
    type: String,
  },
  job: { type: String },

  adress: {
    type: String,
  },

  file: {
    data: Buffer,
    contentType: String,
  },
});

const UserPro = mongoose.model("UserPro", userProSchema);

module.exports = UserPro;
