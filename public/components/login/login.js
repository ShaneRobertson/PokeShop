"use strict";

const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const loginUser = async (username, pass) => {
  let userObj = { username, pass };
  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.log("asdfasdfas");
    console.log(err);
  }
};

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = usernameEl.value;
  const password = passwordEl.value;

  const returnedVal = await loginUser(username, password);
  console.log("returned Value in front end: ", returnedVal);

  usernameEl.value = "";
  passwordEl.value = "";
});
