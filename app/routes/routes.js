"use strict";
// const model = require("../models");
const spacecontroller = require("../controllers/spacecontroller");
module.exports = function(app, secureRoutes) {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.use("/api/v1", secureRoutes); //version control
  secureRoutes.get("/image", spacecontroller.getImages);
  secureRoutes.get("/image/:nasa_id", spacecontroller.getImages);
  secureRoutes.post("/image", spacecontroller.addImage);
  secureRoutes.delete("/image/:id", spacecontroller.deleteImage);
};
