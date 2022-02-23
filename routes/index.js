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
  //get Auth header
  const bearerHeader = req.headers["authorization"];
  // console.log("bearerheader", bearerHeader);
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    //  console.log("bearer", bearer);
    // get token on index 1 from array
    const bearerToken = bearer[1];
    // console.log("bearertoken", bearerToken);
    // adding token to req object - set token
    req.token = bearerToken;
    console.log("token is:", bearerToken);
    next();
    // send forbidden error status code
  } else {
    console.log("no token.....");
    res.sendStatus(403);
  }
}

apiRouter.post("/login", async (req, res, next) => {
  const { username, userPassword } = req.body;

  try {
    const loggedInUser = await getUser(username);
    if (loggedInUser.length > 0) {
      const [{ password: dbPassword }] = loggedInUser;
      if (dbPassword == userPassword) {
        const [theUser] = loggedInUser;
        let returnedUser = {};
        for (const key in theUser) {
          if (key != "password") {
            returnedUser[key] = theUser[key];
          }
        }
        jwt.sign({ loggedInUser }, process.env.jwtSecret, (err, token) => {
          if (err) {
            res.send({ error: err, status: 403 });
          } else {
            res.json({ loggedInUser, token });
          }
        });
      } else {
        res.send({ message: "Username or password invalid. Try again." });
      }
    } else {
      res.send({ message: "Username or password invalid. Try again." });
    }
  } catch (err) {
    console.log("error in routes: ", err);
  }
});

apiRouter.post("/users", verifyToken, async (req, res, next) => {
  console.log("token verified: ", req.headers);
});

module.exports = apiRouter;
