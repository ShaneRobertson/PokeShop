const emailElement = document.getElementById("user-details-email");
const usernameElement = document.getElementById("user-details-username");
const updateInfoBtn = document.getElementById("update");

const getUserInfo = async () => {
  console.log("running getUserInfo");
  try {
    // if (localStorage.getItem("token"))
    let token = JSON.parse(localStorage.getItem("token"));
    if (!token)
      throw new Error(
        "UNAUTHORIZED ACCESS ATTEMPT! AUTH CODE: A22KJBB444B07713K**"
      );
    // const response = await fetch("/api/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     authorization: `Bearer ${token}`,
    //   },
    // });

    // const userInformation = await response.json();
    // console.log("userinfo: ", userInformation);
    const { username, email } = JSON.parse(localStorage.getItem("user"));
    emailElement.setAttribute("placeholder", email);
    usernameElement.setAttribute("placeholder", username);
  } catch (error) {
    console.log(error);
  }
};

updateInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let updatedUsername = usernameElement.value;
  let updatedEmail = emailElement.value;
  console.log("user", updatedUsername, "email", updatedEmail);
});

getUserInfo();
