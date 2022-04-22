"use strict";
//== Variables
const userAvatar = document.querySelector("#avatar");

//== Functions
const renderNav = () => {
  let { avatar } = JSON.parse(localStorage.getItem("user"));
  userAvatar.setAttribute("src", `../../images/${avatar}.png`);
};

renderNav();
