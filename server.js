const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(function (req, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  response.header("Access-Control-Expose-Headers", "X-Auth-Token");
  next();
});

//const authRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const songsRoutes = require("./routes/songs");
const playlistRoutes = require("./routes/app_playlist_songs");
const playlistMetaRoutes = require("./routes/app_playlist_meta");

//Middle Ware
app.use("/", authRoutes);
app.use("/songs", songsRoutes);
app.use("/playlist", playlistRoutes);
app.use("/app_playlist_meta", playlistMetaRoutes);
const port = process.env.PORT ? process.env.PORT : 2410;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
