const express = require("express");

const router = express.Router();
const pwt = require("passport");
const passport = require("../commons/lib/middleware/authentication.js")(pwt);
const auth = require("../commons/lib/middleware/jwt.js");
const User = require("../commons/lib/resources/user.js");

const Songs = require("../commons/lib/resources/songs.js");
const Playlist = require("../commons/lib/resources/app_playlist_songs.js");

router.post("/addSong", async function (req, res) {
  let jsonData = req.body;
  try {
    if (jsonData && jsonData.length >= 0) {
      let dataStatus = [];

      for (let i = 0; i < jsonData.length; i++) {
        let results = await Songs.checkSongExist(jsonData[i].title);
        let data = [];
        if (results.length <= 0) {
          await Songs.insert(jsonData[i]);
          let response = await Songs.checkSongExist(jsonData[i].title);

          let playlists = JSON.parse(jsonData[i].category);
          playlists.map((item) => {
            data.push({
              app_playlist_id: response,
              songs_id,
            });
          });

          await Playlist.insert(jsonData);
          await dataStatus.push({
            ...jsonData[i],
            status: "Added",
            reason: "NA",
          });
        } else {
          console.log(2.2);
          dataStatus.push({
            ...jsonData[i],
            status: "Not Added",
            reason: "Already Exist",
          });
        }
      }
      res.send({ success: true, dataStatus });
    } else {
      res.status(404).send("No Data Available");
    }
  } catch (error) {
    console.log("error");
  }
});

router.get("/download/csv/:reportType", async function (req, res) {
  if ("admin" === "admin") {
    let { reportType } = req.params;
    let jsonData = [];

    if (reportType) {
      if (reportType === "mostPlayedSong") {
        let mostPlayedSong = require("./reportFiles/mostPlayedSong.js");
        if (mostPlayedSong) {
          mostPlayedSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostFavSong") {
        let mostFavSong = require("./reportFiles/mostFavSong.js");
        if (mostFavSong) {
          mostFavSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostSearchSong") {
        let mostSearchSong = require("./reportFiles/mostSearchSong.js");
        if (mostSearchSong) {
          mostSearchSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostPlayedChart") {
        let mostPlayedChart = require("./reportFiles/mostPlayedChart.js");
        if (mostPlayedChart) {
          mostPlayedChart.map(function (value) {
            jsonData.push(value);
          });
        }
      }

      if (reportType === "allSongsReport") {
        jsonData = await Songs.totalSongs();
      }
    }

    res.status(200).send(jsonData);
  }
});

router.get("/:option?/:type?", async function (req, res) {
  let option = req.params.option ? req.params.option : false;
  let type = req.params.type ? req.params.type : null;

  if (option) {
  }

  let songs = await Songs.totalSongs();
  res.send({ msg: "success", songs: songs });
});

module.exports = router;
