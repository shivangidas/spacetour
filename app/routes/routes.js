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
      if (req.body.username && req.body.password) {
        try {
          model.user
            .create({
              username: req.body.username,
              // email: req.body.email,
              password: req.body.password
            })
            .then(user => {
              req.session.user = user.dataValues;
              res.status(200).send({ message: "signed up!" });
            })
            .catch(error => {
              //console.log(error);
              res
                .status(404)
                .send({ message: "Username already exists. Try another." });
            });
        } catch (error) {
          res.status(403).send({ message: "Internal Error" });
        }
      } else {
        res.status(403).send({
          message: "Error executing API. Make sure the details are correct."
        });
      }
    });

  // route for user Login
  app
    .route("/login")
    .get(sessionChecker, (req, res) => {
      res.render("login");
    })
    .post((req, res) => {
      if (req.body.username && req.body.password) {
        try {
          var username = req.body.username,
            password = req.body.password;

          model.user
            .findOne({ where: { username: username } })
            .then(function(user) {
              if (!user) {
                res
                  .status(404)
                  .send({ message: "Username or password is incorrect." });
              } else if (password != user.password) {
                res
                  .status(404)
                  .send({ message: "Username or password is incorrect." });
              } else {
                req.session.user = user.dataValues;
                //console.log(req.session.user.id);
                res.status(200).send({ message: "logged in" });
              }
            })
            .catch(error => {
              res.status(403).send({
                message: "Error executing API. Make sure the login is correct."
              });
            });
        } catch (error) {
          res.status(403).send({ message: "Internal Error" });
        }
      } else {
        res.status(403).send({
          message: "Error executing API. Make sure the login is correct."
        });
      }
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

  //check if user is logged in before calling internal apis
  var sessionChecker1 = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      next();
    } else {
      res.status(404).send({ message: "Logged out" });
    }
  };
  secureRoutes.use(sessionChecker1);
  app.use("/api/v1", secureRoutes); //version control
  secureRoutes.get("/image", spacecontroller.getImages);
  secureRoutes.get("/image/:nasa_id", spacecontroller.getImages);
  secureRoutes.post("/image", spacecontroller.addImage);
  secureRoutes.delete("/image/:id", spacecontroller.deleteImage);

  // Handle 404
  app.use(function(req, res) {
    res.status(404).render("PageNotFound", {
      errorCode: "404",
      errorMessage: "Page Not Found"
    });
  });

  // Handle 500
  app.use(function(error, req, res, next) {
    // console.log(error);
    res.status(500).render("PageNotFound", {
      errorCode: "500",
      errorMessage: "Internal Server Error",
      error: error
    });
  });
};
