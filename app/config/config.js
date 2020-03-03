"use strict";
const env = process.env.NODE_ENV || "dev"; // 'dev' or 'test'

const dev = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  db: {
    database: process.env.DB_NAME || "localdb",
    user: process.env.DB_USER || "devuser",
    password: process.env.DB_PASS || "root",
    options: {
      dialect: process.env.DIALECT || "sqlite",
      host: process.env.HOST || "127.0.0.1",
      storage: "./spacetour.sqlite"
    }
  }
};
const production = {
  //TODO
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  db: {
    host: process.env.DB_HOST || process.env.DATABASE_URL || "127.0.0.1",
    database: process.env.DB_NAME || "localdb",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "root"
  }
};

const config = { dev, production };

module.exports = config[env];
