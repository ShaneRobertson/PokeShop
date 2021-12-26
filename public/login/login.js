const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = usernameEl.value;
  const password = passwordEl.value;

  console.log(username, password);

  usernameEl.value = "";
  passwordEl.value = "";
});
