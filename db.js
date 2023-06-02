const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://ibrahimfarhat2018:ibrahim@cluster0.g8o5npv.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to db");
  })
  .catch((error) => {
    console.error(error);
  });
