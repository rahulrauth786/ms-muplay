var { db } = require("../../../config");

var AbstractResource = require("./abstract_resourse"),
  App_Playlist_Meta = AbstractResource("app_playlist_metas");
db = require("../db/postgresql");

App_Playlist_Meta.get_all_playlist_song = function (name) {
  return db.query(
    `select so.id,so.title,so.img as image,apn.name from app_playlist_metas apm
inner join songs so on so.id = apm."songId"
inner join app_playlist_names apn on apm."playlistId"= apn.id where apn.name = 'trending_songs';`
  );
};

App_Playlist_Meta.get_all_playlist_genre = function (playlistId) {
  return db.query(
    `select g.name as title ,g.img as image from genres as g
inner join app_playlist_genres apg on apg."genreId" = g.id
where apg."playlistId" = '88e06021-190d-4087-aff9-3bc125584dc4'`
  );
};

module.exports = App_Playlist_Meta;
