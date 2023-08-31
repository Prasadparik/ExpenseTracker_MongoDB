// API URL ====================================================

const baseUrl = `http://localhost:3000/api/expense`;

// ===========================================================
const addExpenseFrom = document.getElementById("addExpenseFrom");
const expenseTable = document.getElementById("expenseTable");
const displayUserName = document.getElementById("displayUserName");
// const premium = document.getElementById("rzp-button1");

// displayUserName
let b = document.createElement("b");
b.appendChild(
  document.createTextNode(`👋 ${localStorage.getItem("userName")}`)
);
displayUserName.appendChild(b);

// form submit event ------------------
addExpenseFrom.addEventListener("submit", addExpenseToDB);
// Delete Event
expenseTable.addEventListener("click", deleteExpense);
// Edit Event
expenseTable.addEventListener("click", editExpense);
// Buy Premium Event
// premium.addEventListener("click", buyPremium);

// addExpenseToDB--------------------------------

async function addExpenseToDB(e) {
  e.preventDefault();

  // getting input values
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const expenseObj = {
    amount: amount,
    category: category,
    description: description,
  };

  //   Sending data to Backend
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.post(baseUrl, expenseObj, {
      headers: { Authorization: token },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  location.reload();
  //   clear input fields
  addExpenseFrom.amount.value = "";
  addExpenseFrom.category.value = "";
  addExpenseFrom.description.value = "";
}

// Get Data From Backend ===========================================

async function getAllExpenseFormBE(page = 1, row = 5) {
  const token = localStorage.getItem("userIdToken");
  const filter = localStorage.getItem("filter");
  try {
    const resData = await axios.get(`${baseUrl}?page=${page}&limit=${row}`, {
      headers: { Authorization: token, filter: filter },
    });
    console.log("PAGINATED RES >>", resData);
    Pagination(resData.data);
    expenseTable.textContent = "";
    ShowDataOnFE(resData.data.expenseData);

    // filters ========================
    document.getElementById("filterName").innerHTML = `${localStorage.getItem(
      "filter"
    )}`;
    document.getElementById("rowNumber").innerHTML = `${localStorage.getItem(
      "rows"
    )}`;
    const allFilter = document.getElementById("allFilter");
    allFilter.addEventListener("click", () => {
      localStorage.setItem("filter", "all");
      location.reload();

      ShowDataOnFE(resData.data.expenseData);
    });

    const dailyFilter = document.getElementById("dailyFilter");
    dailyFilter.addEventListener("click", () => {
      localStorage.setItem("filter", "daily");
      location.reload();
      ShowDataOnFE(resData.data.expenseData);
    });
    const monthlyFilter = document.getElementById("monthlyFilter");
    monthlyFilter.addEventListener("click", () => {
      localStorage.setItem("filter", "monthly");
      location.reload();
      ShowDataOnFE(resData.data.expenseData);
    });
    const yearlyFilter = document.getElementById("yearlyFilter");
    yearlyFilter.addEventListener("click", () => {
      localStorage.setItem("filter", "yearly");
      location.reload();
      ShowDataOnFE(resData.data.expenseData);
    });
  } catch (error) {
    console.log(error);
  }
}
getAllExpenseFormBE();

// ShowDataOnFE =====================================================

async function ShowDataOnFE(data) {
  // Date  Filter--------------
  // mapping the elements
  data.map((data) => {
    let tr = document.createElement("tr");
    let tdAmount = document.createElement("td");
    let tdCategory = document.createElement("td");
    let tdDescription = document.createElement("td");

    let tdEdit = document.createElement("td");
    let tdDelete = document.createElement("td");
    let tdID = document.createElement("td");
    tdID.style.display = "none";

    let btnEdit = document.createElement("edit");
    let btnDelete = document.createElement("delete");
    btnEdit.className = "btn btn-outline-dark edit";
    btnDelete.className = "btn btn-outline-danger delete";
    btnEdit.appendChild(document.createTextNode("Edit"));
    btnDelete.appendChild(document.createTextNode("Delete"));

    tdAmount.appendChild(document.createTextNode(data.amount));
    tdCategory.appendChild(document.createTextNode(data.category));
    tdDescription.appendChild(document.createTextNode(data.description));
    tdEdit.appendChild(btnEdit);
    tdDelete.appendChild(btnDelete);
    tdID.appendChild(document.createTextNode(data._id));

    tr.appendChild(tdAmount);
    tr.appendChild(tdDescription);
    tr.appendChild(tdCategory);

    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);
    tr.appendChild(tdID);

    return expenseTable.appendChild(tr);
  });
}

// Dlete Expense From Backend ===========================================

async function deleteExpense(e) {
  if (e.target.classList.contains("delete"))
    if (confirm("Are you sure you want to delete ?"))
      var li = e.target.parentElement.parentElement;
  // --------------------------------
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.delete(
      `${baseUrl}/${li.childNodes[5].innerText}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  expenseTable.removeChild(li);
}

// EDIT Expense From Backend ===========================================

async function editExpense(e) {
  if (e.target.classList.contains("edit"))
    if (confirm("Are you sure you want to Edit ?"))
      var li = e.target.parentElement.parentElement;
  // --------------------------------

  // Getting Edit data from BE
  let id = li.childNodes[5].innerText;
  let amount = li.childNodes[0].innerText;
  let description = li.childNodes[1].innerText;
  let category = li.childNodes[2].innerText;
  console.log(id, amount, description, category);

  //   Fill input fields
  addExpenseFrom.amount.value = amount;
  addExpenseFrom.category.value = category;
  addExpenseFrom.description.value = description;
  // ------------------------
  // DELETING EXPENSE FROM BE
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.delete(
      `${baseUrl}/${li.childNodes[5].innerText}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  expenseTable.removeChild(li);
}

// Ckeck Is Premium Account =====================================
function checkForPremiumAccount(params) {
  const token = localStorage.getItem("userIdToken");

  const decodeJwtToken = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const checkIsPremium = decodeJwtToken(token).ispremiumuser;
  console.log(checkIsPremium);

  if (checkIsPremium) {
    document.getElementById("premiumMessage").style.display = "block";
    document.getElementById("rzp-button1").style.display = "none";
    document.getElementById("LeaderboardList").style.display = "block";
    document.getElementById("download").style.display = "block";
    document.getElementById("DownloadList").style.display = "block";
  } else {
    document.getElementById("rzp-button1").style.display = "block";
    // document.getElementById("LeaderboardList").style.display = "none";
    document.getElementById("download").style.display = "none";
    document.getElementById("DownloadList").style.display = "none";
  }
}
checkForPremiumAccount();
// ZAZORPAY  ------------------------------------------------

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("userIdToken");

  const response = await axios.get("http://localhost:3000/api/purchase", {
    headers: { Authorization: token },
  });

  console.log("RES ORDER ID::", response.data.order.orderid);

  var options = {
    key: response.data.key_id,
    order_id: response.data.order.orderid,

    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/api/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      alert("You are a Premium User Now");
      console.log("RESS>>", res);

      localStorage.setItem("userIdToken", res.data.token);
      checkForPremiumAccount();
    },
  };
  var rzp1 = new Razorpay(options);
  e.preventDefault();
  rzp1.open();
};

// Download Report ============================================================
let download = document.getElementById("download");
download.addEventListener("click", downloadReport);
async function downloadReport() {
  const token = localStorage.getItem("userIdToken");
  try {
    console.log("Download clicked");
    const response = await axios.get(
      "http://localhost:3000/api/expense/download",
      {
        headers: { Authorization: token },
      }
    );
    location.href = response.data.fileUrl;
    console.log("Download: >>", response.data.fileUrl);
  } catch (error) {
    console.error(error);
  }
}

// Pagination ===============================================

function Pagination(data) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let row = localStorage.getItem("rows");

  if (data.hasPreviousPage) {
    let btn1 = document.createElement("button");
    btn1.innerHTML = `< ${data.previousPage}`;
    btn1.className = "btn bg-dark-subtle fw-medium px-4 m-2";
    pagination.appendChild(btn1);
    btn1.addEventListener("click", () =>
      getAllExpenseFormBE(data.previousPage, row)
    );
  }

  let btn2 = document.createElement("button");
  btn2.innerHTML = data.currentPage;
  btn2.className = "btn bg-primary text-white  fs-6 fw-bold px-4 m-2";

  pagination.appendChild(btn2);
  btn2.addEventListener("click", () =>
    getAllExpenseFormBE(data.currentPage, row)
  );

  if (data.hasNextPage) {
    let btn3 = document.createElement("button");
    btn3.innerHTML = `${data.nextPage} >`;
    btn3.className = "btn bg-success-subtle fw-medium px-4 m-2";
    pagination.appendChild(btn3);
    btn3.addEventListener("click", () =>
      getAllExpenseFormBE(data.nextPage, row)
    );
  }

  //  rows filter --------------------------

  const row1 = document.getElementById("row1");
  row1.addEventListener("click", () => {
    localStorage.setItem("rows", 5);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });

  const row2 = document.getElementById("row2");
  row2.addEventListener("click", () => {
    localStorage.setItem("rows", 10);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });

  const row3 = document.getElementById("row3");
  row3.addEventListener("click", () => {
    localStorage.setItem("rows", 15);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });
}
