const { webFrame, remote, ipcRenderer } = require('electron');
const request = require("request");
const fs = require('fs');
var options, state, master;
var newgames = new Object();

state = 1; //loading

document.getElementById("menu").innerHTML = '<p class="text-align: center;">loading...</p>'

//run once on settings load
request.get('http://azureagst.pw/switchrpc/master.json', function(err, response, body){
  if (err) console.log("what the fuck");
  if (!response){
    console.log("uh... no response?");
    document.getElementById("menu").innerHTML = "uh please reload";
  }
  if (response.statusCode != 200) console.log("not 200");
  master = JSON.parse(body);
  var tempgame;

  options = "<form id='gamepicker'>"
  for (i=0; i<master.gamelist.length; i++){
      tempgame = master.games[master.gamelist[i]];
      options += '<input type="checkbox" name='+master.gamelist[i]+'>'+tempgame.fullname+"</input><br>";
  }
  options += "</form>"

  document.getElementById("menu").innerHTML = options;

  state = 0;
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  if (state != 0){
    alert("Dude the list hasnt even loaded yet.");
    return;
  }

  document.getElementById('update').innerHTML = "Updating..."

  var usergames = []
  var x = document.getElementById("gamepicker");
  for (i = 0; i < x.length ;i++) {
    if (x.elements[i].checked){
      usergames.push(x.elements[i].name);
    }
  }

  newgames.usergames = usergames; newgames.master = master;
  ipcRenderer.send('updatejson', newgames);
});

document.getElementById("close-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.close();
});

ipcRenderer.on('jsonupdated', function(event, arg){
  document.getElementById('update').innerHTML = "Done!"
});
