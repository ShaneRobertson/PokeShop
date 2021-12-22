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
  console.log(englishOnlyDescription);
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
      console.log("pokemon: ", poke);
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
      // const descData = await fetch(
      //   `https://pokeapi.co/api/v2/characteristic/${id}/`
      // );
      // const result = await descData.json();
      // console.log("result is: ", result);
      // console.log(flavor_text_entries);
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

loadInitialPokemon();
