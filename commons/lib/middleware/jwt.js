const passportJWT = require("passport-jwt");
const cfg = require("./config.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../resources/user.js");

const params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtExpirySeconds = 30000;

function generateToken(results) {
  console.log("point2");
  return new Promise(async (resolve, reject) => {
    if (results && results.length > 0) {
      let payload = {
        id: results[0].id,
      };
      console.log(payload);
      let token = jwt.sign(payload, cfg.jwtSecret, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });
      resolve(token);
    } else {
      reject("Invalid User Password");
    }
  });
}

var oAuth = {
  login: function () {
    return function (req, res, next) {
      let { email, password } = req.body;
      User.findByUserId(email, password)
        .then((results) => {
          if (results && results.length > 0) {
            generateToken(results)
              .then((token) => {
                req.token = token;
                req.user = results[0];
                req.headers["content-type"] =
                  "application/x-www-form-urlencoded";
                next();
              })
              .catch((err) => {
                res.send("Internal Error -1");
              });
          } else {
            res.send("Invalid EmailId Or Password");
          }
        })
        .catch((err) => {
          res.send("Internal Error -3");
        });
    };
  },
};

module.exports = oAuth;
