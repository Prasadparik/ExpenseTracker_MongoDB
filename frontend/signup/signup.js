// API Call --------------------------------
const baseUrl = `http://localhost:3000/api/`;

const signUpForm = document.getElementById("signup-form");
const messageBox = document.getElementById("message-box");

// form submit event -------------------------------

signUpForm.addEventListener("submit", userSignUp);

async function userSignUp(e) {
  e.preventDefault();

  let name = document.getElementById("userName").value;
  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;

  //   Message Toast
  function toastMessage(color, param) {
    let message = document.createElement("Div");
    message.className = `bg-${color}-subtle p-3 fw-medium text-${color} rounded`;
    message.appendChild(document.createTextNode(param));
    messageBox.appendChild(message);
  }

  // Adding user in backend
  try {
    const result = await axios.post(`${baseUrl}signup`, {
      userName: name,
      userEmail: email,
      userPassword: password,
    });
    toastMessage("success", `${name} is added successfully`);
    console.log(`${result.data} added successfully`);
  } catch (error) {
    console.log("Error", error);
    toastMessage("danger", error.response.data);
  }

  // location.href = "../login/login.html";

  //   cleaning input fields
  signUpForm.userName.value = "";
  signUpForm.userEmail.value = "";
  signUpForm.userPassword.value = "";
}
