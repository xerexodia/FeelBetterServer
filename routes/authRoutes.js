const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserPro = mongoose.model("UserPro");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//
require("dotenv").config();
//
const bcrypt = require("bcrypt");
//Nodemailer
async function mailer(receiveremail, code) {
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "appfeelbetter@hotmail.com",
      pass: "000000feel", // generated ethereal password
    },
  });
  const mailOptions = {
    from: "appfeelbetter@hotmail.com",
    to: `${receiveremail}`, // list of receivers
    subject: "verification code", // Subject line
    html: `<b> Your verification code is ${code} </b>`,
  };
  transporter.sendMail(mailOptions, function (err) {
    if (err) console.log(err);
    else console.log("email has sand ");
  });
}

router.post("/Signup", async (req, res) => {
  //console.log(req.body);
  const { name, email, age, password } = req.body;

  const user = new User({
    name,
    email,
    age,
    password,
  });

  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({
      status: "success",
      msg: "user Registerd Successfully ",
      token,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/Verify", async (req, res) => {
  const { name, email, age, password } = req.body;
  const savedUser = await User.findOne({ email: email });
  if (savedUser) {
    console.log(savedUser);
    return res.status(422).send({ status: "failed", msg: "you have account " });
  }
  try {
    let VerificationCode = Math.floor(1000000 + Math.random() * 9000000);
    let user = [
      {
        name,
        email,
        age,
        password,
        VerificationCode,
      },
    ];
    await mailer(email, VerificationCode);
    res.send({
      status: "success",
      msg: "verfication code sent to your Email",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or pasword " });
  }
  const savedUser = await User.findOne({ email: email });
  if (!savedUser) {
    return res.status(422).json({ error: "Invalid " });
  }
  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("pasword match");
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token, data: savedUser });
      } else {
        console.log("password does not match ");
        return res.status(422).json({ error: "Invalid " });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
// admin login
router.post("/admin", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  let a = req.body.data;
  try {
    //const ch = await challenge.find();
    //const s = await admin.create(mode);
    const data = await admin.find({ login: a.login });
    if (a.password == "admin123") {
      res.json(true);
    } else res.json(false);
    console.log(data);

    //res.json(s);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
