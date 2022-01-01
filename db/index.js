require("dotenv").config();

const { Client } = require("pg");
const { KEY, PASSWORD } = process.env;
const DB_NAME = `${KEY}:${PASSWORD}@localhost:5432/pokedb`;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);

module.exports = client;
