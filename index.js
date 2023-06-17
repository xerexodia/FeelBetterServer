const express = require("express");
const port = 5000;
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
//
require("./models/Admin");
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
app.use(cors());
//routes
const authRouters = require("./routes/authRoutes");
const requireToken = require("./middlewares/AuthTokenRequired");
const { $where } = require("./models/UserPro");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reaction = require("./routes/reaction");
const note = require("./routes/note");
const moodRoutes = require("./routes/mood");
const challengeRoutes = require("./routes/challenge");
const statsRoute = require("./routes/stats");
const sentences = require("./routes/sentences");
const previleges = require("./routes/previleges");
const citaion = require("./routes/citation");
const favoris = require("./routes/favoris");
require("./models/challange");
const challenge = require("./models/challange");
//
app.use(bodyParser.json());
app.use(authRouters);
app.use(postRoutes);
app.use(commentRoutes);
app.use(reaction);
app.use(note);
app.use(moodRoutes);
app.use(challengeRoutes);
app.use(statsRoute);
app.use(sentences);
app.use(previleges);
app.use(citaion);
app.use(favoris);

//

app.get("/", requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log("server is runing ");
});
