"use strict";
const model = require("../models");
module.exports = function(app, secureRoutes) {
  const path = require("path");

  app.get("/", (req, res) => {
    res.render("index");
  });
};
