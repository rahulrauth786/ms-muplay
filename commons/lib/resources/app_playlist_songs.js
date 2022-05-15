var AbstractResource = require("./abstract_resourse"),
  Playlist = AbstractResource("playlists");
Playlist_Meta = AbstractResource("app_playlist_meta");
Playlist = AbstractResource("app_playlist_songs");
db = require("../db/postgresql");
// User = require(".").Resources;
var Q = require("q");

Playlist.getUserplaylists = function (user_id) {
  console.log("getAllPlaylist");
  console.log(user_id);
  return db.query(
    `select * from user_playlist_names where user_id = '${user_id}'`
  );
};

Playlist.getUsersongs = function (req) {
  console.log("getSongsByPlaylist");
  console.log(req.body.playlist.id);
  return db.query(
    `select * from user_playlist_songs where playlist_id = '${req.body.playlist.id}'`
  );
};

Playlist.getAppPlaylistsMeta = function (app_playlist_id) {
  console.log("getAllPlaylist");
  //console.log(user_id);
  return db.query(
    `select * from app_playlist_meta where app_playlist_id = ${app_playlist_id};`
  );
};

Playlist.getAppPlaylistsMeta = function (app_playlist_id) {
  console.log("getAllPlaylist");
  //console.log(user_id);
  return db.query(
    `select * from app_playlist_meta where app_playlist_id = ${app_playlist_id};`
  );
};

Playlist.getAppPlaylists = function () {
  console.log("getAllPlaylist");
  //console.log(user_id);
  return db.query(`select * from app_playlist_names;`);
};

Playlist.getAppsongs = function (req) {
  console.log("getSongsByPlaylist");
  console.log(req.body.playlist.id);
  return db.query(
    `select * from app_playlist_songs where playlist_id = '${req.body.playlist.id}'`
  );
};

Playlist.addPlaylistByName = function (req) {
  let playlistName = req.params.playlistName;
  let data = require("./app_playlist_songs.js");

  if (playlistName) {
    User;
  }

  if (playlistName) {
    let userPlaylist = data.find((obj) => obj.email === req.user.id);

    if (userPlaylist) {
      let playlists = userPlaylist.playlists;
      let index = playlists.find((obj) => obj.playlistName === playlistName);
      console.log(index);
      if (index === undefined) {
        playlists.push({
          playlistName: playlistName,
          songs: [],
        });
        res.send({ msg: "Added", playlists: userPlaylist.playlists });
      } else {
        res.send({ msg: "Already Exist" });
      }
    } else {
      let newEntry = {
        email: req.user.id,
        playlists: [{ playlistName: playlistName, songs: [] }],
      };
      data.push(newEntry);
      res.send({ msg: "Added", playlists: newEntry.playlists });
    }
  }
};

// exports.getAllPlaylist = function (req, res) {
//   let data = require("./playlist.js");
//   let userPlaylist = data.find((obj) => obj.email === req.user.id);

//   if (userPlaylist) {
//     res.send({ playlists: userPlaylist.playlists, msg: "success" });
//   } else {
//     res.send({ playlists: [], msg: "success" });
//   }
// };

// exports.addPlaylistByName = function (req, res) {
//   let playlistName = req.params.playlistName;
//   let data = require("./playlist.js");

//   if (playlistName) {
//     let userPlaylist = data.find((obj) => obj.email === req.user.id);

//     if (userPlaylist) {
//       let playlists = userPlaylist.playlists;
//       let index = playlists.find((obj) => obj.playlistName === playlistName);
//       console.log(index);
//       if (index === undefined) {
//         playlists.push({
//           playlistName: playlistName,
//           songs: [],
//         });
//         res.send({ msg: "Added", playlists: userPlaylist.playlists });
//       } else {
//         res.send({ msg: "Already Exist" });
//       }
//     } else {
//       let newEntry = {
//         email: req.user.id,
//         playlists: [{ playlistName: playlistName, songs: [] }],
//       };
//       data.push(newEntry);
//       res.send({ msg: "Added", playlists: newEntry.playlists });
//     }
//   }
// };

module.exports = Playlist;

exports.getAllFavSongsById = function (req, res) {
  if (req.user.id) {
    let data = require("./favourites.js.js.js");

    let user = data.find((obj) => obj.userId === req.user.id);
    if (user) {
      let songsId = user.songsId;
      if (songsId && songsId.length > 0) {
        let allSongs = require("./musicFile/allSongs.js.js.js");
        let collectedSong = [];
        songsId.map(function (id) {
          let retrieveSong = allSongs.find((obj) => obj.id === +id);
          collectedSong.push(retrieveSong);
        });
        res.send({ songs: collectedSong, msg: "success" });
      } else res.send({ msg: "No Songs" });
    } else {
      res.send({ msg: "No User" });
    }
  } else res.send({ msg: "Please Enter Id" });
};

exports.addSongToFavourites = function (req, res) {
  let songId = req.params.songId;
  if (songId) {
    let data = require("./favourites.js.js.js");

    let index = data.findIndex((obj) => obj.userId === req.user.id);
    if (index >= 0) {
      let user = data[index];
      let songsId = user.songsId;
      let checkSongExist = songsId.find((id) => id === +songId);
      if (!checkSongExist) {
        songsId.push(+songId);
        data = { ...user };
        res.send({ data, msg: "Song Added To Favourite" });
      } else {
        res.send({ data, msg: "Song Id Already Exist In Favourites" });
      }
    } else {
      let length = data.length;
      let songsId = [];
      songsId.push(+songId);
      let newUser = { id: length + 1, userId: req.user.id, songsId };
      data.push(newUser);
      res.send({ data, msg: "No User" });
    }
  } else {
    res.send({ msg: "No Song Id Provided" });
  }
};

exports.removeSongToFavourites = function (req, res) {
  let songId = req.params.songId;
  if (songId) {
    let data = require("./favourites.js.js.js");

    let index = data.findIndex((obj) => obj.userId === req.user.id);
    if (index >= 0) {
      let user = data[index];
      let songsId = user.songsId;
      let checkSongExist = songsId.find((id) => id === +songId);
      if (checkSongExist) {
        // songsId.push(+songId);
        let updateSongId = songsId.filter((id) => +id !== +songId);
        console.log(updateSongId);
        user.songsId = updateSongId;
        data = { ...user };
        res.send({ data, msg: "Song Removed From Favourite" });
      } else {
        res.send({ data, msg: "Song Id Already Removed" });
      }
    } else {
      res.send("No users");
    }
  } else {
    res.send("No Song Id Provided");
  }
};

exports.playlist = function (req, res) {
  let playlistName = req.params.playlistName;
  if (playlistName) {
    let data = require("./app_playlist_songs.js");
    console.log(data);
    let user = data.find((obj) => obj.email === req.user.id);
    if (user) {
      let playlist = user.playlists.find(
        (obj) => obj.playlistName === playlistName
      );
      if (playlist) {
        let allSongs = require("./musicFile/allSongs.js.js.js");
        let songs = playlist.songs;
        console.log(songs);
        let collectedSong = [];
        if (songs && songs.length > 0) {
          songs.map(function (song) {
            let retrieveSong = allSongs.find((obj) => obj.id === +song.songId);
            collectedSong.push(retrieveSong);
          });
          console.log(collectedSong);
          res.send({ songs: collectedSong, msg: "success" });
        } else {
          res.send({ msg: "No Songs In Playlist" });
        }
      } else res.send({ msg: "No Playlist" });
    } else {
      res.send({ msg: "No User" });
    }
  } else res.send({ msg: "Please Enter Id" });
};

exports.addSongToPlayList = function (req, res) {
  let playlistName = req.params.playlistName;
  let songId = req.params.songId;
  console.log(playlistName, songId);
  if (playlistName && songId) {
    let data = require("./app_playlist_songs.js");
    let user = data.find((obj) => obj.email === req.user.id);
    console.log(user);
    if (user) {
      let allplaylists = user.playlists;
      let playlist = allplaylists.find(
        (obj) => obj.playlistName === playlistName
      );

      if (playlist) {
        let songs = playlist.songs;
        let checkId = songs.find((obj) => +obj.songId === +songId);
        if (checkId === undefined) {
          songs.push({ songId: +songId });
          res.send({ alldata: data, msg: "success" });
        } else {
          res.send({ msg: "Song Already Exist" });
        }
      } else {
        res.send({ msg: "No Playlist Name" });
      }
    } else {
      console.log("no user");
    }
  }
};

exports.trendingSong = function (req, res) {
  let selSong = req.params.selSong;
  let songs = require("./musicFile/trendingSongs.js.js.js");
  if (selSong) {
    let song = songs.find((song) => song.title === selSong);
    if (song) res.send({ songs: [song], msg: "success" });
    else res.send({ msg: "No Songs In Playlist" });
  } else {
    res.send({ songs: songs, msg: "success" });
  }
};

exports.song = function (req, res) {
  let selSong = req.params.selSong;
  let songs = require("./musicFile/trendingSongs.js.js.js");
  if (selSong) {
    let song = songs.find((song) => song.title === selSong);
    if (song) res.send({ songs: [song], msg: "success" });
    else res.send({ msg: "No Songs In Playlist" });
  } else {
    res.send({ songs: songs, msg: "success" });
  }
};

exports.topPicks = function (req, res) {
  let params = req.params.type;
  if (params) {
    let songs = require(`./musicFile/topPicks/${params}.js`);
    if (songs && songs.length > 0) res.send({ songs, msg: "success" });
    else res.send({ msg: "No Songs In Playlist" });
  } else {
    res.send({ msg: "No Songs In Playlist" });
  }
};

exports.topCharts = function (req, res) {
  let type = req.params.type;
  if (type) {
    let songs = require(`./musicFile/topCharts/${type}.js`);
    if (songs && songs.length > 0) res.send({ songs: songs, msg: "success" });
    else res.send({ msg: "No Songs In Playlist" });
  } else {
    res.send({ msg: "No Songs In Playlist" });
  }
};

exports.allSongs = function (req, res) {
  let search = req.params.searchType;
  let songs = require("./musicFile/allSongs.js.js.js");
  let songSearched = [];
  let exactSong = false;
  if (search !== undefined) {
    songs.filter(function (obj) {
      if (obj.title.toLowerCase() === search.toLowerCase()) {
        songSearched.push(obj);
        exactSong = true;
      } else {
        if (!exactSong) {
          let nameString = obj.title.substring(0, 1);
          let searchString = search.substring(0, 1);
          console.log(searchString);
          if (searchString.toLowerCase() === nameString.toLowerCase()) {
            songSearched.push(obj);
          }
        }
      }
    });
    res.send(songSearched);
  } else {
    res.send(songSearched);
  }
};
