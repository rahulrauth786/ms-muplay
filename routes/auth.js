const express = require("express");

const router = express.Router();
const pwt = require("passport");
const passport = require("../commons/lib/middleware/authentication.js")(pwt);
const auth = require("../commons/lib/middleware/jwt.js");
const User = require("../commons/lib/resources/user.js");

router.get("/user", passport.authenticate(), function (req, res) {
  User.getuser(req)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/user/checkUserIdExist", function (req, res) {
  let { userId } = req.body;
  console.log(userId);
  if (isNaN(userId)) {
    User.findByEmailId(userId)
      .then((result) => {
        if (result && result.length > 0) {
          res.send({ email: "Exist" });
        } else {
          res.send({ email: "Does Not Exist" });
        }
      })
      .catch((err) => {
        res.send("error");
      });
  }
  if (!isNaN(userId)) {
    User.findByPhone(userId)
      .then((result) => {
        if (result && result.length > 0) {
          res.send({ phone1: "Exist" });
        } else {
          res.send({ phone1: "Does Not Exist" });
        }
      })
      .catch((err) => {
        res.send("error");
      });
  }
});

router.post("/user/email", auth.login(), function (req, res) {
  return res.json({
    success: true,
    token: "bearer " + req.token,
    user: req.user,
  });
});

router.post("/user/phone", auth.login(), function (req, res) {
  return res.send({ success: true, data: { token: req.token } });
});

router.post("/user/register", function (req, res) {
  if (!req.body.email) {
    return res.send({ success: false, data: { msg: "Email is missing" } });
  }
  let { email, phone1 } = req.body;
  let userExist = false;
  User.findByEmailId(email)
    .then((result) => {
      if (result && result.length > 0) {
        userExist = true;
        return res.send({
          success: false,
          data: { msg: "User Already Exist" },
        });
      }
      return false;
    })
    .then((data) => {
      User.findByPhone(phone1).then((result) => {
        if (result && result.length > 0) {
          userExist = true;
          return res.send({
            success: false,
            data: { msg: "User Already Existed" },
          });
        }
        return false;
      });
    })
    .then((data) => {
      if (!userExist)
        User.insert(req.body).then((response) => {
          if (response)
            return res.send({
              success: true,
              data: { msg: "User Registered" },
            });
        });
    });
});

module.exports = router;
