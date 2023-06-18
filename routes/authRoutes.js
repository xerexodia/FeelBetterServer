const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserPro = mongoose.model("UserPro");
const Admin = mongoose.model("Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");

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
// verify user
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
//verfiy pdf
const FILE_TAP_MAP = {
  "application/pdf": "pdf",
};

// PDF seulement
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/pdfs");
  },
  filename: function (req, file, cb) {
    const filename = "postFile";
    const extension = FILE_TAP_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

router.post("/Signup/pro", uploadOptions.single("file"), async (req, res) => {
  const pdf = req.file;
  const fileName = pdf?.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/pdfs`; //console.log(req.body);
  const { name, email, age, password, job, adress, file } = req.body;
  const userPro = new UserPro({
    name,
    email,
    age,
    job,
    adress,
    file,
    password,
  });

  try {
    const file = await new file({
      pdf: `${basePath}${fileName}`,
      ...req.body,
    });
    await userPro.save();
    const token = jwt.sign({ _id: userPro._id }, process.env.JWT_SECRET);
    res.send({
      status: "success",
      msg: "user Registerd Successfully ",
      token,
      data: userPro,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or pasword " });
  }
  const user = await User.findOne({ email: email });
  const userPro = await UserPro.findOne({ email: email });
  let savedUser;
  if (user) {
    savedUser = user;
  }
  if (userPro) {
    savedUser = userPro;
  }
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

//admin signup
router.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 8);
  try {
    const oldAdmin = await Admin.findOne({ email });
    if (oldAdmin) {
      return res.send({
        error: " admin Exists",
      });
    }
    await Admin.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({
      status: "success",
    });
  } catch (error) {
    res.send({
      status: "failed",
    });
  }
});

// admin login
router.post("/loginadmin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.send({ error: " admin not  found" });
  }
  if (await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "success", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  return res.json({ status: "error", error: "Invalid Password" });
});

//verif admin
router.post("/adminData", async (req, res) => {
  const { token } = req.body;
  try {
    const admin = jwt.verify(token, process.env.JWT_SECRET);
    console.log(admin);
    const adminemail = admin.email;
    Admin.findOne({ email: adminemail })
      .then((data) => {
        return res.send({ status: "success", data: data });
      })
      .catch((error) => {
        return res.send({ error: "error", data: error });
      });
  } catch (error) {}
});

module.exports = router;
