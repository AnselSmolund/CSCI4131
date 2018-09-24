var cell;
var color;
var grid = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
var audio;
function move(){
  audio = new Audio('winner.mp3');
  cell = document.forms["ticForm"]["cell"].value;
  color = document.forms["ticForm"]["color"].value;
  if(cell == "1"){
    grid[0][0] = color;
  }
  if(cell == "2"){
    grid[0][1] = color;
  }
  if(cell == "3"){
    grid[0][2] = color;
  }
  if(cell == "4"){
    grid[1][0] = color;
  }
  if(cell == "5"){
    grid[1][1] = color;
  }
  if(cell == "6"){
    grid[1][2] = color;
  }
  if(cell == "7"){
    grid[2][0] = color;
  }
  if(cell == "8"){
    grid[2][1] = color;
  }
  if(cell == "9"){
    grid[2][2] = color;
  }
  if(color == "blue"){
    document.getElementById(cell).innerHTML = "X";
    document.getElementById(cell).style.backgroundColor = "rgba(0,0,255,.4)";
  }
  if(color == "red"){
    document.getElementById(cell).innerHTML = "O";
    document.getElementById(cell).style.backgroundColor = "rgba(255,0,0,.4)";
  }

  if(checkBlueWinner()){
    document.getElementById('winner').innerHTML = "BLUE WINS!";
    document.getElementById('winner').style.color = "blue";
    audio.play();
    return false;
  }
  if(checkRedWinner()){
    document.getElementById('winner').innerHTML = "RED WINS!";
    document.getElementById('winner').style.color = "red";
    audio.play();
    return false;
  }
  return false;
}
function checkBlueWinner(){
  if(grid[0][0] == "blue"){
    if(grid[0][1] == "blue" && grid[0][2] == "blue"){
      return true;
    }
    if(grid[1][1] == "blue" && grid[2][2] == "blue"){
      return true;
    }
    if(grid[1][0] == "blue" && grid[2][0] == "blue"){
      return true;
    }
  }
  if(grid[0][1] == "blue"){
    if(grid[1][1] == "blue" && grid[2][1] == "blue"){
      return true;
    }
  }
  if(grid[0][2] == "blue"){
    if(grid[1][2] == "blue" && grid[2][2] == "blue"){
      return true;
    }
    if(grid[1][1] == "blue" && grid[2][0] == "blue"){
      return true;
    }
  }
  if(grid[1][0] == "blue"){
    if(grid[1][1] == "blue" && grid[1][2] == "blue"){
      return true;
    }
  }
  if(grid[2][0] == "blue"){
    if(grid[2][1] == "blue" && grid[2][2] == "red"){
      return true;
    }
  }

}
function checkRedWinner(){
  if(grid[0][0] == "red"){
    if(grid[0][1] == "red" && grid[0][2] == "red"){
      return true;
    }
    if(grid[1][1] == "red" && grid[2][2] == "red"){
      return true;
    }
    if(grid[1][0] == "red" && grid[2][0] == "red"){
      return true;
    }
  }
  if(grid[0][1] == "red"){
    if(grid[1][1] == "red" && grid[2][1] == "red"){
      return true;
    }
  }
  if(grid[0][2] == "red"){
    if(grid[1][2] == "red" && grid[2][2] == "red"){
      return true;
    }
    if(grid[1][1] == "red" && grid[2][0] == "red"){
      return true;
    }
  }
  if(grid[1][0] == "red"){
    if(grid[1][1] == "red" && grid[1][2] == "red"){
      return true;
    }
  }
  if(grid[2][0] == "red"){
    if(grid[2][1] == "red" && grid[2][2] == "red"){
      return true;
    }
  }

}

function resetGame(){
  var index = 1;
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
      grid[i][j] = -1;
      document.getElementById(index).innerHTML = index;
      document.getElementById(index).style.backgroundColor = "rgba(0,0,127,0)"; //background-color: rgba(0,0,127,0.3);
      index++;
    }
  }
  document.getElementById('winner').innerHTML = "";
  return false;
}
