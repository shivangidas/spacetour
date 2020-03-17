"use strict";
const model = require("../models");
const spacecontroller = require("../controllers/spacecontroller");
module.exports = function(app, secureRoutes) {
  const path = require("path");
  var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/search");
    } else {
      next();
    }
  };

  app
    .route("/signup")
    .get(sessionChecker, (req, res) => {
      res.render("signup");
    })
    .post((req, res) => {
      model.user
        .create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        })
        .then(user => {
          req.session.user = user.dataValues;
          res.redirect("/search");
        })
        .catch(error => {
          res.redirect("/signup");
        });
    });

  // route for user Login
  app
    .route("/login")
    .get(sessionChecker, (req, res) => {
      res.render("login");
    })
    .post((req, res) => {
      var username = req.body.username,
        password = req.body.password;

      model.user
        .findOne({ where: { username: username } })
        .then(function(user) {
          if (!user) {
            res.redirect("/login");
          } else if (password != user.password) {
            res.redirect("/login");
          } else {
            req.session.user = user.dataValues;
            //console.log(req.session.user.id);
            res.redirect("/search");
          }
        });
    });

  app.get("/", function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
      res.render("/index");
    } else {
      res.redirect("/login");
    }
  });

  app.get("/search", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render("index");
    } else {
      res.redirect("/login");
    }
  });

  app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });

  app.use("/api/v1", secureRoutes); //version control
  secureRoutes.get("/image", spacecontroller.getImages);
  secureRoutes.get("/image/:nasa_id", spacecontroller.getImages);
  secureRoutes.post("/image", spacecontroller.addImage);
  secureRoutes.delete("/image/:id", spacecontroller.deleteImage);
};
