require("dotenv").config();
const client = require("./client");

const dropTables = async () => {
  try {
    const SQL = `DROP TABLE IF EXISTS users`;
    await client.query(SQL);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const createTables = async () => {
  try {
    const SQL = `
              CREATE TABLE users(id SERIAL PRIMARY KEY,
              firstname VARCHAR(64),
              lastname VARCHAR(64),
              password VARCHAR(256) NOT NULL,
              email VARCHAR(64) UNIQUE NOT NULL
              )
          `;
    await client.query(SQL);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const init = async () => {
  try {
    client.connect();
    console.log("DROPPING TABLES...");
    await dropTables();
    console.log("TABLES DROPPED.");
    console.log("CREATING TABLES...");
    await createTables();
    console.log("TABLES CREATED!");
  } catch (err) {
    throw new Error(err);
  } finally {
    client.end();
  }
};

init();
