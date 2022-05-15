var AbstractResource = require("./abstract_resourse"),
  User = AbstractResource("users");
db = require("../db/postgresql");
// User = require(".").Resources;
var Q = require("q");

module.exports = User;

User.getuser = function (req) {
  //return "Rahul";
  return db.query(`select * from users where email = 'rahul@gmail.com'`);
};

// exports.checkUserIdExist = async function (req, res) {
//   console.log("/checkUserIdExist");
//   console.log(req.body);

//   let userId = req.body.userId ? req.body.userId : null;

//   if (isNaN(userId)) {
//     getUser(`select email from users where email = '${userId}'`)
//       .then((results) => {
//         if (results && results.length > 0) {
//           console.log(results);
//           res.send({ email: "Exist" });
//         } else {
//           res.send({ email: "Does Not Exist" });
//         }
//       })
//       .catch((error) => {
//         res.send({ msg: "Internal Error", error });
//       });
//     // try {
//     //   let user = await getUser(
//     //     `select email from users where email = '${userId}'`
//     //   );
//     //   console.log(user);
//     //   if (user) {
//     //     res.send({ email: "Exist" });
//     //   } else {
//     //     console.log("does");
//     //   }
//     // } catch (error) {
//     //   res.send({ email: "Does Not Exist" });
//     // }
//   } else if (userId) {
//     try {
//       let user = await getUser(
//         `select mobile from users where mobile = '${userId}'`
//       );
//       if (user && user.length > 0) {
//         console.log(user);
//         res.send({ email: "Exist" });
//       }
//     } catch (error) {
//       res.send({ email: "Does Not Exist" });
//     }
//   } else {
//     res.sendStatus(401);
//   }

//   // if (req.body.userId) {
//   //   let userId = req.body.userId;
//   //   let checkUserByemailId = users.findIndex(function (user) {
//   //     return user.email === userId;
//   //   });
//   //   let checkUserByMobile = users.findIndex(function (user) {
//   //     return +user.mobile === +userId;
//   //   });
//   //   if (checkUserByemailId >= 0) {
//   //     let user = users[checkUserByemailId];
//   //     res.send({ email: "Exist" });
//   //   } else {
//   //     if (checkUserByMobile >= 0) {
//   //       let user = users[checkUserByMobile];
//   //       res.send({ email: "Exist" });
//   //     } else {
//   //       res.send({ email: "Does Not Exist" });
//   //     }
//   //   }
//   // } else {
//   //   res.sendStatus(401);
//   // }
// };

// exports.login = async function (req, res) {
//   console.log(req.body);
//   console.log("login");
//   let userId = req.body.userId ? req.body.userId : null;
//   let password = req.body.password ? req.body.password : null;
//   if ((userId === null) & (password === null)) {
//     res
//       .status(200)
//       .send({ success: false, msg: "Please Enter User id and Password" });
//   } else if ((userId != null) & (password === null)) {
//     res
//       .status(200)
//       .send({ success: false, msg: "Please Enter User id and Password" });
//   } else if (isNaN(userId)) {
//     processEmailLogin(userId, password)
//       .then((token) => {
//         res.setHeader("X-Auth-Token", token);
//         res.json({ success: true, token: "bearer " + token });
//       })
//       .catch((msg) => {
//         console.log(msg);
//         res.status(200).send({ success: false, msg: msg });
//       });
//   } else {
//     console.log("Mobile");
//     processMobileLogin(userId, password);
//   }

//   // if (req.body.userId) {
//   //   let userId = req.body.userId;
//   //   let password = req.body.password;
//   //   let user = users.find(function (user) {
//   //     return (
//   //       (user.email === userId || +user.mobile === +userId) &&
//   //       user.password === password
//   //     );
//   //   });

//   //   if (user) {
//   //     let payload = {
//   //       id: user.email,
//   //     };
//   //     console.log(payload);
//   //     let token = jwt.sign(payload, cfg.jwtSecret, {
//   //       algorithm: "HS256",
//   //       expiresIn: jwtExpirySeconds,
//   //     });
//   //     res.setHeader("X-Auth-Token", token);
//   //     res.json({ success: true, token: "bearer " + token });
//   //   } else {
//   //     res.status(200).send({ success: false, msg: "Invalid User Password" });
//   //   }
//   // } else {
//   //   res.sendStatus(401);
//   // }
// };

// function processEmailLogin(userId, password) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let user = await getUser(
//         `select * from users where email = '${userId}' && password = '${password}'`
//       );
//       console.log(user);
//       if (user && user.length > 0) {
//         let payload = {
//           id: user[0].email,
//         };
//         console.log(payload);
//         let token = jwt.sign(payload, cfg.jwtSecret, {
//           algorithm: "HS256",
//           expiresIn: jwtExpirySeconds,
//         });
//         resolve(token);
//       } else {
//         reject("Invalid User Password");
//       }
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// }

// exports.user = function (req, res) {
//   console.log("details");
//   console.log(req.user);
//   getUser(`select * from users where email = '${req.user.id}'`)
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => {
//       console.log(error);
//     });
//   //res.json(users[users.findIndex((obj) => obj.email === req.user.id)]);
// };

// exports.register = function (req, res) {
//   let data = req.body;
//   // res.status(200).send({ success: false, msg: "Ok", user: data });
//   let { name: fullName, email, dob, password, account, role } = req.body;

//   insertUser(
//     `INSERT INTO users(fullName, email, dob, password, account, role) VALUES ('${fullName}','${email}','${dob}','${password}','${account}','${role}')`
//   )
//     .then((results) => {
//       res.status(200).send({ success: true, msg: "User Registered" });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(200).send({
//         success: false,
//         msg: "User Already Registered with Provided Mobile",
//       });
//     });

//   // console.log(data);
//   // let checkEmail = users.findIndex((user) => user.email === data.email);
//   // if (checkEmail < 0) {
//   //   let checkMobile = users.findIndex((user) => +user.mobile === +data.mobile);
//   //   if (checkMobile < 0) {
//   //     let regUser = {
//   //       id: users.length + 1,
//   //       ...data,
//   //       account: "activate",
//   //     };
//   //     users.push(regUser);
//   //     res.status(200).send({ success: true, msg: "User Registered" });
//   //   } else {
//   //     res.status(200).send({
//   //       success: false,
//   //       msg: "User Already Registered with Provided Mobile",
//   //     });
//   //   }
//   // } else {
//   //   res.status(200).send({
//   //     success: false,
//   //     msg: "User Already Registered with Provided Email",
//   //   });
//   // }
// };
