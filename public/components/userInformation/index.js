const emailElement = document.getElementById("user-details-email");
const usernameElement = document.getElementById("user-details-username");
const avatarContainer = document.getElementById("avatar-container");
const avatarChoicesContainer = document.getElementById(
  "avatar-choices-container"
);
const currentAvatar = document.getElementById("avatar-current");
const avatarOverlay = document.getElementById("avatar-overlay");
const updateInfoBtn = document.getElementById("update");

const getUserInfo = async () => {
  console.log("running getUserInfo");
  try {
    // if (localStorage.getItem("token"))

    if (!JSON.parse(localStorage.getItem("token")))
      throw new Error(
        "UNAUTHORIZED ACCESS ATTEMPT! VIOLATION CODE: A22KJBB444B07713K**"
      );

    const { username, email, avatar } = JSON.parse(
      localStorage.getItem("user")
    );
    console.log(avatar);
    emailElement.setAttribute("placeholder", email);
    usernameElement.setAttribute("placeholder", username);
    currentAvatar.setAttribute("src", `../../images/${avatar}.png`);
  } catch (error) {
    console.log(error);
  }
};

const avatarOptions = [
  "avatar0",
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
  "avatar7",
];
const renderAvatarChoices = (avatarArr, currentAv) => {
  let output = "";
  avatarArr.forEach((option) => {
    output +=
      currentAv === option
        ? `<div class='avatar-choice current'><img src='../../images/${option}.png' alt='avatar' id='avatar-choice-img' data-choice=${option} /></div>`
        : `<div class="avatar-choice"><img src='../../images/${option}.png' alt='avatar' id='avatar-choice-img' data-choice=${option} /></div>`;
  });
  avatarChoicesContainer.insertAdjacentHTML("afterbegin", output);
};

currentAvatar.addEventListener("click", async () => {
  let { avatar } = JSON.parse(localStorage.getItem("user"));
  console.log(avatarChoicesContainer.childNodes);
  if (avatarChoicesContainer.hasChildNodes()) return;

  renderAvatarChoices(avatarOptions, avatar);
});

avatarContainer.addEventListener("mouseleave", () => {
  avatarChoicesContainer.innerHTML = "";
});
avatarContainer.addEventListener("click", async (e) => {
  let selectedAvatar = e.target.dataset.choice;
  let id = JSON.parse(localStorage.getItem("user")).id;
  try {
    if (selectedAvatar) {
      const response = await fetch("/api/users/avatar", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: selectedAvatar,
          id,
        }),
      });

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      await getUserInfo();
      let { avatar } = JSON.parse(localStorage.getItem("user"));
      avatarChoicesContainer.innerHTML = "";
      renderAvatarChoices(avatarOptions, avatar);
    }
  } catch (error) {
    console.log(error);
  }
});

updateInfoBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let username = usernameElement.value;
  let email = emailElement.value;
  let id = JSON.parse(localStorage.getItem("user")).id;

  try {
    if (!username && !email) return;

    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, id }),
    });
    const updatedUser = await response.json();
    console.log(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    usernameElement.value = "";
    emailElement.value = "";
    await getUserInfo();
  } catch (error) {
    console.log("Error is: ", error);
  }
});

getUserInfo();
