var AbstractResource = require("./abstract_resourse"),
  Songs = AbstractResource("songs");
db = require("../db/postgresql");
Q = require("q");

exports.addSingleSong = function (req, res) {
  let user = { role: "admin" };
  if (user && user.role === "admin") {
    let respSongData = req.body;
    if (respSongData) {
      let allSongs = require("./musicFile/allSongs.js.js.js");
      let newSongs = {};
      let index = allSongs.findIndex(
        (song) => song.title === respSongData.title
      );
      console.log(index);
      if (index < 0) {
        newSongs = { id: allSongs.length + 1, ...respSongData };
        allSongs.push({ respSongData });
        let playlist = require(`./musicFile/${respSongData.playlist}/${respSongData.genre}`);
        let playlistIndex = playlist.findIndex(
          (obj) =>
            obj.title === respSongData.title || obj.id === respSongData.id
        );
        if (playlistIndex < 0) {
          playlist.push(newSongs);
          res.send({ msg: "New Song Added", allSongs });
        } else {
          res.send({ msg: "Song Already Exist in Playlist", allSongs });
        }
      } else {
        //  newSongs = allSongs[index];
        res.send({ msg: "Song Already Exist", allSongs });
      }
    } else {
      res.send({ msg: "No Such Response in Data" });
    }
  } else {
    res.send({ msg: "User is Not Authorised" });
  }
};

exports.editExistingSong = function (req, res) {
  if ("admin" === "admin") {
    let id = req.params.id;
    console.log(id);
    if (id) {
      let allSongs = require("./musicFile/allSongs.js.js.js");
      let songIndex = allSongs.findIndex((obj) => obj.id === +id);
      if (songIndex >= 0) {
        let updatedData = req.body;
        if (
          updatedData.playlist !== undefined &&
          updatedData.genre !== undefined
        ) {
          allSongs[songIndex] = req.body;
          let playlist = require(`./musicFile/${updatedData.playlist}/${updatedData.genre}`);
          let playlistIndex = playlist.findIndex((obj) => obj.id === +id);
          if (playlistIndex >= 0) {
            playlist[playlistIndex] = updatedData;
            res.send({ msg: "Updated SuccesFully" });
          } else {
            playlist.push(updatedData);
            res.send({ msg: "Updated SuccesFully and Added To New Playlist" });
          }
        } else {
          res.send({ msg: "Playlist Or Genre Missing" });
        }
      } else {
        res.send({ msg: "No Song Exists" });
      }
    }
  }
};

exports.getSongById = function (req, res) {
  let id = req.params.id;
  let list = require("./musicFile/allSongs.js.js.js");
  let index = list.findIndex((obj) => obj.id === +id);
  if (index >= 0) {
    let song = list[index];
    console.log(song);
    res.status(200).send(song);
  }
};

exports.resetAllSongs = async function (req, res) {
  let user = { role: "admin" };
  if (user && user.role === "admin") {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        res.status(500).json(err);
      } else if (err) {
        res.status(500).json(err);
      }
      try {
        // let jsonData = csvToJson
        //   .fieldDelimiter(",")
        //   .getJsonFromCsv("./uploads/myFile.csv");
        let jsonData = await csv().fromFile("./uploads/myFile.csv");

        //check keys

        console.log(jsonData.length);

        let obj2 = { ...jsonData[0] };
        var obj1Keys = [
          "title",
          "playlist",
          "artist",
          "time",
          "genre",
          "genreImg",
          "img",
          "track",
        ].sort();
        var obj2Keys = Object.keys(obj2).sort();
        let count = 0;
        obj2Keys.map(function (value) {
          let index = obj1Keys.findIndex((obj) => obj === value);
          if (index >= 0) {
            count++;
          }
        });

        console.log(obj1Keys);
        console.log(obj2Keys);

        if (count === 8) {
          console.log(count);
          if (jsonData && jsonData.length >= 0) {
            let allPlaylists = ["topPicks", "topCharts"];
            let allGenres = [
              "hindi",
              "punjabi",
              "punjabiParty",
              "romance",
              "bhakti",
              "globallyTrending",
              "international",
              "newReleaseHindi",
              "newReleaseHot",
              "pumpUp",
              "todays",
              "trendingAround",
            ];
            let allSongs = require("./musicFile/allSongs.js.js.js");
            let newAllSongs = [];
            allPlaylists.map(function (playlist) {
              let songs = [];
              allGenres.map(function (genre) {
                songs = require(`./musicFile/${playlist}/${genre}`);
                let filteredData = [];
                jsonData.map(function (obj, index) {
                  if (obj.playlist === playlist && obj.genre === genre) {
                    if (filteredData.length < 0) {
                      filteredData.push({
                        id: obj.id,
                        title: obj.title,
                        artist: obj.artist,
                        time: obj.time,
                        genre: obj.genre,
                        genreImg: obj.genreImg,
                        img: obj.img,
                        track: obj.track,
                      });
                    } else {
                      let findex = filteredData.findIndex(
                        (data) => data.title === obj.title
                      );
                      if (findex < 0) {
                        filteredData.push({
                          id: obj.id,
                          title: obj.title,
                          artist: obj.artist,
                          time: obj.time,
                          genre: obj.genre,
                          genreImg: obj.genreImg,
                          img: obj.img,
                          track: obj.track,
                        });
                      }
                    }
                  }
                });
                songs.splice(0, songs.length);
                filteredData.map((obj) => songs.push(obj));
                songs = filteredData;
                songs.map(function (song) {
                  if (newAllSongs.length < 0) {
                    newAllSongs.push(song);
                  } else {
                    let index = newAllSongs.findIndex(
                      (newSong) => newSong.title === song.title
                    );
                    if (index <= 0) {
                      newAllSongs.push(song);
                    }
                  }
                });
              });
            });
            allSongs = newAllSongs;
            res.send({ songs: allSongs, msg: "All Data Reset" });
          } else {
            res.status(404).send({ msg: "No Data Available" });
          }
        } else {
          console.log("keySNotMatching");
          res.status(404).send({
            msg: "Csv File Contains Invalid Property Please Upload Valid Csv Files",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
};

exports.download = function (req, res) {
  if ("admin" === "admin") {
    let { reportType } = req.params;
    let jsonData = [];

    if (reportType) {
      if (reportType === "mostPlayedSong") {
        let mostPlayedSong = require("./reportFiles/mostPlayedSong.js.js.js");
        if (mostPlayedSong) {
          mostPlayedSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostFavSong") {
        let mostFavSong = require("./reportFiles/mostFavSong.js.js.js");
        if (mostFavSong) {
          mostFavSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostSearchSong") {
        let mostSearchSong = require("./reportFiles/mostSearchSong.js.js.js");
        if (mostSearchSong) {
          mostSearchSong.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "mostPlayedChart") {
        let mostPlayedChart = require("./reportFiles/mostPlayedChart.js.js.js");
        if (mostPlayedChart) {
          mostPlayedChart.map(function (value) {
            jsonData.push(value);
          });
        }
      }
      if (reportType === "allSongsReport") {
        let allPlaylists = ["topPicks", "topCharts"];
        let allGenres = [
          "hindi",
          "punjabi",
          "punjabiParty",
          "romance",
          "bhakti",
          "globallyTrending",
          "international",
          "newReleaseHindi",
          "newReleaseHot",
          "pumpUp",
          "todays",
          "trendingAround",
        ];
        let allSongs = require("./musicFile/allsongs.js.js.js");
        console.log("all Songs", allSongs.length);
        allPlaylists.map(function (playlist) {
          allGenres.map(function (genre) {
            let songs = require(`./musicFile/${playlist}/${genre}`);

            if (songs.length > 0) {
              songs.map(function (obj) {
                let song = allSongs.find((value) => +value.id === +obj.id);
                if (song) {
                  jsonData.push({
                    ...song,
                    genre: obj.genre,
                    genreImg: obj.genreImg,
                    img: obj.img,
                    track: obj.track,
                    playlist: playlist,
                  });
                }
              });
            }
          });
        });
      }
    }

    res.status(200).send(jsonData);
  }
};

exports.mostSearchSong = function (req, res) {
  console.log(req.body);
  let data = req.body;

  let mostSearchSong = require("./reportFiles/mostSearchSong.js.js.js");
  let index = mostSearchSong.findIndex((obj) => obj.keyword === data.keyword);
  if (index < 0) {
    mostSearchSong.push({ ...data, volume: 1 });
    return res.status(200).send({ msg: "Success" });
  } else {
    let report = mostSearchSong[index];
    report.volume++;
    mostSearchSong[index] = report;
    return res.status(200).send({ msg: "Success" });
  }

  // fs.writeFile(
  //   "./dataFiles/searchReport.json",
  //   JSON.stringify(searchReport, null, 4),
  //   (err) => {
  //     if (err) {
  //       console.log(`Error writing file: ${err}`);
  //       return res.send("Error");
  //     }
  //     return res.status(200).send("Success");
  //   }
  // );
};

exports.mostFavSong = function (req, res) {
  console.log(req.body);
  let data = req.body;
  if ("user" === "user") {
    let mostFavSong = require("./reportFiles/mostFavSong.js.js.js");
    let index = mostFavSong.findIndex((obj) => obj.id === data.id);
    if (index < 0) {
      mostFavSong.push({ ...data, volume: 1 });
      return res.status(200).send({ msg: "Success" });
    } else {
      let report = mostFavSong[index];
      report.volume++;
      mostFavSong[index] = report;
      return res.status(200).send({ msg: "Success" });
    }

    // fs.writeFile(
    //   "./dataFiles/mostFavSong.json",
    //   JSON.stringify(mostFavSong, null, 4),
    //   (err) => {
    //     if (err) {
    //       console.log(`Error writing file: ${err}`);
    //       return res.send("Error");
    //     }
    //     return res.status(200).send("Success");
    //   }
    // );
  }
};

exports.mostPlayedSong = function (req, res) {
  console.log(req.body);
  let data = req.body;
  if ("user" === "user") {
    let mostPlayedSong = require("./reportFiles/mostPlayedSong.js.js.js");
    let index = mostPlayedSong.findIndex((obj) => obj.id === data.id);
    if (index < 0) {
      mostPlayedSong.push({ ...data, volume: 1 });
      return res.status(200).send({ msg: "Success" });
    } else {
      let report = mostPlayedSong[index];
      report.volume++;
      mostPlayedSong[index] = report;
      return res.status(200).send({ msg: "Success" });
    }
    // fs.writeFile(
    //   "./reportFiles/mostPlayedSong.json",
    //   JSON.stringify(mostPlayedSong, null, 4),
    //   (err) => {
    //     if (err) {
    //       console.log(`Error writing file: ${err}`);
    //       return res.send("Error");
    //     }
    //     return res.status(200).send("Success");
    //   }
    // );
  }
};

exports.mostPlayedChart = function (req, res) {
  console.log(req.body);
  let data = req.body;
  if ("user" === "user") {
    let mostPlayedSong = require("./reportFiles/mostPlayedChart.js.js.js");
    let index = mostPlayedSong.findIndex((obj) => obj.genre === data.genre);
    if (index < 0) {
      mostPlayedSong.push({ ...data, volume: 1 });
      return res.status(200).send({ msg: "Success" });
    } else {
      let report = mostPlayedSong[index];
      report.volume++;
      mostPlayedSong[index] = report;
      return res.status(200).send({ msg: "Success" });
    }
    // fs.writeFile(
    //   "./reportFiles/mostPlayedSong.json",
    //   JSON.stringify(mostPlayedSong, null, 4),
    //   (err) => {
    //     if (err) {
    //       console.log(`Error writing file: ${err}`);
    //       return res.send("Error");
    //     }
    //     return res.status(200).send("Success");
    //   }
    // );
  }
};
