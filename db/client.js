const pg = require("pg");

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = client;
