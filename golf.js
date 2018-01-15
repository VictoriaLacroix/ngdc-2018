const WH = 32;     // Tile resolution

var turn = 0;      // Enemy/player turn
var enemies = 0;   // Counter for tracking enemy turns. Changes automatically
var balls = 0;     // Currency
var player = null; // Remote access to player
var spawn = false;
var swoosh = false;
var swooshani;
var shopMusic = false;

var counter = 0;
var club_putter = { name: "Putter", damage: 1 };
var club_wedge  = { name: "Approach Wedge", damage: 2 };
var club_iron   = { name: "Three Iron", damage: 3 };
var club_driver = { name: "Driver", damage: 5 };
var weapon = club_putter;
var health = 25;
var food_bepis    = { name: "A Bottle of Bepis", health: 2 };
var food_sandwich = { name: "Chicken Club Sandwich", health: 4 };
var food_filet    = { name: "Filet MignonHONHON", health: 8 };
var shopRefs = [];
var levelLast = 0;
var spawnX = 0;
var spawnY = 0;
var swooshX = 0;
var swooshY = 0;
var ballValue = 1;
var ball;
var turns = 0;
var chars = [];
var items = [];
var faux;
var itemRefs = [];
var charRefs = [];
var charIds = [];
var floor = 1;
var newGame = true;
var level;
var showShop = false;
var blargh;
var shopItems = [];
var prices = {
    1: 2,
    2: 4,
    3: 6,
    4: 10,
    5: 20,
    6: 40  
}
var names = {
    1: "Bepis",
    2: "Sandwich",
    3: "Filet Mignon",
    4: "Wedge",
    5: "Iron",
    6: "Driver"
}

var Q = Quintus({ development: true, audioSupported: [ 'wav','mp3', 'mp4' ] })                         
  .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio, Anim") 
  .setup("golf")                           
  .controls()                        
  .touch()
  .enableSound();  

Q.animations('caddy', {
  player_right:  { frames: [ 0, 1, 2, 3], rate: 1/3},
  golfer_right1: { frames: [5,6,7,8], rate: 1/3},
  golfer_right2: { frames: [10,11,12,13], rate: 1/3},
  golfer_right3: { frames: [15,16,17,18], rate: 1/3},
  golfer_right4: { frames: [20,21,22,23], rate: 1/3},
  player_left:   { frames: [25,26,27,28], rate: 1/3},
  golfer_left1:  { frames: [30,31,32,33], rate: 1/3},
  golfer_left2:  { frames: [35,36,37,38], rate: 1/3},
  golfer_left3:  { frames: [40,41,42,43], rate: 1/3},
  golfer_left4:  { frames: [45,46,47,48], rate: 1/3},
});
Q.animations('space', {
  blink:  { frames: [ 0, 1], rate: 1}
});
Q.animations('swoosh', {
    whoosh: { frames: [4, 3, 2, 1, 0, -1], rate: 1/15, loop: false }
});

Q.Sprite.extend("Filler1",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'chair.png' });
   }
});
Q.Sprite.extend("Filler2",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'chair2.png' });
   }
});
Q.Sprite.extend("Filler3",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'table.png' });
   }
});
Q.Sprite.extend("Filler4",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'stool.png' });
   }
});  
Q.Sprite.extend("Faux",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'faux.png' });
   }
});  
Q.Sprite.extend("Faux2",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'faux2.png' });
   }
}); 
Q.Sprite.extend("Faux3",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'faux3.png' });
   }
}); 
Q.Sprite.extend("Space",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'space', sprite:'space'  });
    this.add("animation");
    this.play("blink");
   }
});Q.Sprite.extend("Carpet",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'Carpet.png' });
   }
});  
Q.Sprite.extend("Swoosh",{    
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'swoosh', sprite:'swoosh' });
    this.add("animation");
    this.play("whoosh");
   }
});  
Q.Sprite.extend("Start",{    
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,
      asset: "start.png" });
    Q.input.on("fire",this,"start");
   },
   start: function(obj){Q.audio.play('start.mp3');
       
    newGame = true;Q.audio.stop("mt.mp3");
    Q.clearStages();
    Q.stageScene('level1');
   }
    
}); 
Q.Sprite.extend("Plant",{      
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'plant' });
   }
});  
Q.Sprite.extend("Grass",{  //Pickup        
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'grassfloor.png' });
   }
});
Q.Sprite.extend("ClubDrop",{  //Pickup        
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'putty' });
   }
});
Q.Sprite.extend("Stairs",{ // Next Floor        
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'stairs' });
   }
});
Q.Sprite.extend("Block",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'wall' });
   }
});
Q.Sprite.extend("Block2",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'wall2.png' });
   }
});
Q.Sprite.extend("Block3",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'wall3.png' });
   }
});
Q.Sprite.extend("Floor",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'floor'});
   }
});
Q.Sprite.extend("Floor2",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'floor2.png'});
   }
});
Q.Sprite.extend("Floor3",{     // Walls         
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,asset: 'floor3.png'});
   }
});
Q.Sprite.extend("Golfball",{  // Currency (on ground)              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'buals1', value:1 });
   }
});
Q.Sprite.extend("Golfball2",{  // Currency (on ground)              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'buals2', value:1 });
   }
});
Q.Sprite.extend("Golfball3",{  // Currency (on ground)              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'buals3', value:1 });
   }
});
Q.Sprite.extend("Bepis",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'bepis',health:2 });
   }
});
Q.Sprite.extend("Sandwich",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'chiggen',health:5 });
   }
});
Q.Sprite.extend("Wedge",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'wedge',health:5 });
   }
});
Q.Sprite.extend("Iron",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'iron',health:5 });
   }
});Q.Sprite.extend("Driver",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'driver',health:5 });
   }
});
Q.Sprite.extend("Filet",{  // Test food              
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'HONHONHON',health:8 });
   }
});
Q.Sprite.extend("Player",{    // Main character
  init: function(p) {
    this._super(p, {
      sprite: "caddy",
      sheet: "caddy",
      type: Q.SPRITE_NONE,  
      gravity: 0,
      
      name:"Sir Golfsalot",
      health:25,
      maxhealth:25,
      weapon:club_putter
    });
    
    this.add("animation");
    this.play("player_right");
    Q.input.on("up",this,"up");
    Q.input.on("down",this,"down");
    Q.input.on("left",this,"left");
    Q.input.on("right",this,"right");
    Q.input.on("fire",this,"buy");
    
    this.add("2d");
  },
  right:function(obj){ movePlayer(1,0,this); 
    this.play("player_right");},
  left: function(obj){ movePlayer(-1,0,this);
    this.play("player_left"); },
  up:   function(obj){ movePlayer(0,-1,this); },
  down: function(obj){ movePlayer(0,1,this); },
  buy:  function(obj){ buy(); },
  step: function(dt){   
      if(this.p.vx>0&&(this.p.x>tile(this.p.tx+1)))     slidePlayer(1,0,this);
      else if(this.p.vx<0&&(this.p.x<tile(this.p.tx-1)))slidePlayer(-1,0,this);
      else if(this.p.vy>0&&(this.p.y>tile(this.p.ty+1)))slidePlayer(0,1,this);
      else if(this.p.vy<0&&(this.p.y<tile(this.p.ty-1)))slidePlayer(0,-1,this);
      checkItems(items);
      checkStairs();
      checkShop();
  }
});
Q.Sprite.extend("Enemy",{     // Test enemy
  init: function(p) {
    var power = randomPower();
    this._super(p, { 
        type: Q.SPRITE_NONE,
        sprite: 'caddy',
        sheet: 'caddy', 
        power:power,
        gravity:0, 
        turn:0, 
        ai:0,
        
        health:getHealth(power),
        name:"Evil Golfer Man",
        weapon:getWeapon(power)
    });
    this.add('2d, animation'); 
    console.log("floor "+floor+" power "+power);
    this.play("golfer_right"+power);
  },
  step: function(dt){
      // Aggro
      if(this.p.tx>player.p.tx-5 && this.p.tx<player.p.tx+5 &&
         this.p.ty>player.p.ty-5 && this.p.ty<player.p.ty+5)
            this.p.ai = 1;
      // Reset instances on player turn
      if(turn == 0 && this.p.turn == 1) this.p.turn = 0;
      if(turn > 0 && this.p.turn == 0){
          // Wandering
          if(this.p.ai < 1){
              var moved = false;
              while(!moved){
                  var r = Math.round(Math.random()*5);
                  if(r==1){
                      move(0,-1,this);
                      moved = true;
                  }
                  else if(r==2){
                      this.play("golfer_right"+this.p.power);
                      console.log("golfer_right"+this.p.power);
                      move(1,0,this);
                      moved = true;
                  }
                  else if(r==3){
                      move(0,1,this);
                      moved = true;
                  }
                  else if(r==4) moved = true;
                  else{
                      this.play("golfer_left"+this.p.power);
                      console.log("golfer_left"+this.p.power);
                      move(-1,0,this);
                      moved = true;
                  } 
              } 
          }
          // Angry
          else if(this.p.ai == 1){
              // First we determine whether to move along the x or y axis. Close in on the farthest axis first.
              if(Math.abs(this.p.ty-player.p.ty)>Math.abs(this.p.tx-player.p.tx)){ // Y axis
                  if(this.p.ty>player.p.ty &&
                        chars[this.p.ty-1][this.p.tx] <= 1 &&
                        level[this.p.ty-1][this.p.tx] <= 1){
                        move(0,-1,this);
                  }
                  else if(chars[this.p.ty+1][this.p.tx] <= 1 &&
                       level[this.p.ty+1][this.p.tx] <= 1){
                        move(0,1,this);
                  }
              }
              else{ // X Axis
                  if(this.p.tx>player.p.tx &&
                       chars[this.p.ty][this.p.tx-1] <= 1 &&
                       level[this.p.ty][this.p.tx-1] <= 1){
                      this.play("golfer_left"+this.p.power);
                      console.log("golfer_left"+this.p.power);
                        move(-1,0,this);
                  }                               
                  else if(chars[this.p.ty][this.p.tx+1] <= 1 &&
                          level[this.p.ty][this.p.tx+1] <= 1){
                      this.play("golfer_right"+this.p.power);
                      console.log("golfer_right"+this.p.power);
                        move(1,0,this);
                  }
              }
          }
          // Each enemy moves once
          turns++;
          this.p.turn = 1;
          if(++turn == enemies+1){ turn = 0; turns=0}
      }
  }
});
Q.Sprite.extend("Counter",{
   init: function(p) {
       this._super(p, { type: Q.SPRITE_NONE,sheet: 'counter' });
   }
});

Q.GameObject.extend("ballWatcher",{
    init: function() {this.p={}},
    update: function(dt){
        if(spawn){ 
            spawn = false;
            if(ballValue == 1) itemRefs[spawnY][spawnX] = this.stage.insert(new Q.Golfball({ x: tile(spawnX), y: tile(spawnY),value:ballValue}));
            else if(ballValue == 2 || ballValue == 3) itemRefs[spawnY][spawnX] = this.stage.insert(new Q.Golfball2({ x: tile(spawnX), y: tile(spawnY),value:ballValue}));
            else if(ballValue == 4) itemRefs[spawnY][spawnX] = this.stage.insert(new Q.Golfball3({ x: tile(spawnX), y: tile(spawnY),value:ballValue}));
            items[spawnY][spawnX] = 1;
        }
    }
});
Q.GameObject.extend("swooshWatcher",{
    init: function() {this.p={}},
    update: function(dt){
        if(swoosh){ 
            swoosh = false;
            swooshani = this.stage.insert(new Q.Swoosh({ x: tile(swooshX), y: tile(swooshY)}));
        }
    }
});

Q.scene('endGame',function(stage) {Q.audio.stop();Q.audio.play('death.mp3',{ loop: true });
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    newGame = true;Q.audio.stop();Q.audio.play('start.mp3');
    Q.clearStages();
    Q.stageScene('start');
  });
  box.fit(20);
});
Q.scene("level1",function(stage){    
    init();
    stage.insert(new Q.ballWatcher());
    stage.insert(new Q.swooshWatcher());
    var wallsprite = rand(3);
    var floorsprite = rand(3);
    console.log("set: "+wallsprite+" "+floorsprite);
    // This replaces Quintus' TileLayer.
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++){
            if(level[i][j] == 0){
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
            }
            if(level[i][j] == 1){
                if(wallsprite==0) stage.insert(new Q.Block({ x: tile(j), y: tile(i), z:50 }));
                else if(wallsprite==1) stage.insert(new Q.Block2({ x: tile(j), y: tile(i), z:50 }));
                else if(wallsprite==2) stage.insert(new Q.Block3({ x: tile(j), y: tile(i), z:50 }));
            }
            if(level[i][j] == 2) stage.insert(new Q.Stairs({ x: tile(j), y: tile(i) }));
            if(level[i][j] == 3){stage.insert(new Q.Carpet({ x: tile(j), y: tile(i)+8 }));
                var buyable = 0;
                if(level[i][j+1]==3&&level[i][j+2]==3) buyable = 0;
                else if(level[i][j-1]==3&&level[i][j+1]==3) buyable = 1;
                else if(level[i][j-1]==3&&level[i][j-2]==3) buyable = 2;
                stage.insert(new Q.Counter({ x: tile(j), y: tile(i) }));
                if(shopItems[buyable]==1) shopRefs[buyable] = stage.insert(new Q.Bepis({ x: tile(j), y: tile(i) }));
                else if(shopItems[buyable]==2) shopRefs[buyable] = stage.insert(new Q.Sandwich({ x: tile(j), y: tile(i) }));
                else if(shopItems[buyable]==3) shopRefs[buyable] = stage.insert(new Q.Filet({ x: tile(j), y: tile(i) }));
                else if(shopItems[buyable]==4) shopRefs[buyable] = stage.insert(new Q.Wedge({ x: tile(j), y: tile(i) }));
                else if(shopItems[buyable]==5) shopRefs[buyable] = stage.insert(new Q.Iron({ x: tile(j), y: tile(i) }));
                else if(shopItems[buyable]==6) shopRefs[buyable] = stage.insert(new Q.Driver({ x: tile(j), y: tile(i) }));
            }
            if(level[i][j] == 4) {
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
                stage.insert(new Q.Plant({ x: tile(j), y: tile(i) }));
            }
            if(level[i][j] == 5) {
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
                stage.insert(new Q.Filler1({ x: tile(j), y: tile(i)+8 }));
            }
            if(level[i][j] == 6) {
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
                stage.insert(new Q.Filler2({ x: tile(j), y: tile(i)+8 }));
            }
            if(level[i][j] == 7) {
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
                stage.insert(new Q.Filler3({ x: tile(j), y: tile(i)+8 }));
            }
            if(level[i][j] == 8) {
                if(floorsprite == 0) stage.insert(new Q.Floor({ x: tile(j), y: tile(i) }));
                else if(floorsprite == 1) stage.insert(new Q.Floor2({ x: tile(j), y: tile(i)+8 }));
                else if(floorsprite == 2) stage.insert(new Q.Floor3({ x: tile(j), y: tile(i)+8 }));
                stage.insert(new Q.Filler4({ x: tile(j), y: tile(i)+8 }));
            }
        }
    }
    for(var i = 0; i < chars.length; i++){
        for(var j = 0; j < chars[0].length; j++){
            if(items[i][j] == 1) itemRefs[i][j] = stage.insert(new Q.Golfball({ x: tile(j), y: tile(i)}));
            if(items[i][j] == 2) itemRefs[i][j] = stage.insert(new Q.Bepis({ x: tile(j), y: tile(i)}));
            if(items[i][j] == 3) itemRefs[i][j] = stage.insert(new Q.Sandwich({ x: tile(j), y: tile(i)}));
            if(items[i][j] == 4) itemRefs[i][j] = stage.insert(new Q.Filet({ x: tile(j), y: tile(i)}));
            // Iterate through each item and translate IDs to spawns
            if(chars[i][j] == 1) player = stage.insert(new Q.Player({ x: tile(j), y: tile(i), ty:i, tx:j, z:-50, health:health, weapon:weapon }));
            if(chars[i][j] == 2){ 
                charRefs[i][j] = enemies;
                charIds[enemies++] = stage.insert(new Q.Enemy({ x: tile(j), y: tile(i), ty:i, tx: j  }));
            }
        }
    }
    
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++){
           if(level[i][j]==1){
               if(wallsprite==0)stage.insert(new Q.Faux({ x: tile(j), y: tile(i)-16 }));
               else if(wallsprite==1)stage.insert(new Q.Faux2({ x: tile(j), y: tile(i)-16 }));
               else if(wallsprite==2)stage.insert(new Q.Faux3({ x: tile(j), y: tile(i)-16 }));
           }
           
         
        }
    }
    if(newGame) newGame2();
    stage.add("viewport").follow(player);

    $("#health").children(".value").text(player.p.health);
    $("#weapon").children(".value").text(player.p.weapon.name);      
});          

const SPRITES = "tiles.png, pickups.png, charas.png, start.png, swoosh.png, space.png, Carpet.png, grassfloor.png, faux.png,faux2.png,filler.png,chair.png,floor2.png,wall2.png, chair2.png, stool.png, table.png, wall3.png, floor3.png,faux3.png";
const DATA = "tiles.json, pickups.json, space.json, charas.json, filler.json,swoosh.json, mt.mp3, shop.mp3, death.mp3, fight.mp3, lobby.mp3, drop.mp3, swing.mp3, floor.mp3, purchase.mp3, yeh.mp3, ching.mp3, food.mp3, start.mp3";
Q.scene("start",function(stage){
    Q.audio.play('mt.mp3',{ loop: true });
stage.insert(new Q.Start({x:320,y:240}));
stage.insert(new Q.Space({x:350,y:320}));
});

Q.load(SPRITES + ", " + DATA, function() {
  Q.compileSheets("pickups.png", "pickups.json");
  Q.compileSheets("charas.png", "charas.json");
  Q.compileSheets("tiles.png", "tiles.json");
  Q.compileSheets("swoosh.png", "swoosh.json");
  Q.compileSheets("space.png", "space.json");
  Q.compileSheets("filler.png", "filler.json");
  Q.stageScene("start");
});         