const express = require("express")
const cors = require("cors");
const request = require('sync-request');
const morgan = require('morgan')

require('dotenv').config()

const app = express();


var GLOBAL_DT = {
  "first_date":"2023-05-18T00:00:00Z",
  "repos_list":[],
  "leaderboard":{},
  "points":{"level1":10,"level2":25,"level3":45}
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

app.get("/", (req, res) => {
  res.send(JSON.stringify({"status":200,"working":true}));
});
//Object.entries(a).sort((c,d)=>  c.points- d.points)

TOKENS=JSON.parse(process.env.TOKENS)
t_ind = 0;
function Update_leaderBoard(){
  total_pages = 0;
  for(var each of GLOBAL_DT['repos_list']){
      if(total_pages > 10){
        console.log("chaning page");
        t_ind= (t_ind+1)%TOKENS.length;
      }
      var repo = each['project_link'].split("/").slice(-2).join("/");
      console.log('starting with ',repo);

      var last_date_ =false;
      var page_no = 1;
      while(!last_date_){
        total_pages+=1;
        const options = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            "Authorization": "Bearer "+TOKENS[t_ind]
          }
        };
        var  jsonData;
        
          const response = request('GET', `https://api.github.com/repos/${repo}/issues?state=closed&page=${page_no.toString()}&per_page=100`,options);
          if(response.statusCode == 404|| response.statusCode == 403){
            break;
          }
         
          jsonData = JSON.parse(response.getBody('utf8'));
          
       
          // console.log(response);
          // const jsonData = response.data;
          // console.log(jsonData);
          //check if issues are before starting date 
          
          if(jsonData.length == 0){
            last_date_ = true;
            break;
          }
          if(new Date(jsonData[0]['created_at']) < new Date(GLOBAL_DT['first_date'])){
            last_date_ = true;
            break;
          }
          console.log("got page ",page_no,repo);
          for(var issue_ of jsonData){
            var is_valid = false;
            var label_points ='';
            for(var label of issue_['labels']){   
                if(label['name'] ==='level1'|| label['name'] ==='level2'|| label['name'] ==='level3'){
                  label_points = GLOBAL_DT['points'][label['name'] ]
                  is_valid = true;
                  break;
                }
            }
            if(is_valid){
              var users_ = []
              // valid if given any one of the level 1, 2 or 3
              if(issue_['pull_request']){
                if(issue_['pull_request']['merged_at']){
                  // valid  if pull request was merged 
                  user_name = issue_['user']['login'];
                  user_avatar = issue_['user']['avatar_url'];
                  users_.push({user_name,user_avatar})
                }
              }
              else if(issue_['state'] == 'closed' && issue_['state_reason'] == "completed"){
                //valid if issue was closed and completed and someone was assigned to it 
                for(var user_ of issue_['assignees']){
                  user_name = user_['login'];
                  user_avatar = user_['avatar_url'];
                  users_.push({user_name,user_avatar})
                }
              }
              for(var user of users_){
                if(GLOBAL_DT['leaderboard'][user['user_name']]){
                  GLOBAL_DT['leaderboard'][user['user_name']]['points']  +=label_points
                }
                else{
                  GLOBAL_DT['leaderboard'][user['user_name']]  =user;
                  GLOBAL_DT['leaderboard'][user['user_name']]['points'] = label_points

                }
              }
            }

          }

          
       
        
        page_no+=1;
      }
  }
}

function initializeRepo(){
      const response = request('GET', 'https://opensheet.elk.sh/1v7VqK6i_xJK4nJ6GKzoeafwrnlJR8Y5-8v0Qfsh3gqo/Shortlisted');
      const jsonData = JSON.parse(response.getBody('utf8'));
      GLOBAL_DT['repos_list'] = jsonData
      console.log("Repo List is fetched");
  } 


app.get("/getLeaderBoard", (req, res) => {
    res.send(JSON.stringify(GLOBAL_DT['leaderboard']));
});
  
app.get("/get", (req, res) => {
  res.send(JSON.stringify(GLOBAL_DT['repos_list']));
});

const port = process.env.PORT || 3000
app.listen(port,() => {
 initializeRepo();
  try{
    Update_leaderBoard();

  }
  catch(err){
    console.log("error",err);
  }
  
  console.log(`backend running at port ${port}`);
})


