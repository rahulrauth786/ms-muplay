const express = require("express");
const router = express.Router();
const pwt = require("passport");
const auth = require("../commons/lib/middleware/authentication.js")(pwt);

var Playlist_Meta = require("../commons/lib/resources/app_playlist_meta");
//Import Controllers

const {
  getAppPlaylistsMeta,
} = require("../commons/lib/resources/app_playlist_meta");

router.get("/get_app_playlist_meta", function (req, res) {
  Playlist.getAppPlaylists()
    .then((data) => {
      console.log(data.length);
      console.log(data[0]);
      if (data && data.length > 0) {
        res.send({ playlists: data, msg: "success" });
      } else {
        res.send({ playlists: [], msg: "success" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ playlists: [], msg: "success" });
    });
});

router.post("/insert_app_playlist_meta", function (req, res) {
  console.log(req.body);

  if (req.body && req.body.length > 0) {
    req.body.map((data) => {
      Playlist_Meta.insert(data);
    });
  }
});

module.exports = router;
