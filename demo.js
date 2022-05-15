const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const auth = require("./auth.js")();

const cfg = require("./config.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
//const getUser = require("./mysql/sqlQueries");

// const Json2csvParser = require("json2csv").Parser;
const csv = require("csvtojson");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(function (req, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  response.header("Access-Control-Expose-Headers", "X-Auth-Token");
  next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".csv");
  },
});
const upload = multer({ storage: storage }).single("myFile");
const jwtExpirySeconds = 30000;

const port = 2410;

app.listen(port, () => console.log("Listening on Ports :", port));

app.get("/users", function (req, res) {
  res.send("root");
});
