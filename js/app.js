/*Pauses the game so that player can't move and no enemies render*/
var paused = true;

$(document).ready(function(){
        $("#gameOver").hide();
        // Hide the start screen
        $("#playGame").click(function(){

            $("#startScreen").fadeOut('fast');

            /* Unpause the game to allow the player to move around and eventually causes the enemies to render on the screen*/

            paused = false;

        });
        // Hides the game over dsiaply and allows for the game to start again
        $("#playAgain").click(function(){


            $("#gameOver").hide();
          //Reinitializes the enemies on the screen
            for (let i=0;i<enemyPosition.length;i++){
              enemy=new Enemy(0,enemyPosition[i],200);
              allEnemies.push(enemy)}
              player.lives=3;

            paused = false;
        });

})
console.log(paused)
// Enemies our player must avoid
var Enemy = function(xloc,yloc, movement) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x=xloc;
    this.y=yloc;
    this.movement=movement
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movement*dt;
    if (this.x>500){
      this.x=-100;
      this.movement=200+Math.floor(Math.random()*100);
    }

    /*collision detection*/
    if(player.x<this.x+60 && player.x+37> this.x && player.y < this.y+25 && 30+ player.y >this.y){
      player.x=200;
      player.y=300;

      player.lives--;

      console.log(player.lives)
      if(player.lives==0){
        gameOver()
      }
    }
};

/*Game over function that trggeres when the player loses its three lives*/
function gameOver(){
  paused = true;
  $("#gameOver").show();
  document.getElementById('score').innerHTML=stats.currentScore;
  stage.stage=1;
  stats.currentScore=0;
  allEnemies=[]
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  if(!paused){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player=function(xloc,yloc,movement){
  this.x=xloc;
  this.y=yloc;
  this.movement=movement
  this.sprite='images/char-boy.png';
  this.lives = 3;

}


Player.prototype.update= function(){
  if (this.y>380){
    this.y=380;

  }
  if (this.x>400){
    this.x=400
  }
  if(this.x<0){
    this.x=0
  }
  if (this.y<0){
    this.x=200;
    this.y=380;
    stage.update()

  }
}

/*How the platyer handles key down events from the user*/
Player.prototype.handleInput=function(key){
  if (key=='left'){
    this.x -=this.movement+50;
  }
  if (key=='right'){
    this.x +=this.movement+50;
  }
  if (key=='up'){
    this.y -=this.movement+30;
  }
  if (key=='down'){
    this.y +=this.movement-30;
  }
}
/*Renders player image*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies=[];

let enemyPosition=[60,140,220];
let enemy;
let player= new Player(200,380,50)

for (let i=0;i<enemyPosition.length;i++){
  enemy=new Enemy(0,enemyPosition[i],200);
  allEnemies.push(enemy)


}

/*Initializes the stage for the user*/
var Stage =function(){
  this.stage=1;

}
/*updates stage when a player reached the water images, updates current score, and renders more enemies when you reach every five levels. Additionally, the player gets an extra life after a every tenth level.*/
Stage.prototype.update = function(){
  this.stage+=1;
  stats.currentScore+=1000;
  //console.log(this.score)
  console.log(this.stage)
  console.log('New level')
  if (this.stage % 5==0){

    for (let i=0;i<1;i++){
      enemy=new Enemy(0,enemyPosition[Math.floor(Math.random()*2)],Math.floor(Math.random()*500));
      allEnemies.push(enemy)

    }
  }if (this.stage%10==0){
    player.lives++;

  }else if(player.lives==0){
    gameOver()
  }
  //stats.updateStage(this.stage);


}
/*Initialize a new stage*/
var stage=new Stage();


/*Creates the stat for the game: lives, score, and stages*/
var Stats = function(){
  this.currentScore=0;
  this.currentStage=stage.stage;
  this.curentLives = player.lives;

}

// Render the stat bar, stage text , score text , lives count
Stats.prototype.render = function() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,50,707,45);
    this.stage();
    this.score();
    this.lives();

};
// Stage text
Stats.prototype.stage = function() {
        ctx.font = 'san-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'start';
        ctx.fillText('Stage '+ stage.stage, 10,82);

};


Stats.prototype.updateStage=function(stage){
  this.currentStage=this.stage;

}

// Score text
Stats.prototype.score = function(){
        ctx.font = 'san-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText("Score: " +stats.currentScore,450,82);
};


Stats.prototype.updateScore=function(){
  this.currentScore+=1000;
}
//Live text
Stats.prototype.lives = function(){
    //ctx.drawImage(Resources.get('./images/Heart.png'),340,62);
    ctx.font = 'san-serif';
    ctx.fontStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Lives '+ player.lives, 250,82);

}
//updates lives text
Stats.prototype.updateLives = function(lives){
            this.currentLives = lives;

};
//Calls stats object
var stats = new Stats()
//console.log(stats.currentLives)
/*Event listener for how the player will react to new inputs*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(!paused){
      player.handleInput(allowedKeys[e.keyCode]);
    }

});
