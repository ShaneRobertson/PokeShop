require("dotenv").config();
const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

// verify headers in token
// middleware for token verification
// move on to next() function
function verifyToken(req, res, next) {
  console.log("verify token function");
  console.log("request headers: ", req.headers);
  //get Auth header
  const bearerToken = req.headers["authorization"].split(" ")[1];
  console.log("🔴", bearerToken);

  if (bearerToken == "null") {
    console.log("no token.....");
    res.sendStatus(403);
    next();
  } else {
    req.token = bearerToken;
    console.log("token is:", bearerToken);
    next();
  }
}

apiRouter.post("/login", async (req, res) => {
  const { username, userPassword } = req.body;
  try {
    const response = await getUser(username, userPassword);
    if (!response)
      res.send({ message: "Username or password invalid. Please try again." });
    let verifiedUser = {};
    //loop over the user and takeout the password
    for (const key in response) {
      if (key != "password") {
        verifiedUser[key] = response[key];
      }
    }
    jwt.sign({ verifiedUser }, process.env.jwtSecret, (err, token) => {
      if (err) res.send({ error: err, status: 403 });

      res.json({ verifiedUser, token });
    });
  } catch (error) {
    console.log("Routes | 38: ", error.message);
  }
});

apiRouter.post("/users", verifyToken, async (req, res, next) => {
  const {
    returnedUser: { username },
  } = jwt.verify(req.token, process.env.jwtSecret);
  const response = await getUser(username);

  console.log("response is: ", response);
});

module.exports = apiRouter;
