require("dotenv").config();

const { Client } = require("pg");
const { KEY, PASSWORD } = process.env;
const DB_NAME = `${KEY}:${PASSWORD}@localhost:5432/pokedb`;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);

async function getUser(userObject) {
  const { username, pass } = userObject;

  try {
    const { rows } = await client.query(
      `
      SELECT * FROM users WHERE username=$1
    `,
      [username]
    );
    console.log("rows are: ", rows);
    return rows;
  } catch (err) {
    console.err(err);
    throw error;
  }
}
module.exports = {
  getUser,
  client,
};
