const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    const hashedPwd = await bcrypt.hash(password, SALT_ROUNDS);
    const SQL = `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *`;
    const {
      rows: [user],
    } = await client.query(SQL, [
      firstname || "firstname",
      lastname || "lastname",
      email,
      hashedPwd,
    ]);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserByEmail = async (email) => {
  try {
    const SQL = `SELECT * FROM users WHERE email=$1`;
    const {
      rows: [user],
    } = await client.query(SQL, [email]);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const getUser = async ({ email, password }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return;
    const hashedPwd = existingUser.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPwd);
    if (!passwordsMatch) return;
    delete existingUser.password;
    return existingUser;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`SELECT * FROM users`);
    return rows;
  } catch (error) {
    throw new Error(err);
  }
};

module.exports = { createUser, getUserByEmail, getUser, getAllUsers };
