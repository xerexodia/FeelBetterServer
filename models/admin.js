const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  login: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
