const emailElement = document.getElementById("user-details-email");
const usernameElement = document.getElementById("user-details-username");
const updateInfoBtn = document.getElementById("update");

const getUserInfo = async () => {
  console.log("running getUserInfo");
  try {
    // if (localStorage.getItem("token"))

    if (!JSON.parse(localStorage.getItem("token")))
      throw new Error(
        "UNAUTHORIZED ACCESS ATTEMPT! AUTH CODE: A22KJBB444B07713K**"
      );

    const { username, email } = JSON.parse(localStorage.getItem("user"));
    emailElement.setAttribute("placeholder", email);
    usernameElement.setAttribute("placeholder", username);
  } catch (error) {
    console.log(error);
  }
};

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
