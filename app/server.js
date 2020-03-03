#!node
const express = require("express");
const app = express();
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const models = require("./models");

const route = require("./routes/routes");
const config = require("./config/config");

const secureRoutes = express.Router();

//All the js, css and images are available now
app.use(express.static(path.join(__dirname, "public")));

//Allow cross origin
app.use(function(req, res, next) {
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
    extended: true
  })
);

//Use EJS engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//app.use(favicon(path.join(__dirname, "public", "images", "image3.ico")));

route(app, secureRoutes);

models.sequelize.sync().then(() => {
  //Start server
  var server = app.listen(config.server.port, config.server.host, function() {
    var host = server.address().address;
    var serverPort = server.address().port;

    console.log("Live at http://%s:%s", host, serverPort);
  });
});
