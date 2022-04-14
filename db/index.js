require("dotenv").config();

const { set } = require("express/lib/application");
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
      SELECT * FROM users WHERE username=$1;
    `,
      [username]
    );

    if (row.password != dbUserPassword) return;
    return row;
  } catch (error) {
    console.log(error.message);
  }
}

async function getUserById(id) {
  try {
    const rows = client.query(
      `
      SELECT * FROM users 
      WHERE id=$1
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log("error in db is: ", error.message);
  }
}

async function updateUser(userObj, id) {
  try {
    const setString = Object.keys(userObj)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
    // console.log("setString in DB is: ", setString);

    const {
      rows: [user],
    } = await client.query(
      `
          UPDATE users
          SET ${setString}
          WHERE id = ${id}
          RETURNING *;
      `,
      Object.values(userObj)
    );

    // console.log("user in DB: ", user);
    return user;
  } catch (error) {
    console.log("error in DB 68: ", error.message);
    throw error;
  }
}

module.exports = {
  getUser,
  updateUser,
  client,
};
