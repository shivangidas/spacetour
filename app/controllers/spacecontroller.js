"use strict";
const model = require("../models");

module.exports.addImage = function(req, res) {
  //console.log(req.body);
  var postData = {
    nasa_id: req.body.nasa_id,
    title: req.body.title,
    description: req.body.description,
    center: req.body.center,
    link: req.body.link,
    location: req.body.location,
    date_created: req.body.date_created
  };

  model.space
    .create(postData)
    .then(function(results) {
      var response = {
        status: 2005,
        code: 200,
        description: "OK",
        message: "Successfully saved!",
        url: req.originalUrl
      };
      response.result = results;
      res.status(200).send(response);
    })
    .catch(function(error) {
      console.log("error in saving image: ", error);
      if (error.name && error.name === "SequelizeValidationError") {
        var response = {
          message: error.errors[0].message
        };
        res.status(403).send(response);
      } else if (error.name && error.name == "SequelizeUniqueConstraintError") {
        var response = {
          status: 1062,
          code: 403,
          description: "Duplicate",
          message: "This image is already saved.",
          url: req.originalUrl,
          result: []
        };
        res.status(403).send(response);
      } else {
        var response = {
          status: 1002,
          code: 403,
          description: "Forbidden",
          message: "DB Unknown error!\nPlease report the problem.",
          url: req.originalUrl,
          result: []
        };
        res.status(403).send(response);
      }
    });
};
module.exports.getImages = function(req, res, con) {
  var filter = {};
  if (req.params.nasa_id) {
    filter.where = {
      nasa_id: req.params.nasa_id
    };
  }
  model.space
    .findAll(filter)
    .then(function(results) {
      var response = {
        status: 2000,
        code: 200,
        description: "OK",
        message: "Successfully Retrieved!",
        url: req.originalUrl
      };
      response.result = results;
      res.status(200).send(response);
    })
    .catch(function(error) {
      var response = {
        status: 1002,
        code: 403,
        description: "Forbidden",
        message: "DBMS Unknown error!\nPlease report the problem.",
        url: req.originalUrl,
        result: []
      };
      res.status(403).send(response);
    });
};
module.exports.deleteImage = function(req, res) {
  model.space
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function(result) {
      if (result == 0) {
        var response = {
          status: 3135,
          code: 404,
          description: "Not Found",
          message: "There is no such image!",
          url: req.originalUrl,
          result: []
        };
        res.status(404).send(response);
      } else {
        var response = {
          status: 2006,
          code: 200,
          description: "OK",
          message: "Successfully deleted!",
          url: req.originalUrl,
          result: []
        };
        res.status(200).send(response);
      }
    })
    .catch(function(error) {
      var response = {
        status: 1002,
        code: 403,
        description: "Forbidden",
        message: "DBMS Unknown error!\nPlease report the problem.",
        url: req.originalUrl,
        result: []
      };
      res.status(403).send(response);
    });
};
