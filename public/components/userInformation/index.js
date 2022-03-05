const usersEmail = document.getElementById("user-details-email");
const usersUsername = document.getElementById("user-details-username");

const getUserInfo = async () => {
  console.log("running getUserInfo");
  try {
    // if (localStorage.getItem("token"))
    let token = JSON.parse(localStorage.getItem("token"));
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const userInformation = response.json();
    console.log("userinfo: ", userInformation);
  } catch (error) {
    console.log(error);
  }
};

getUserInfo();
