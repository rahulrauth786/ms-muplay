//admin part

const express = require("express");
const router = express.Router();

//Import Controllers

const {
  addSingleSong,
  editExistingSong,
  addMultipleSong,
  getSongById,
  resetAllSongs,
  download,
  mostSearchSong,
  mostFavSong,
  mostPlayedSong,
  mostPlayedChart,
} = require("../commons/lib/resources/admin");

router.post("/addSingleSong", addSingleSong);

router.put("/editExistingSong/:id", editExistingSong);

router.post("/addMultipleSong", addMultipleSong);

router.get("/getSongById/:id", getSongById);

router.post("/resetAllSongs", resetAllSongs);

router.get("/download/csv/:reportType", download);

router.post("/mostSearchSong", mostSearchSong);

router.post("/mostFavSong", mostFavSong);

router.post("/mostPlayedSong", mostPlayedSong);

router.post("/mostPlayedChart", mostPlayedChart);
