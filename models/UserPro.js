const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    type: String,
  },
  role: {
    type: String,
    default: "userPro",
  },
});

userProSchema.pre("save", async function (next) {
  const UserPro = this;
  console.log("Just Before saving  before hashing ", UserPro.password);
  if (!UserPro.isModified("password")) {
    return next();
  }
  UserPro.password = await bcrypt.hash(UserPro.password, 8);
  console.log("Just Before saving after hashing ", UserPro.password);
  next();
});
const UserPro = mongoose.model("UserPro", userProSchema);

module.exports = UserPro;
