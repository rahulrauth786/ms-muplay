const express = require("express");
const router = express.Router();
const pwt = require("passport");
const auth = require("../commons/lib/middleware/authentication.js")(pwt);
var Playlist = require("../commons/lib/resources/app_playlist_songs");
var Playlist_Meta = require("../commons/lib/resources/app_playlist_songs");
//Import Controllers

const {
  getAllPlaylist,
  addPlaylist,
  getAllFavSongsById,
  addSongToFavourites,
  removeSongToFavourites,
  playlist,
  addSongToPlayList,
  trendingSong,
  song,
  topPicks,
  topCharts,
  search,
} = require("../commons/lib/resources/app_playlist_songs");

router.get("/getplaylists/:user_id", function (req, res) {
  Playlist.getplaylists(req.params.user_id)
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

router.get("/get_app_playlists", function (req, res) {
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

router.get("/getsongs", function (req, res) {
  Playlist.getSongsByPlaylist(req)
    .then((data) => {
      console.log(data.length);
      console.log(data);
      if (data && data.length > 0) {
        res.send({ songs_details: data, msg: "success" });
      } else {
        res.send({ songs_details: [], msg: "success" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ playlists: [], msg: "success" });
    });
});

router.get("/addSongs", function (req, res) {
  Playlist.insert(req.body)
    .then((data) => {
      console.log(data.length);
      console.log(data);
      if (data && data.length > 0) {
        res.send({ songs_details: data, msg: "success" });
      } else {
        res.send({ songs_details: [], msg: "success" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ playlists: [], msg: "success" });
    });
});

// router.post("/addPlaylist/:playlistName", auth.login(), addPlaylist);

// router.get("/getAllFavSongsById", auth.login(), getAllFavSongsById);

// router.post("/addSongToFavourites/:songId", auth.login(), addSongToFavourites);

// router.post(
//   "/removeSongToFavourites/:songId",
//   auth.login(),
//   removeSongToFavourites
// );

// router.get("/playlist/:playlistName", auth.login(), playlist);

// router.post(
//   "/addSongToPlayList/:playlistName/:songId",
//   auth.login(),
//   addSongToPlayList
// );

// router.get("/trendingSong/:selSong?", trendingSong);

// router.get("/song/:selSong?", song);

// router.get("/topPicks/:type", topPicks);

// router.get("/topCharts/:type", topCharts);

// router.get("/search/:searchType", search);

module.exports = router;
