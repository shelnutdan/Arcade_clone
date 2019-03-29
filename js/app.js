var paused = true;

$(document).ready(function(){
        $("#gameOver").hide();
        // Hide the start screen on button click
        $("#playGame").click(function(){
            //Hide the start screen
            $("#startScreen").fadeOut('fast');

            /* Unpause the game to allow the player to move around
            * when arrow keys are pressed
            */
            paused = false;

        });
        // Hide the game over screen on button click
        $("#playAgain").click(function(){

            // Hide the game over screen
            $("#gameOver").hide();
            for (let i=0;i<enemyPosition.length;i++){
              enemy=new Enemy(0,enemyPosition[i],200);
              allEnemies.push(enemy)}
              player.lives=3;
            /* Unpause the game to allow the player to move around
            * when arrow keys are pressed
            */
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
      //gameOver();
      console.log(player.lives)
      if(player.lives==0){
        gameOver()
      }
    }
};


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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
var Stage =function(){
  this.stage=1;

}

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
  }else if (this.stage%10==0){
    player.lives++;

  }else if(player.lives==0){
    gameOver()
  }
  //stats.updateStage(this.stage);


}
/*Initialize a new stage*/
var stage=new Stage();

var Stats = function(){
  this.currentScore=0;
  this.currentStage=stage.stage;
  this.curentLives = player.lives;

}

// Render the stat bar, level text , score text , lives count and gems count
Stats.prototype.render = function() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,50,707,45);
    this.stage();
    this.score();
    //this
    this.lives();

};
// Level text
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

Stats.prototype.lives = function(){
    //ctx.drawImage(Resources.get('images/stat-heart.png'),340,62);
    ctx.font = 'san-serif';
    ctx.fontStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Lives '+ player.lives, 250,82);

}

Stats.prototype.updateLives = function(lives){
            this.currentLives = lives;

};

var stats = new Stats()
console.log(stats.currentLives)
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
