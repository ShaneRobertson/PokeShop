"use strict";

let pagination = 0;
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const display = document.getElementById("outputArea");
const fetchButton = document.getElementById("fetchBtn");
const pokeContainer = document.getElementById("pokeContainer");
const modalBackground = document.getElementById("modal-background");
const modalStats = document.getElementById("modal-stats-container");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image-container");
const searchStr = document.getElementById("search");
const openLoginModal = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const closeLoginModal = document.getElementById("close-login-modal");
const loginModalBackground = document.getElementById("login-modal-background");
const signInButton = document.getElementById("signIn-modal-button");
const signInUsername = document.getElementById("signIn-username");
const signInPassword = document.getElementById("signIn-password");
const errorMessageEl = document.getElementById("signIn-modal-errors");
const displayUsername = document.getElementById("display-username");
//change the html to use id instead of class

const fetchPokemon = async (name) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
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

const loadInitialPokemon = async () => {
  try {
    let output = "";
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10");
    const { results } = await response.json();
    results.forEach(async (result) => {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${result.name}`);
      const poke = await res.json();
      //  console.log("pokemon: ", poke);
      output += `<div id='pokeContainer' data-pokemon=${result.name}> <span data-pokemon=${result.name}>${result.name}</span>
      <img src=${poke.sprites.versions["generation-v"]["black-white"].animated.front_default} alt=${poke.name} data-pokemon=${result.name}></img>
  </div>`;
      display.innerHTML = output;
    });
  } catch (err) {
    console.error(err);
  }
};

fetchButton.addEventListener("click", async () => {
  try {
    const poke = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchStr.value}`
    );
    if (poke.ok) {
      const data = await poke.json();
      let output = "";
      output += `<div id='pokeContainer' data-pokemon=${searchStr.value}><span id='name' data-pokemon=${searchStr.value}>${searchStr.value}</span> <img src=${data.sprites.versions["generation-v"]["black-white"].animated.front_default} alt='butterfree' data-pokemon=${searchStr.value}></img></div>`;

      document.getElementById("outputArea").innerHTML = output;
      searchStr.value = "";
    } else {
      document.getElementById("outputArea").innerHTML = "¯\\_(ツ)_/¯";
    }
  } catch (error) {
    console.log("the error: ", error);
  }
});

next.addEventListener("click", async () => {
  try {
    display.innerHTML = "";
    pagination += 10;
    let output = "";
    if (pagination >= 10) {
      previous.removeAttribute("disabled");
    }
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${pagination}`
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
    console.error(err);
  }
});

previous.addEventListener("click", async () => {
  try {
    if (pagination < 11) {
      previous.setAttribute("disabled", true);
    }
    display.innerHTML = "";
    pagination -= 10;
    let output = "";
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${pagination}`
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

display.addEventListener("click", async (e) => {
  // console.log("the dataSet: ", e.target.dataset);
  try {
    if (
      e.target.getAttribute("data-pokemon")
      // e.target.getAttribute("id") == "pokeContainer" ||
      // e.target.getAttribute("alt")
    ) {
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
          ? `<h3>${response.name}</h3><span>type ${response.types[0].type.name} / ${response.types[1].type.name}</span><br /><div id=modal-stats-description>${pokeDescription}</div>`
          : `<h3>${response.name}</h3><span>type ${response.types[0].type.name}</span><br /><div id=modal-stats-description>${pokeDescription}</div>`;
      modalStats.innerHTML = pokeStats;
      modalImage.innerHTML = pokeImage;
    }
  } catch (error) {
    console.error(error);
  }
});

modalClose.addEventListener("click", async () => {
  modalBackground.style.display = "none";
});

openLoginModal.addEventListener("click", () => {
  loginModalBackground.style.display = "block";
});

closeLoginModal.addEventListener("click", () => {
  loginModalBackground.style.display = "none";
});

const loginUser = async (username, userPassword) => {
  let userObj = { username, userPassword };
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

signInButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = signInUsername.value;
  const password = signInPassword.value;

  const { token, err, message } = await loginUser(username, password);
  console.log("token: ", token, "err: ", err, "message: ", message);

  if (token) {
    localStorage.setItem("token", JSON.stringify(token));
    displayUsername.innerText = `Hello ${username}!`;
    openLoginModal.style.display = "none";
    logoutButton.style.display = "block";
    loginModalBackground.style.display = "none";
  }
  if (message) {
    errorMessageEl.innerText = message;
    document
      .getElementById("signIn-modal-container")
      .appendChild(errorMessageEl);
  }

  signInPassword.value = "";
  signInUsername.value = "";
});

signInUsername.addEventListener("input", () => {
  if (errorMessageEl.innerText.length > 0) {
    errorMessageEl.innerText = "";
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  displayUsername.innerText = "Hello Guest!";
  logoutButton.style.display = "none";
  openLoginModal.style.display = "block";
});
loadInitialPokemon();
