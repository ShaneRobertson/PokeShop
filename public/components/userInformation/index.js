const emailElement = document.getElementById("user-details-email");
const usernameElement = document.getElementById("user-details-username");
const avatarContainer = document.getElementById("avatar-container");
const currentAvatar = document.getElementById("avatar-current");
const avatarChoices = document.getElementById("avatar-choices");
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

currentAvatar.addEventListener("click", async () => {
  if (avatarChoices.hasChildNodes()) return;
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
  let output = "";
  avatarOptions.forEach((option) => {
    output += `<img src='../../images/${option}.png' alt='avatar' id='avatar-choice' data-choice=${option} />`;
  });
  avatarChoices.insertAdjacentHTML("afterbegin", output);
});

avatarContainer.addEventListener("mouseleave", () => {
  avatarChoices.innerHTML = "";
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
      console.log("updated data line: ", data);
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
