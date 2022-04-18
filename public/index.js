"use strict";
//== Variables
let pagination = 0;
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const display = document.getElementById("outputArea");
const fetchButton = document.getElementById("fetchBtn");
const pokeContainer = document.getElementById("pokeContainer");
const modalBackground = document.getElementById("modal-background");
const modalContainer = document.getElementById("modal-container");
const modalStats = document.getElementById("modal-stats-container");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image-container");
const searchStr = document.getElementById("search");
//====================
const logInOrOutContainer = document.getElementById("login-logout-container");
const openLoginModal = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const closeLoginModal = document.getElementById("close-login-modal");
const loginModalBackground = document.getElementById("login-modal-background");
const signInButton = document.getElementById("signIn-modal-button");
const signInUsername = document.getElementById("signIn-username");
const signInPassword = document.getElementById("signIn-password");
//====================
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const registerEmail = document.getElementById("register-email");
const registerButton = document.getElementById("register-user");
//====================
const avatarContainer = document.getElementById("avatar-container");
const avatarImg = document.getElementById("avatar");
//====================
const registerErrorEl = document.getElementById("register-modal-errors");
const errorMessageEl = document.getElementById("signIn-modal-errors");
const displayUsername = document.getElementById("display-username");

//== Functions
const fetchPokemon = async (name) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const setLocalStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const renderNavBar = () => {
  let user = getLocalStorage("user");
  displayUsername.innerText = `Hello ${user ? user.username : "Guest"}!`;
  if (user) {
    avatarContainer.style.display = "block";
    logoutButton.style.display = "block";
    openLoginModal.style.display = "none";
    loginModalBackground.style.display = "none";
    avatarImg.setAttribute("src", `./images/${user.avatar}.png`);

    // avatarContainer.style.display = "block";
    // logoutButton.style.display = "block";
    // displayUsername.innerText = `Hello ${username}!`;

    // openLoginModal.style.display = "none";
    // loginModalBackground.style.display = "none";
  }
  if (!user) {
    logoutButton.style.display = "none";
    openLoginModal.style.display = "block";
    avatarContainer.style.display = "none";
  }
};

const descriptionFilter = (arr) => {
  let englishOnlyDescription = arr.filter((desc) => {
    return desc.language.name == "en";
  });
  //console.log(englishOnlyDescription);
  let pokeDescription = "";
  let counter = 0;
  englishOnlyDescription.forEach((description) => {
    let lowerCaseDescription = description.flavor_text.toLowerCase();
    if (counter == 3) {
      return pokeDescription;
    }
    if (
      !pokeDescription.toLowerCase().includes(lowerCaseDescription) &&
      !lowerCaseDescription.includes("\f")
    ) {
      pokeDescription += description.flavor_text;
      // uniqueDescriptions.push(description);
      counter++;
    }
  });

  return pokeDescription;
};

const loginUser = async (username, userPassword) => {
  let userObj = { username, userPassword };
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err.message);
  }
};

const loadInitialPokemon = async () => {
  try {
    let output = "";
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=25");
    if (!response) throw new Error("Something went terribly wrong");
    const { results } = await response.json();
    results.forEach(async (result) => {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${result.name}`);
      const poke = await res.json();
      //  console.log("pokemon: ", poke);
      output += `<div id='pokeContainer' data-pokemon=${result.name}> <span data-pokemon=${result.name}>${result.name}</span>
      <img src=${poke.sprites.versions["generation-v"]["black-white"].animated.front_default} alt=${poke.name} data-pokemon=${result.name}></img>
  </div>`;
      display.insertAdjacentHTML("afterbegin", output);
      output = "";
    });
  } catch (err) {
    console.log(err.message);
  }
};

//== Event listeners
fetchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    console.log("searchStr is: ", searchStr.value);
    if (!searchStr.value) return;
    const poke = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchStr.value}`
    );
    if (!poke.ok) {
      display.innerHTML = "";
      throw new Error("That pokemon doesn't exist yet! ¯\\_(ツ)_/¯");
    }
    const data = await poke.json();
    let output = "";
    output += `<div id='pokeContainer' data-pokemon=${searchStr.value}><span id='name' data-pokemon=${searchStr.value}>${searchStr.value}</span> <img src=${data.sprites.versions["generation-v"]["black-white"].animated.front_default} alt='butterfree' data-pokemon=${searchStr.value}></img></div>`;
    display.innerHTML = "";
    display.insertAdjacentHTML("afterbegin", output);
    searchStr.value = "";
  } catch (error) {
    display.insertAdjacentHTML("afterbegin", error.message);
    searchStr.value = "";
    console.log("the error: ", error.message);
  }
});

next.addEventListener("click", async () => {
  try {
    display.innerHTML = "";
    pagination += 25;
    let output = "";
    if (pagination >= 25) {
      previous.removeAttribute("disabled");
    }
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=25&offset=${pagination}`
    );
    const { results } = await response.json();
    results.forEach(async (result) => {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${result.name}`);
      const poke = await res.json();
      output += `<div id='pokeContainer' data-pokemon=${result.name}> 
      <span id='name' data-pokemon=${result.name}>${result.name}</span>
          <img src=${poke.sprites.versions["generation-v"]["black-white"].animated.front_default} alt=${poke.name} data-pokemon=${result.name}></img>
      </div>`;
      display.innerHTML = output;
    });
  } catch (err) {
    console.log(err.message);
  }
});

previous.addEventListener("click", async () => {
  try {
    if (pagination < 26) {
      previous.setAttribute("disabled", true);
    }
    display.innerHTML = "";
    pagination -= 25;
    let output = "";
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=25&offset=${pagination}`
    );
    const { results } = await response.json();
    results.forEach(async (result) => {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${result.name}`);
      const poke = await res.json();
      output += `<div id=pokeContainer data-pokemon=${result.name}> 
      <span id='name' data-pokemon=${result.name}>${result.name}</span>
          <img src=${poke.sprites.versions["generation-v"]["black-white"].animated.front_default} alt=${poke.name} data-pokemon=${result.name}></img>
      </div>`;
      display.innerHTML = output;
    });
  } catch (error) {
    console.error(error);
  }
});

modalContainer.addEventListener("click", async (e) => {
  if (e.target.getAttribute("data-modal"))
    modalBackground.style.display = "none";
});

display.addEventListener("click", async (e) => {
  try {
    if (e.target.getAttribute("data-pokemon")) {
      modalStats.innerHTML = "";
      modalImage.innerHTML = "";
      let pokeImage = "";
      let pokeStats = "";
      modalBackground.style.display = "block";
      const pokemon = e.target.dataset.pokemon;
      const response = await fetchPokemon(pokemon);
      const { types, id } = response;
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}/`
      );
      const { flavor_text_entries } = await data.json();

      let pokeDescription = descriptionFilter(flavor_text_entries);
      // console.log("✈️", pokeDescription);
      pokeImage += `<img src=${response.sprites.other["dream_world"]["front_default"]} alt=${pokemon} id='modal-poke-image' />`;
      pokeStats +=
        types.length > 1
          ? `<h3>${response.name}</h3><button id='modal-close' data-modal='close'>X</button><span>type ${response.types[0].type.name} / ${response.types[1].type.name}</span><br /><div id=modal-stats-description>${pokeDescription}</div>`
          : `<h3>${response.name}</h3><button id='modal-close' data-modal='close'>X</button><span>type ${response.types[0].type.name}</span><br /><div id=modal-stats-description>${pokeDescription}</div>`;
      modalStats.insertAdjacentHTML("afterbegin", pokeStats);
      modalImage.innerHTML = pokeImage;
    }
  } catch (error) {
    console.error(error);
  }
});

openLoginModal.addEventListener("click", () => {
  loginModalBackground.style.display = "block";
});

closeLoginModal.addEventListener("click", () => {
  loginModalBackground.style.display = "none";
});

signInButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = signInUsername.value;
  const password = signInPassword.value;
  if (!username || !password) return;
  try {
    const { token, message, verifiedUser } = await loginUser(
      username,
      password
    );

    if (message) throw new Error(message);
    setLocalStorage("token", token);
    setLocalStorage("user", verifiedUser);

    avatarContainer.style.display = "block";
    displayUsername.innerText = `Hello ${username}!`;
    openLoginModal.style.display = "none";
    loginModalBackground.style.display = "none";
    logoutButton.style.display = "block";
    signInPassword.value = "";
    signInUsername.value = "";
  } catch (error) {
    errorMessageEl.innerText = error.message;
    document
      .getElementById("signIn-modal-container")
      .appendChild(errorMessageEl);
    signInPassword.value = "";
    signInUsername.value = "";
  }
});

signInUsername.addEventListener("input", () => {
  if (errorMessageEl.innerText.length > 0) {
    errorMessageEl.innerText = "";
  }
});

registerButton.addEventListener("click", async (e) => {
  e.preventDefault();
  registerErrorEl.innerText = "";
  let username = registerUsername.value;
  let password = registerPassword.value;
  let email = registerEmail.value;

  try {
    if (!username || !password || !email)
      throw new Error("All fields required.");
    console.log(email, password, username);
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });
    const { verifiedUser, token } = await response.json();

    setLocalStorage("user", verifiedUser);
    setLocalStorage("token", token);
    renderNavBar();
  } catch (error) {
    registerErrorEl.innerText = error.message;
    document
      .getElementById("register-modal-container")
      .appendChild(registerErrorEl);
    registerUsername.value = "";
    registerPassword.value = "";
    registerEmail.value = "";
  }
});
logoutButton.addEventListener("click", () => {
  localStorage.clear();
  displayUsername.innerText = "Hello Guest!";
  logoutButton.style.display = "none";
  openLoginModal.style.display = "block";
  avatarContainer.style.display = "none";
});

loadInitialPokemon();
renderNavBar();
