require("dotenv").config();
const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  getUser,
  updateUser,
  registerUser,
  addToBackpack,
  getBackpackPokemon,
} = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

function verifyToken(req, res, next) {
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
    console.log("error is: ", error.message);
  }
});

//-- Updates the users indicative data (email or username for now)
apiRouter.patch("/users", verifyToken, async (req, res) => {
  let { id } = req.body;
  let userObj = {};

  for (const key in req.body) {
    if (key != "id" && req.body[key]) {
      userObj[key] = req.body[key];
    }
  }
  console.log("userObj is: ", userObj);
  try {
    const response = await updateUser(userObj, id);
    console.log("response in routes: ", response);
    let updatedUser = {};
    //loop over the user and takeout the password
    for (const key in response) {
      if (key != "password") {
        updatedUser[key] = response[key];
      }
    }
    res.json(updatedUser);
  } catch (error) {
    console.log("error in routes 63: ", error.message);
  }
});

//-- Updates the users avatar
apiRouter.patch("/users/avatar", verifyToken, async (req, res) => {
  try {
    let { avatar, id } = req.body;
    const updated = await updateUser({ avatar }, id);
    console.log("updates: ", updated);
    res.json(updated);
  } catch (error) {
    console.log("error is: ", error.message);
  }
});

//-- Register a new user
apiRouter.post("/users/register", async (req, res) => {
  console.log("❤️", req.body);
  let { username, password, email } = req.body;
  let newUser = {
    username,
    password,
    email,
  };
  try {
    const response = await registerUser(newUser);
    console.log("response from db: ", response);
    let verifiedUser = {};
    //loop over the user and takeout the password
    for (const key in response) {
      if (key != "password") {
        verifiedUser[key] = response[key];
      }
    }
    console.log(typeof verifiedUser);
    jwt.sign({ verifiedUser }, process.env.jwtSecret, (err, token) => {
      if (err) res.send({ error: err, status: 403 });

      res.json({ verifiedUser, token });
    });
  } catch (error) {
    console.log("errror in the routes: ", error.message);
    console.log(error.message);
  }
});

//-- Add pokemon to backpack
apiRouter.post("/backpack", verifyToken, async (req, res) => {
  console.log("req.body is: ", req.body);
  try {
    const pokemon = await addToBackpack(req.body);
    console.log("pokemon in routes: ", pokemon);
    res.send(pokemon);
  } catch (error) {
    console.log("error in routes: ", error.message);
  }
});

//-- Get all pokemon from backpack
apiRouter.post("/pokemon", verifyToken, async (req, res) => {
  console.log;
  console.log("id in routes: ", req.body);
  let { id } = req.body;
  try {
    const result = await getBackpackPokemon(id);
    console.log("result from the DB: ", result);
    res.send(result);
  } catch (err) {
    console.log("Error in the routes: ", err.message);
  }
});
module.exports = apiRouter;
