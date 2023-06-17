const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  fname: {
    type: String,
    require: true,
  },

  lname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
