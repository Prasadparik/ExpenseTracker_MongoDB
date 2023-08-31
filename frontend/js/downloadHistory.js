// API URL ====================================================
const downloadAPIUrl = `http://localhost:3000/api/premium/downloadhistory`;

addEventListener("DOMContentLoaded", async (e) => {
  const token = localStorage.getItem("userIdToken");

  let downloadHistory = await axios.get(downloadAPIUrl, {
    headers: { Authorization: token },
  });
  console.log(downloadHistory.data);
  showDownload(downloadHistory.data);
});

// Show Leader Board list

function showDownload(data) {
  // create html elment
  data.forEach((data) => {
    let li = document.createElement("li");
    li.className =
      "list-group-item p-3 d-flex justify-content-between align-items-center fw-semibold";
    li.appendChild(document.createTextNode(data.createdAt.slice(0, 10)));

    let span = document.createElement("a");
    span.className =
      "badge bg-warning-subtle p-1 px-4 text-dark rounded-pill fs-6";
    span.appendChild(document.createTextNode("DOWNLOAD"));
    span.setAttribute("href", data.url);
    li.appendChild(span);
    document.getElementById("DownloadList").appendChild(li);
  });
}
