const { client } = require("./index");

//This file is used to seed the database

async function buildTables() {
  try {
    client.connect();

    //Drop the tables
    console.log("Dropping Tables...");
    await client.query(`
        DROP TABLE IF EXISTS pokemon;
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping all the tables.");

    //Build the tables
    console.log("Building user table..");
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE,
      isadmin BOOLEAN DEFAULT false,
      avatar VARCHAR(250) DEFAULT 'avatar0'
    );
    `);
    console.log("Building pokemon table..");
    await client.query(`
      CREATE TABLE pokemon(
        id SERIAL PRIMARY KEY,
        pokename VARCHAR(50),
        pokepic VARCHAR(250),
        ownerid INTEGER REFERENCES users(id)
      );
      `);
    console.log("Finished building the tables!");
  } catch (err) {
    throw err;
  }
}

async function populateInitialData() {
  try {
    const { rows } = await client.query(`
      INSERT INTO users(username, password, email, isadmin) VALUES
      ('buzzlightyear', 'starcommand', 'buzz@gmail.com', true),
      ('woody', 'rodeo', 'wood@gmail.com', true),
      ('slink', 'hotdog', 'longdog@yahoo.com', false)
      RETURNING *;      
  `);

    console.log("Users have been added: ", rows);
  } catch (err) {
    throw err;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.log)
  .finally(() => client.end());
