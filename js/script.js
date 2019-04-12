window.onload = function() {
    
    const myCanvas = document.getElementById('my-canvas');
    const ctx = myCanvas.getContext('2d');
    
    const bg = new Image();
    bg.src = "./img/background_space.png";
    
    const img = new Image();
    img.src = "./img/nave-aliada.png";
    
    const ene = new Image();
    ene.src = "./img/asteroid.png";

    const eneBoss = new Image();
    eneBoss.src = "./img/nave-inimiga.png";

    let nave;
    let score = 0;
    qtdEnemies = [];
    qtdShoots = [];
    qtdShootsBoss = [];
    qtdBoss = [];
    let gameOver = false;
    let start = false;
    let gamePaused = false;
    let bossShootController = 0;
    let playerShootController = 0;
      
//////// class Player //////////
    class Player{
      constructor(){
        this.health = 200;
        this.x = 420;
        this.y = 620;
        this.width = 50;
        this.height = 130;
        this.moving = false;
        this.direction = null;
        this.isShooting = false;
      }       
      
      getHealth(){
        return this.health;
      }
      
      receiveDamage(){
        this.health = this.health - 50;
      }

      shoot() {
         if(playerShootController > 10){
          let shoot = new ShootPlayer();  
          qtdShoots.push(shoot);
          playerShootController = 0;
         }
      }

      draw(){
        ctx.drawImage(img, this.x, this.y, 50, 130);
      }

      move() {
        if (this.moving) {
          if (this.direction === 'left') {
             if ( this.x > 10){
              this.x -= 5;
             }
          }
          if (this.direction === 'right') {
             if ( this.x < 790){
              this.x += 5;
            }
          }
          if (this.direction === 'down') {
            if ( this.y < 600){
              this.y += 5;
            }
          }
          if (this.direction === 'up') {
            if ( this.y > 10){
              this.y -= 5;
            }
          }
        }
      }
    }

//////// class Enemy //////////
    class Enemy {
        constructor(){
        this.active = true;
        this.x = myCanvas.width * Math.random();
        this.y = 0;
        this.width = 50;
        this.height = 50;
        }
  
        enemyDraw() {
             ctx.drawImage(ene, this.x, this.y, this.width, this.height);
        };
  
        enemyDie() {
            this.active = false;
            score += 10;
        };
    }
/////////////////////////////////////////////////////

class ShootPlayer {
    constructor(){
    this.active = true;
    this.color = "yellow";
    this.width = 5;
    this.height = 20;
    this.x = nave.x + 22;
    this.y = nave.y;
  }
  
  shootDraw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  
  shootDie() {
    this.active = false;
  };
}
/////////////////////////////////////////////////////////////////////////////  

class ShootEnemieBoss {
  constructor(){
  this.active = true;
  this.color = "red";
  this.width = 15;
  this.height = 40;
  this.x = qtdBoss[0].x + 145;
  this.y = qtdBoss[0].y + 200;
  }

  shootDraw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  shootDie() {
    this.active = false;
  };
}
/////////////////////////////////////////////////////////////////////////////  
    
class Boss{
  constructor(){
    this.active = true;
    this.health = 400;
    this.x = (myCanvas.width/2) * Math.random();
    this.y = -100;
    this.width = 300;
    this.height = 300;
  }       
   
  getHealth(){
    return this.health;
  }
  
  receiveDamage(){
    this.health = this.health - 50;
  }

  enemyDie() {
    this.active = false;
    score += 10;
  }

  shoot() {
    let shootBoss = new ShootEnemieBoss();  
    qtdShootsBoss.push(shootBoss);
  }
  
  enemyDraw() {
    ctx.drawImage(eneBoss, this.x, this.y, 300, 300);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////

function startGame() {
  nave = new Player();
  start = true;
 //       document.getElementById('game-intro').style.display = 'none';
 //       document.getElementById('game-board').style.backgroundColor = 'black';
 //       animate(); 
  explosionPlayer = new Audio("./music/explosion_player.mp3");
  explosionEnemies = new Audio("./music/explosion_asteroid.mp3");
  shootMusic = new Audio("./music/weapon_player.mp3");
  gameOverSong = new Audio("./music/gameover.mp3");
  pauseSong = new Audio("./music/pause.mp3");
  myMusic = new Audio("./music/game_music.mp3");
  myMusic.play();
}

//// control of the background /////
    let backgroundImage = {
        img: bg,
        y: 0,
        speed: 1,
      
        move: function() {
          this.y += this.speed;
          
        },
      
        draw: function() {
          
            ctx.drawImage(this.img, 0, this.y, myCanvas.width, myCanvas.height);
        
            ctx.drawImage(this.img, 0, this.y - myCanvas.height, myCanvas.width, myCanvas.height);
            if(this.y === myCanvas.height) {
              this.y = 0;
            }
          
        }
      };
//// add a new enemy ///// 
    function addEnemy(){
      if(getRandom(50) > 49){
        let enemy = new Enemy();
        qtdEnemies.push(enemy);
        enemy.enemyDraw();   
      }  
    }
//// add a new boss /////
    function addBoss(){
      if(qtdBoss.length === 0){
        if(getRandom(5000) > 4990){
          let bossEnemie = new Boss();
          qtdBoss.push(bossEnemie);
          bossEnemie.enemyDraw();   
        } 
      } 
    }

//// update all positions from all arrays (shoots from player, enemies, shoots from boss, and the boss location ) /////// 
    function updatePositions(){
       backgroundImage.move();
       backgroundImage.draw();
       nave.draw();
       nave.move();

      for(let i = 0; i < qtdEnemies.length; i++){
         if(qtdEnemies[i].active === true){
            qtdEnemies[i].y += 4;
            qtdEnemies[i].x += (getRandom(7)) - 3;
            qtdEnemies[i].enemyDraw();
         }
         if(qtdEnemies[i].y > 800){
            qtdEnemies[i].active = false;
            qtdEnemies.splice(i,1);
         }    
      }
      for(let j = 0; j < qtdShoots.length; j++){
        if(qtdShoots[j].active === true){
            qtdShoots[j].y -= 4;
            qtdShoots[j].shootDraw();
        }
        if(qtdShoots[j].y < 0){
            qtdShoots[j].active = false;
            qtdShoots.splice(j,1);
        }
      }
      for(let k = 0; k < qtdShootsBoss.length; k++){
        if(qtdShootsBoss[k].active === true){
          qtdShootsBoss[k].y += 4;
          qtdShootsBoss[k].shootDraw();
        }
        if(qtdShootsBoss[k].y < 0){
          qtdShootsBoss[k].active = false;
          qtdShootsBoss.splice(k,1);
        }
      }
      for(let w = 0; w < qtdBoss.length; w++){
        if(qtdBoss[w].active === true){
           qtdBoss[w].y += 1;
           qtdBoss[w].x += (getRandom(7)) - 3;
           qtdBoss[w].enemyDraw();
        }
        if(qtdBoss[w].y > 800){
           qtdBoss[w].active = false;
           qtdBoss.splice(w,1);
        }    
      }

    }

//// write the score and health of the player on canvas /////// 
function statusPlayer(){
  ctx.font = "20pt Calibri";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 5, 30);
  ctx.fillText(`Health: ${nave.getHealth()}`, 5, 60);
} 

//// collision function /////// 
    function collisionCheck(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
//// check the collision of the shoots from the player confronted the enemies //////
    function collisionOccurs() {
        qtdShoots.forEach(function(shoot) {
            qtdEnemies.forEach(function(enemy) {
              if (collisionCheck(shoot, enemy)) {
                explosionPlayer.play();
                shoot.shootDie();
                enemy.enemyDie();
              }
            });
        });       
    }
//// check the collision of the shoots from the Boss ship confronted the player////////////////
    function collisionBossOccurs(){
      qtdShootsBoss.forEach(function(sBoos) {
        if (collisionCheck(sBoos, nave)) {
          explosionEnemies.play();
          sBoos.shootDie();
          nave.receiveDamage();
        }
      });  
    }
//// check the collision of the shoots from the player confronted the enemy Boss ship///////
    function shootBossOccurs() {
      qtdShoots.forEach(function(shoot) {
          qtdBoss.forEach(function(boss) {
            if (collisionCheck(shoot, boss)) {
              explosionPlayer.play();
              shoot.shootDie();
              boss.receiveDamage();
              score += 10;
              if (boss.getHealth() < 0) {
                boss.enemyDie();
                explosionEnemies.play();
              }
              explosionEnemies.play();
            }
          });
      });       
    }
//// check the collision of the player and the enemies ///////
    function collisionPlayerOccurs(){
      qtdEnemies.forEach(function(enemy) {
        if (collisionCheck(enemy, nave)) {
          explosionEnemies.play();
          enemy.enemyDie();
          nave.receiveDamage();
        }
      });  
    }
//// remove the desactived elements of all arrays ////  
    function removeShootEnemy(){
      for(let i = 0; i < qtdEnemies.length; i++){
        if(qtdEnemies[i].active === false){
          qtdEnemies.splice(i,1);
        }
      }
      for(let j = 0; j < qtdShoots.length; j++){
        if(qtdShoots[j].active === false){
          qtdShoots.splice(j,1);
        }
      }
      for(let k = 0; k < qtdShootsBoss.length; k++){
        if(qtdShootsBoss[k].active === false){
          qtdShootsBoss.splice(k,1);
        }
      }
      for(let w = 0; w < qtdBoss.length; w++){
        if(qtdBoss[w].active === false){
          qtdBoss.splice(w,1);
        }
      }  
    }

//// create random numbers ////////    
    function getRandom(value){
      return (Math.random() * value); 
    }

///////////// event listener //////////////////////    
    document.onkeydown = function(e){
      controlPosition(e.keyCode, 'start');
    };

    document.onkeyup = function(e){
      controlPosition(e.keyCode, 'stop');
    };

///////////// Pause Game //////////////////////       
    function pauseGame() {
      if (!gamePaused) {
        gamePaused = true;
        ctx.font = "50pt Calibri";
        ctx.fillText("Paused!", 300, 400);
      } else if (gamePaused) {
        gamePaused = false;
      }
    } 

//////////// Reload Game //////////////////////       
    function reloadGame() {
      qtdEnemies = [];
      qtdShoots = [];
      qtdShootsBoss = [];
      qtdBoss = [];
      gameOver = false;
      start = false;
      gamePaused = false;
      bossShootController = 0;
      playerShootController = 0;
      score = 0;
      gameOverSong.pause();
      startGame();
      animate();
    } 
///////////// control position of the player and the buttons////////////////////// 
   
    function controlPosition(key, action) {
      let arrowCodes = [37, 39, 40, 38];
      let result = key;
      if (action === 'stop' ){
        nave.moving = false;
        return;
      }
      // left arrow.
      if (result === 37 && action === 'start') {
        nave.direction = 'left';
        nave.moving = true;
      }
      // right arrow.
      if(result === 39 && action === 'start') {
        nave.direction = 'right';
        nave.moving = true;
      }   
      // down arrow.
      if(result === 40 && action === 'start'){
        nave.direction = 'down';
        nave.moving = true;
      }
      //up arrow 
      if(result === 38 && action === 'start') {
        nave.direction = 'up';
        nave.moving = true;
      }
     //enter
      if(result === 13) {
       if(gameOver === false && start === false){
        document.getElementById('game-intro').style.display = 'none';
        document.getElementById('game-board').style.backgroundColor = 'black';
        startGame();
        animate(); 
       }
       if(gameOver === true && start === true){
        reloadGame();
       }            
      } 
      //p button
      if(result === 80) {
        if(gameOver === false){
          pauseSong.play();
          pauseGame();
        }            
      }
      //space button
      if(result === 32 && action === 'start') {
       if(gameOver === false){
        shootMusic.play();
        nave.shoot();
        }
      }
      return false;
    };

///////////// Clear the canvas //////////////////////    
    function clear(){
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);  
    }

///////////// here the animation happens //////////////////////
  function animate(){
     if(!gamePaused){ 
        clear();
        updatePositions();
        addEnemy();
        addBoss();
        collisionOccurs();
        removeShootEnemy();
        collisionPlayerOccurs();
        collisionBossOccurs();
        shootBossOccurs();
        statusPlayer();
        if (nave.getHealth() === 0) {
          ctx.font = "50pt Calibri";
          ctx.fillText("Game Over", 280, 400);
          ctx.font = "20pt Calibri";
          ctx.fillText("Press 'enter' to reload...", 320, 450);
          myMusic.pause();
          gameOverSong.play();
          gameOver = true;
          return false;
        }
        playerShootController += 1;
        bossShootController += 1;
        if(bossShootController === 100){
          bossShootController = 0;
          for(let k = 0; k < qtdBoss.length; k++){
            if(qtdBoss[k].active){
              qtdBoss[k].shoot();
            }
          }
        }
      }
     window.requestAnimationFrame(animate);   
  }
}; 