var GLOBAL_DT = [];
var tb = document.querySelector("#tb");
const loadingContainer = document.getElementById("loading-container");

var current_pointer = 0;
var ind = 0;
var backend_url = "https://api-leaderboard.onrender.com/getLeaderBoard";
const start = async (
  url = "https://api-leaderboard.onrender.com/getLeaderBoard"
) => {
  loadingContainer.style.display = "flex";
  const res = await fetch(url);
  const json_ = await res.json();
  GLOBAL_DT = Object.entries(json_).sort((c, d) => -c[1].points + d[1].points);
  GLOBAL_DT.slice(current_pointer, current_pointer + 30).map((each) => {
    var entry = `<tr>
        <td>${++ind}</td>
        <td><a href="https://github.com/${each[1]["user_name"]}">${
      each[1]["user_name"]
    }</a></td>
        <td>${each[1]["points"]}</td>
        <td><img class="leaderboard-image" src="${
          each[1]["user_avatar"]
        }" alt="Player 1"></td>
    </tr>
    `;
    tb.innerHTML += entry;
  });

  current_pointer += 30;
};

document.querySelector("#load-more").addEventListener("click", () => {
  GLOBAL_DT.slice(current_pointer, current_pointer + 30).map((each) => {
    var entry = `<tr>
        <td>${++ind}</td>
        <td><a href="https://github.com/${each[1]["user_name"]}">${
      each[1]["user_name"]
    }</a></td>
        <td>${each[1]["points"]}</td>
        <td><img class="leaderboard-image" src="${
          each[1]["user_avatar"]
        }" alt="Player 1"></td>
    </tr>
    `;
    tb.innerHTML += entry;
  });
  current_pointer += 30;
});

var tb = document.querySelector("#tb");
var i = 1;
// for(var each in dt){
//     var str = `<tr>
//                 <td>${i}</td>
//                 <td><a href="https://github.com/${dt[each]['user_name']}">${dt[each]['user_name']}</a></td>
//                 <td>${dt[each]['points']}</td>
//                 <td><img class="leaderboard-image" src="${dt[each]['user_avatar']}" alt="Player 1"></td>
//             </tr>
//             `
//     tb.innerHTML +=str;
//     i+=1;
// }
start();

let form = document.querySelector("#searchForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // TODO: if you want to use query param approach
  //   const urlParams = new URLSearchParams(window.location.search);
  //   console.log(urlParams.get("search"));

  const input = e.target[0].value.toLowerCase();

  if (input !== undefined && input !== "") {
    const searchedData = GLOBAL_DT.filter((element) =>
      element[1]["user_name"].toLowerCase().includes(input)
    );

    tb.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Score</th>
      <th>Image</th>
    </tr>
    `;

    //Adding the search result data to rows of table
    for (i = 0; i < searchedData.length; i++) {
      let userName = searchedData[i][0];
      let points = searchedData[i][1].points;
      let rank =
      GLOBAL_DT.findIndex((element) =>
      element[0].toLowerCase().includes(userName.toLowerCase())
      ) + 1;
      let userAvatar = GLOBAL_DT[rank-1][1].user_avatar;

      let entry = `
        <tr>
            <td>${rank}</td>
            <td><a href="https://github.com/${userName}">${userName}</a></td>
            <td>${points}</td>
            <td><img class="leaderboard-image" src="${userAvatar}" alt="Player 1"></td>
        </tr>
        `;

      tb.innerHTML += entry;
    }
  } else {
    window.location.reload();
  }
});
