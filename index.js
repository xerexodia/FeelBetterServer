const express = require("express");
const port = 3000;

const app = express();
const bodyParser = require("body-parser");
//
require("./db");
require("./models/User");
require("./models/UserPro");
// for serving static files
var path = require("path");

//app.use(express.static(__dirname)); // Current directory is root
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
); //  "public" off of current is root

//routes
const authRouters = require("./routes/authRoutes");
const requireToken = require("./middlewares/AuthTokenRequired");
const { $where } = require("./models/UserPro");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reaction = require("./routes/reaction");
require("./models/challange");
const challenge = require("./models/challange");
//
app.use(bodyParser.json());
app.use(authRouters);
app.use(postRoutes);
app.use(commentRoutes);
app.use(reaction);
//

app.get("/", requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.put("/challenge", async (req, res) => {
  //let mode=req.body.mode;
  try {
    const ch = await challenge.find();
    res.json("data");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("server is runing ");
});
