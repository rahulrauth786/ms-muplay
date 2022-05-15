var AbstractResource = require("./abstract_resourse"),
  Playlist_Meta = AbstractResource("app_playlist_meta");
db = require("../db/postgresql");
// User = require(".").Resources;
var Q = require("q");

Playlist_Meta.getAppPlaylistsMeta = function (app_playlist_id) {
  console.log("getAllPlaylist");
  //console.log(user_id);
  return db.query(
    `select * from app_playlist_meta where app_playlist_id = ${app_playlist_id};`
  );
};

module.exports = Playlist_Meta;
