const getUserInfo = async () => {
  try {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      console.log("token type: ", typeof token);
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const userInformation = await response.json();
      console.log(userInformation);
    }
  } catch (error) {
    console.log(error);
  }
};

// const loginUser = async (username, userPassword) => {
//     let userObj = { username, userPassword };
//     try {
//       const response = await fetch("/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userObj),
//       });
//       const result = await response.json();
//       return result;
//     } catch (err) {
//       console.log("asdfasdfas");
//       console.log(err);
//     }
//   };

getUserInfo();
