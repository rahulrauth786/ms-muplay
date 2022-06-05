const express = require("express");
const router = express.Router();
const pwt = require("passport");
const auth = require("../commons/lib/middleware/authentication.js")(pwt);

var Playlist_Meta = require("../commons/lib/resources/app_playlist_meta");
//Import Controllers

router.get("/get_app_playlist_song", function (req, res) {
  req.query.name = Playlist_Meta.get_all_playlist_song(req.query.name).then(
    (results) => {
      res.send(results);
    }
  );
});

router.get("/get_app_playlist_genre", function (req, res) {
  req.query.name = Playlist_Meta.get_all_playlist_genre(req.query.name).then(
    (results) => {
      res.send(results);
    }
  );
});

router.post("/insert_app_playlist_song", function (req, res) {
  console.log(req.body);

  if (req.body && req.body.length > 0) {
    req.body.map((data) => {
      Playlist_Meta.insert(data);
    });
  }
});

module.exports = router;
