const express = require("express");
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const path = require("path");
server.use("/static", express.static(path.join(__dirname, "/public")));

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
  console.log(__dirname);
});
