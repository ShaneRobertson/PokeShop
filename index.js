const express = require("express");
const server = express();
const apiRouter = require("./routes");
const morgan = require("morgan");
const { client } = require("./db/index.js");

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/api", apiRouter);

const path = require("path");
server.use(express.static(path.join(__dirname, "public")));

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`server is listening on port: ${PORT}`);
  try {
    client.connect();
    console.log("Connected to the pokedb!");
  } catch (err) {
    console.log("pokedb closed for repairs: ", err);
  }
});
