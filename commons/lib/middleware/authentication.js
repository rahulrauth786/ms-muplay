const passportJWT = require("passport-jwt");
const cfg = require("./config.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const passport = require("passport");

const params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const User = require("../resources/user.js");
db = require("../db/postgresql");

module.exports = function () {
  const strategy = new Strategy(params, function (payload, done) {
    console.log(payload);
    User.findById(payload.id).then((user) => {
      if (user && user.length > 0) {
        return done(null, {
          id: user[0].id,
        });
      } else {
        return done(new Error("User not found"), null);
      }
    });
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", cfg.jwtSession);
    },
  };
};
