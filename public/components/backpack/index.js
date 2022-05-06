"use strict";
//== Variables
const userAvatar = document.querySelector("#avatar");
const backpack = document.querySelector(".bp-overlay");

//== Functions
const renderNav = () => {
  let { avatar } = JSON.parse(localStorage.getItem("user"));
  userAvatar.setAttribute("src", `../../images/${avatar}.png`);
};
const listPokeTypes = (str) => {
  let typeArr = str.split(" ");

  let html = "";
  typeArr.forEach((type) => {
    html += `<img src='/../images/${type}.png' alt=${type} />`;
  });
  console.log("html for icons: ", html);
  return html;
};

const renderPokemon = async () => {
  try {
    let id = JSON.parse(localStorage.getItem("user")).id;
    console.log("id is: ", id);
    const response = await fetch("/api/pokemon", {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
    console.log("here is the response: ", response);
    const backpackPokemon = await response.json();
    let html = "";
    backpackPokemon.forEach((element) => {
      html += `<div class='bp-pokemon-container'>
      <div class='bp-img-container'><img src=${element.pokepic} alt=${
        element.pokename
      } />${listPokeTypes(element.poketype)}</div><span>${
        element.pokename
      }</span>
      </div>`;
    });
    console.log(html);
    backpack.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    console.log("Render Backpack Pokemon Error: ", err);
  }
};

renderNav();
renderPokemon();
