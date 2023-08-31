// API Call --------------------------------
const baseUrl = `http://localhost:3000/api/`;

const logInForm = document.getElementById("login-form");
const messageBox = document.getElementById("message-box");

// form submit event -------------------------------

logInForm.addEventListener("submit", userLogIn);

async function userLogIn(e) {
  e.preventDefault();

  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;

  //   Message Toast
  async function toastMessage(color, param) {
    var message = document.createElement("Div");
    message.className = `bg-${color}-subtle p-3 fw-medium text-${color} rounded`;
    message.appendChild(document.createTextNode(param));
    messageBox.appendChild(message);
  }

  // Adding user in backend
  try {
    const result = await axios.post(`${baseUrl}login`, {
      userEmail: email,
      userPassword: password,
    });
    console.log(result.data.data);
    toastMessage("success", `Log In Success`);
    console.log("TOKEN :", result.data.data.userName);
    localStorage.setItem("userIdToken", result.data.token);
    localStorage.setItem("userName", result.data.data.userName);
    localStorage.setItem("ispremiumuser", result.data.data.ispremiumuser);
    console.log(`logged in successfully `);
    location.href = "../index.html";
  } catch (error) {
    console.log("Error", error);
    let notifyText = "";
    ``;
    if (error.response.status === 401) notifyText = "Password Is Incorrect !!";
    toastMessage("danger", notifyText);
  }

  //   cleaning input fields
  logInForm.userEmail.value = "";
  logInForm.userPassword.value = "";
}

// FORGOT PASSWORD -----------------------------

const forgotPassoword = document.getElementById("forgotPassoword");
const resetPassForm = document.getElementById("resetPassword-form");

forgotPassoword.addEventListener("click", openResetPassForm);
resetPassForm.addEventListener("submit", resetPassword);

function openResetPassForm(e) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("resetPassword-form").style.display = "block";
}

async function resetPassword(e) {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;
  console.log("RESET", email);

  // API call

  try {
    const response = await axios.post(`${baseUrl}password/forgotpassword `, {
      email: email,
    });
    console.log("PassReset Res >>", response);
  } catch (error) {
    console.log(error);
  }
}
