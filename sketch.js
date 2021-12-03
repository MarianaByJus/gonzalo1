var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, tero;
var ground, invisibleGround, groundImage, teroImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  teroImg = loadAnimation("tero1.png", "tero2.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight );

  var message = "Esto es un mensaje";
 console.log(message)
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-80,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,140);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  Terogroup = createGroup(); 
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trex_running);
    ground.velocityX = -(4 + 3* score/100)
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (touches.lenght>0 || keyDown("space")&& trex.y >= height-120 ){ 
    //hacer que el trex salte al presionar la barra espaciadora
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
  }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
    spawnTeros();
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(touches.lenght>0 || keyDown("space")){
      touches =[];
    }
    if (Terogroup.isTouching(trex)){
      gameState = END; 
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      if(mousePressedOver(restart)) {
        reset();

      }
     //cambiar la animación del trex
      trex.changeAnimation("collided", trex_collided);
      
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    Terogroup.setLifetimeEach(-1); 

     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     Terogroup.setVelocityXEach(0);  
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
gameState=PLAY;
gameOver.visible = false;
restart.visible=false; 
//Cada vez que mi trex toque algun obstaculo van a desaparecer estos grupos 
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
Terogroup.destroyEach();
score= 0;
trex.changeAnimation("running", trex_running);

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-95,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
    cloudsGroup.add(cloud);
  }
}

function spawnTeros(){
if (frameCount %60===0){
  var tero = createSprite(width+20, height-300,40,10);
  tero.addAnimation("tero_fly",teroImg);
  tero.velocityX= -5;
 Terogroup.add(tero);  

}
  
}

