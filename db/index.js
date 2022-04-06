require("dotenv").config();

const { Client } = require("pg");
const { KEY, PASSWORD } = process.env;
const DB_NAME = `${KEY}:${PASSWORD}@localhost:5432/pokedb`;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);
//need to compare username and
async function getUser(username, dbUserPassword) {
  try {
    const {
      rows: [row],
    } = await client.query(
      `
      SELECT * FROM users WHERE username=$1
    `,
      [username]
    );

    if (row.password != dbUserPassword) return;
    return row;
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  getUser,
  client,
};
