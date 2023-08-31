// API URL ====================================================
const leaderboardAPIUrl = `http://localhost:3000/api/premium/leaderboard`;

addEventListener("DOMContentLoaded", async (e) => {
  const token = localStorage.getItem("userIdToken");

  let LbData = await axios.get(leaderboardAPIUrl, {
    headers: { Authorization: token },
  });
  console.log(LbData.data);
  showLeaderboard(LbData.data);
});

// Show Leader Board list

function showLeaderboard(data) {
  // create html elment
  data.forEach((data) => {
    let li = document.createElement("li");
    li.className =
      "list-group-item p-3 d-flex justify-content-between align-items-center fw-semibold";
    li.appendChild(document.createTextNode(data.userName));

    let span = document.createElement("span");
    span.className =
      "badge bg-warning-subtle p-1 px-4 text-dark rounded-pill fs-6";
    span.appendChild(
      document.createTextNode(
        data.totalExpense === null ? "0" : data.totalExpense
      )
    );

    li.appendChild(span);
    document.getElementById("LeaderboardList").appendChild(li);
  });
}
