var AbstractResource = require("./abstract_resourse"),
  Songs = AbstractResource("songs");
db = require("../db/postgresql");

Songs.checkSongExist = function (title) {
  return db.query(`select * from songs where title = '${title}'`);
};

Songs.totalSongs = function () {
  return db.query(`select * from songs`);
};

Songs.getSongsByLimit = function (limit) {
  return db.query(`select * from songs order by created DESC limit ${limit}`);
};

Songs.addSongs = async function (data) {
  return new Promise(async (resolve, reject) => {
    try {
      if (data && data.length >= 0) {
        let insertStatus = [];
        for (let i = 0; i < data.length; i++) {
          let row = await Songs.checkSongExist(data[i].title);
          if (row.length <= 0) {
            await Songs.insert(data[i]);
            insertStatus.push({
              ...data[i],
              status: "Added",
              reason: "NA",
            });
          } else {
            insertStatus.push({
              ...data[i],
              status: "Not Added",
              reason: "Already Exist",
            });
          }
        }
        resolve(insertStatus);
      } else {
        reject("No Data Available");
      }
    } catch (error) {
      reject(error);
    }
  });

  // let deferred = Q.defer();
  // console.log("addSongs");
  // try {
  //   if (jsonData && jsonData.length >= 0) {
  //     let dataStatus = [];
  //     for (let i = 0; i < jsonData.length; i++) {
  //       let results = await Songs.checkSongExist(jsonData[i].title);
  //       let data = [];
  //       if (results.length <= 0) {
  //         await Songs.insert(jsonData[i]);
  //         await dataStatus.push({
  //           ...jsonData[i],
  //           status: "Added",
  //           reason: "NA",
  //         });
  //       } else {
  //         console.log(2.2);
  //         dataStatus.push({
  //           ...jsonData[i],
  //           status: "Not Added",
  //           reason: "Already Exist",
  //         });
  //       }
  //     }
  //     // console.log(dataStatus);
  //     return deferred.resolve(dataStatus);
  //     //res.send({ success: true, dataStatus });
  //   } else {
  //     return deferred.reject("No Data Available");
  //     //res.status(404).send("No Data Available");
  //   }
  // } catch (error) {
  //   console.log("error");
  //   return deferred.reject("Error");
  // }
};

module.exports = Songs;
