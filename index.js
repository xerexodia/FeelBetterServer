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
const note = require("./routes/note");
const moodRoutes = require("./routes/mood");
const challengeRoutes = require("./routes/challenge");
const statsRoute = require("./routes/stats");
app.use(bodyParser.json());
app.use(authRouters);
app.use(postRoutes);
app.use(commentRoutes);
app.use(reaction);
app.use(note);
app.use(moodRoutes);
app.use(challengeRoutes);
app.use(statsRoute);
//

app.get("/", requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log("server is runing ");
});
