#!node
"use strict";
const express = require("express");
const app = express();
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const models = require("./models");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const route = require("./routes/routes");
const config = require("./config/config");

const secureRoutes = express.Router();

//All the js, css and images are available now
app.use(express.static(path.join(__dirname, "public")));

//Allow cross origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

//Use EJS engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//app.use(favicon(path.join(__dirname, "public", "images", "image3.ico")));

app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

route(app, secureRoutes);

models.sequelize.sync().then(async () => {
  try {
    await models.sequelize.query(
      'CREATE UNIQUE INDEX "unique_index" ON "space" ("nasa_id","userId");'
    );
  } catch (error) {
    //do nothing
  }

  //Start server

  var server = app.listen(config.server.port, config.server.host, function () {
    var host = server.address().address;
    var serverPort = server.address().port;

    console.log("Live at http://%s:%s", host, serverPort);
    console.log(
      "Use http://localhost:%s or http://<ipaddress>:%s if 0.0.0.0 doesn't work",
      serverPort,
      serverPort
    );
  });
});
