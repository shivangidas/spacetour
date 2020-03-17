"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
const db = {};
const Op = Sequelize.Op; //remove the warning message

// Database
let sequelize;
if (process.env.NODE_ENV == "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    operatorsAliases: Op,
    logging: false, //the query that is logged in console. remove when debugging
    dialectOptions: {
      ssl: true
    }
  });
} else {
  sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
      host: config.db.options.host,
      dialect: config.db.options.dialect,
      storage: config.db.options.storage,
      logging: false, //the query that is logged in console. remove when debugging
      operatorsAliases: Op
    }
  );
}

fs.readdirSync(__dirname)
  .filter(
    file =>
      //file !== 'index.js'
      file.indexOf(".") !== 0 && file !== "index.js" && file !== "relations.js"
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// relationships/associations described here
require("./relations")(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
