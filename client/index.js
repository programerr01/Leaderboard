var dt = {"Anurag-Raut":{"user_name":"Anurag-Raut","user_avatar":"https://avatars.githubusercontent.com/u/102049482?v=4","points":20},
"akshaya-hub":{"user_name":"akshaya-hub","user_avatar":"https://avatars.githubusercontent.com/u/76612327?v=4","points":60},
"Rishav1707":{"user_name":"Rishav1707","user_avatar":"https://avatars.githubusercontent.com/u/97666287?v=4","points":30},
"abhinav-m22":{"user_name":"abhinav-m22","user_avatar":"https://avatars.githubusercontent.com/u/113239388?v=4","points":70},
"sumitkr2000":{"user_name":"sumitkr2000","user_avatar":"https://avatars.githubusercontent.com/u/100675296?v=4","points":90},
"0xabdulkhalid":{"user_name":"0xabdulkhalid","user_avatar":"https://avatars.githubusercontent.com/u/92252895?v=4","points":100},
"ritik48":{"user_name":"ritik48","user_avatar":"https://avatars.githubusercontent.com/u/84488726?v=4","points":140},
"raj3000k":{"user_name":"raj3000k","user_avatar":"https://avatars.githubusercontent.com/u/91799854?v=4","points":70},
"govardhan-26":{"user_name":"govardhan-26","user_avatar":"https://avatars.githubusercontent.com/u/89705565?v=4","points":20}
}
var GLOBAL_DT = []
var tb = document.querySelector("#tb")
var current_pointer = 0;
var ind =0;

const start = async(url="http://localhost:3000/getLeaderBoard")=>{
    const res = await fetch(url);
    const json_ = await res.json();
    console.log(json_)
    GLOBAL_DT = Object.entries(json_).sort((c,d)=>  -c[1].points+ d[1].points)
    GLOBAL_DT.slice(current_pointer,current_pointer+30).map((each)=>{
        var entry = `<tr>
        <td>${++ind}</td>
        <td><a href="https://github.com/${each[1]['user_name']}">${each[1]['user_name']}</a></td>
        <td>${each[1]['points']}</td>
        <td><img class="leaderboard-image" src="${each[1]['user_avatar']}" alt="Player 1"></td>
    </tr>
    `
    tb.innerHTML +=entry;
    })
    current_pointer+=30;

}

document.querySelector("#load-more").addEventListener('click', ()=>{
    GLOBAL_DT.slice(current_pointer,current_pointer+30).map((each)=>{
        var entry = `<tr>
        <td>${++ind}</td>
        <td><a href="https://github.com/${each[1]['user_name']}">${each[1]['user_name']}</a></td>
        <td>${each[1]['points']}</td>
        <td><img class="leaderboard-image" src="${each[1]['user_avatar']}" alt="Player 1"></td>
    </tr>
    `
    tb.innerHTML +=entry;
    })
    current_pointer+=30;

});

var tb = document.querySelector("#tb")
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