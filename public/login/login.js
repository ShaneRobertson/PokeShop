const userLogin = require("../../api");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("hello");
  const username = usernameEl.value;
  const password = passwordEl.value;

  const returnedVal = await userLogin(username, password);
  console.log("returned Value in front end: ", returnedVal);

  usernameEl.value = "";
  passwordEl.value = "";
});
