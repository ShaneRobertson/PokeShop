// all the functions for http request go here using axios, then they get exported
//const axios = require("axios");
import axios from "axios";
export async function userLogin(name, pass) {
  try {
    if (name && pass) {
      let userObj = { name, pass };
      const data = await axios.post("/login", userObj);
      console.log("data in the api: ", data);
    }
  } catch (err) {
    throw err;
  }
}
