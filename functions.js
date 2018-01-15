function collide(y,x){
if(level[y][x] == 1 || level[y][x] == 4 || level[y][x] >=5||chars[y][x] != 0){
        console.log("level: "+level[y][x]+" char: "+chars[y][x]);
        return true;
    }
    return false;
} 
function generateLevel() {
  return createDungeon(rand(2)+3, rand(2)+3, rand(3)+6, rand(3)+6);
}
function createDungeon(mw, mh, rw, rh) {
  var w = rw * mw + 1;
  var h = rh * mh + 1;
  var tiles = createArray(h, w);
  tiles = wallIn(tiles, h, w, rh, rw);
  var map = createArray(mh, mw);
  map = traverse(map, mh, mw);
  for(my = 0; my < mh; my++) {
    for(mx = 0; mx < mw; mx++) {
      if(map[my][mx].r) {
        var x = mx * rw + rw;
        var door = generateDoor(rh);
        for(y = 0; y < rh; y++) {
          tiles[1 + y + my * rh][x] = door[y];
        }
      }
      if(map[my][mx].d) {
        var y = my * rh + rh;
        var door = generateDoor(rw);
        for(x = 0; x < rh; x++) {
          tiles[y][1 + x + mx * rw] = door[x];
        }
      }
    }
  }
  tiles = fixOuterWalls(tiles, w, h);
  return tiles;
}
function wallIn(arr, h, w, rh, rw) {
  for(y = 0; y < h; y++) {
    for(x = 0; x < w; x++) {
      if(y % rh == 0 || x % rw == 0) {
        arr[y][x] = 1
      } else {
        arr[y][x] = 0;
      }
    }
  }
  return arr;
}
function fixOuterWalls(arr, w, h) {
  for(y = 0; y < h; y++) {
    for(x = 0; x < w; x++) {
      if(arr[y][x] == undefined) {
        arr[y][x] = 0;
      }
    }
  }
  for(y = 0; y < h; y++) {
    arr[y][0] = 1;
    arr[y][w-1] = 1;
  }
  for(x = 0; x < w; x++) {
    arr[0][x] = 1;
    arr[h-1][x] = 1;
  }
  return arr;
}
function traverse(arr, mh, mw) {
  // easy part
  for(y = 0; y < mh; y++) {
    for(x = 0; x < mw; x++) {
      arr[y][x] =
        { l: false
        , r: false
        , u: false
        , d: false
        , v: false
        , d: 0
        }
    }
  }
  {
    var y = rand(mh);
    var x = rand(mw);
    arr[y][x].v = true;
  }
  // [EXPLETIVE]-ing hard part
  do {
    var y = rand(mh);
    var x = rand(mw);
    if(!arr[y][x].v) { continue; }
    switch(rand(4)) {
      case 0:
        if(x > 0 && arr[y][x-1].v) { continue; }
        arr[y][x].l = true;
        if(x > 0) { arr[y][x-1].r = true; arr[y][x-1].v = true; }
        continue;
      case 1:
        if(x < mw-1 && arr[y][x+1].v) { continue; }
        arr[y][x].r = true;
        if(x < mw-1) { arr[y][x+1].l = true; arr[y][x+1].v = true; }
        continue;
      case 2:
        if(y > 0 && arr[y-1][x].v) { continue; }
        arr[y][x].u = true;
        if(y > 0) { arr[y-1][x].d = true; arr[y-1][x].v = true; }
        continue;
      case 3:
        if(y < mh-1 && arr[y+1][x].v) { continue; }
        arr[y][x].d = true;
        if(y < mh-1) { arr[y+1][x].u = true; arr[y+1][x].v = true; }
        continue;
    }
  } while(!validateMap(arr, mh, mw));
  return arr;
}
function decorateMap(arr, mh, mw) {
  for(y = 0; y < mh; y++) {
    for(x = 0; x < mw; x++) {
      if(rand(3) == 0) {
        map[y][x].d = rand(4)+1;
      }
    }
  }
  return arr;
}
function decorateRoom(arr, my, rh, mx, rw) {
  // later
}
function validateMap(arr, mh, mw) {
  for(y = 0; y < mh; y++) {
    for(x = 0; x < mw; x++) {
      if(!arr[y][x].v) { return false; }
    }
  }
  return true;
}
function generateDoor(n) {
  var arr = new Array(n);
  if(rand(6) == 0) {
    for(i = 0; i < n; i++) {
      if(i != n - 1) {
        arr[i] = 0;
      } else {
        arr[i] = 1;
      }
    }
  } else {
    for(i = 0; i < n; i++) {
      arr[i] = 1;
    }
  }
  arr[rand(n-3)+1] = 0;
  if(rand(3) == 0) { arr[rand(n-3)+1] = 0; }
  return arr;
}
function createArray(h, w) {
  var arr = new Array(h);
  if(w) {
    for(y = 0; y < h; y++) {
      arr[y] = new Array(w);
    }
  }
  return arr;
}
function rand(x) {
  return Math.floor(Math.random() * x);
}
function print2DArray(arr) {
  var str = "";
  for(y = 0; y < arr.length; y++) {
    for(x = 0; x < arr[0].length; x++) {
      str = str + "" + arr[y][x];
    }
    str = str + "\n";
  }
  console.log(str);
}      
function tileCoord(txy) {
  return txy * TILE_SIZE;
}            
function tile(cell){
    return cell * WH + WH/2;
}         
function getTile(xy){
    return Math.round(xy / 32)-1;
}
function checkItems(items){
    if(items[player.p.ty][player.p.tx] == 1){
        items[player.p.ty][player.p.tx] = 0;Q.audio.play('purchase.mp3');
        balls+=(itemRefs[player.p.ty][player.p.tx].p.value);
        console.log(itemRefs[player.p.ty][player.p.tx].p.value);
        itemRefs[player.p.ty][player.p.tx].destroy();
        spawn = false;
        $("#balls").children(".value").text(balls);
    }
    else if(items[player.p.ty][player.p.tx] == 2){
        items[player.p.ty][player.p.tx] = 0; Q.audio.play('food.mp3');
        updateHealth(itemRefs[player.p.ty][player.p.tx].p.health);
        itemRefs[player.p.ty][player.p.tx].destroy();
    }
    else if(items[player.p.ty][player.p.tx] == 3){
        items[player.p.ty][player.p.tx] = 0;Q.audio.play('food.mp3');
        updateHealth(itemRefs[player.p.ty][player.p.tx].p.health);
        itemRefs[player.p.ty][player.p.tx].destroy();
    }
    else if(items[player.p.ty][player.p.tx] == 4){
        items[player.p.ty][player.p.tx] = 0;Q.audio.play('food.mp3');
        updateHealth(itemRefs[player.p.ty][player.p.tx].p.health);
        itemRefs[player.p.ty][player.p.tx].destroy();
    }
}
function checkStairs(){
    if(level[player.p.ty][player.p.tx] == 2){
        weapon = player.p.weapon;
        health = player.p.health + 5;
        health = (health > 25) ? 25: health;
        floor++;
        $("#floor").children(".value").text(floor);
    Q.audio.play('floor.mp3');Q.audio.stop();
        Q.clearStages();
        Q.stageScene('level1');
    }
}
function checkShop(){
    var buyable = 0;
    if(level[player.p.ty][player.p.tx+1]==3&&level[player.p.ty][player.p.tx+2]==3) buyable = 0;
    else if(level[player.p.ty][player.p.tx-1]==3&&level[player.p.ty][player.p.tx+1]==3) buyable = 1;
    else if(level[player.p.ty][player.p.tx-1]==3&&level[player.p.ty][player.p.tx-2]==3) buyable = 2;
    if(level[player.p.ty][player.p.tx]==3&&shopItems[buyable]>=0){
        if(!shopMusic){Q.audio.stop();
            shopMusic = true;
    Q.audio.play('shop.mp3',{ loop: true });
        }
        var price = prices[shopItems[buyable]];
        var itemname = names[shopItems[buyable]];
        /*if(balls>=price){ balls -= price;
        $("#balls").children(".value").text(balls);}*/
        showShop = true;
        if(shopItems[buyable]==1) 
                    $("#s").css("display","none");
                else 
                    $("#s").css("display","inline-block");
        $("#shopitem").css("display","inline-block");
        $("#price").css("display","inline-block");
        $("#shopitem").children(".value").text(itemname);
        $("#price").children(".value").text(price);            
    }
    else{
        if(showShop){
            if(shopMusic){shopMusic = false;Q.audio.stop();
    if(enemies<3) 
    Q.audio.play('lobby.mp3',{ loop: true });
   else  Q.audio.play('fight.mp3',{ loop: true });}
            showShop = false;
            $("#shopitem").css("display","none");
            $("#price").css("display","none");
        }
    }
}
function equip(weapon){
    player.p.weapon=weapon;
    $("#weapon").children(".value").text(weapon.name);
}
function canMove(){
    if(!(turn == 0 && player.p.vx == 0 && player.p.vy == 0)){
        console.log("turn: "+turn+" enemies: "+enemies+" vx: "+player.p.vx+" vy: "+player.p.vy);
    }
    return turn == 0 && player.p.vx == 0 && player.p.vy == 0;
}
function kill(xoff, yoff){
    
}
function updateHealth(change){    
     player.p.health+=change;
     if(player.p.health<=0) player.p.health = 0;
     else if(player.p.health>player.p.maxhealth) player.p.health = player.p.maxhealth;
     $("#health").children(".value").text(player.p.health);
     if(player.p.health<=0){
         player.destroy();
         Q.stageScene("endGame",1, { label: "You Died" }); 
     }
}
function move(x,y,obj){    
    var id = parseInt(charRefs[obj.p.ty][obj.p.tx]);
    var dy = obj.p.ty+y;
    var dx = obj.p.tx+x;
    var rdy = obj.p.ty-y;
    var rdx = obj.p.tx-x;
    if((dx>0&&dx<level[0].length-1&&
        dy>0&&dy<level.length-1)&&
        chars[dy][dx] == 0 && 
        level[dy][dx] === 0){
      chars[obj.p.ty][obj.p.tx] = 0;
      obj.p.ty = dy;
      obj.p.tx = dx;
      obj.p.y = tile(obj.p.ty);
      obj.p.x = tile(obj.p.tx);
      chars[obj.p.ty][obj.p.tx] = 2;
      charRefs[obj.p.ty][obj.p.tx] = id;
      charRefs[obj.p.ty-y][obj.p.tx-x] = -1;
    }
    else if(dy>=0&&dx>=0&&chars[dy][dx] == 1){
         Q.audio.play('yeh.mp3');
        updateHealth(obj.p.weapon.damage*-1);
    }
}
function movePlayer(x,y,obj){
    var dy = obj.p.ty + y;
    var dx = obj.p.tx + x;
    if(turn == 1) turn = 0;
    if(canMove() && !collide(dy, dx)){
      obj.p.vx = 128*x;
      obj.p.vy = 128*y;
     /* if(level[dy+1][dx]==1){
          faux.p.x = tile(dx);
          faux.p.y = tile(dy)+16;
      }*/
    }
    else if(chars[dy][dx] == 2){
      var target = charIds[charRefs[dy][dx]];
      Q.audio.play('swing.mp3');
      swooshX = dx;
      swooshY = dy;
      swoosh = true;
      target.p.health-=obj.p.weapon.damage;
      if(target.p.health <=0){
          target.destroy();
          chars[dy][dx] = 0;
          enemies--;
          if(items[dy][dx]==0){
          ballValue = target.p.power;
          console.log(ballValue);
          spawn = true;
          }
          
    Q.audio.play('drop.mp3');
          spawnX = dx;
          spawnY = dy;
      }
      if(enemies > 0) turn=1; 
    }              
}
function slidePlayer(x,y,obj){    
    obj.p.vx = 0;
    obj.p.vy = 0;
    if(x!=0) obj.p.x = tile(obj.p.tx+x);
    if(y!=0) obj.p.y = tile(obj.p.ty+y);
    chars[obj.p.ty][obj.p.tx]=0;
    obj.p.tx+=x;
    obj.p.ty+=y;
    chars[obj.p.ty][obj.p.tx]=1;
    if(enemies>0) turn = 1; 
}
function newGame2(){
    floor = 1;
    player.p.health = player.p.maxhealth;
    player.p.weapon = club_putter;
    balls = 0;
    $("#balls").children(".value").text(balls);
    $("#floor").children(".value").text(floor);
    newGame = false;
} 
function place(type,placed){
    var pl = false;
    while(!pl){
        var w = Math.round(Math.random()*(level[0].length-2))+1;
        var h = Math.round(Math.random()*(level.length-2))+1;
        console.log(h+" "+level.length);
        if(level[h][w] == 0){
            if(type==1 && chars[h][w] == 0) chars[h][w] = placed;
            else if(type==2 && items[h][w] == 0) items[h][w] = placed;
            else if(type==3 && level[h][w] == 0) level[h][w] = placed;
            pl = true;
        }
    }
}
function diagnostics(){
  console.log("/********* LOG ***********/");
  print2DArray(level);
  console.log("/********* Characters ***********/");
  print2DArray(chars);
  console.log("/********* Diagnostics ***********/");
  console.log("level.length: "+level.length+" levelLast: "+levelLast+" level[0].length: "+level[0].length+" chars.length: "+chars.length);
}
function regenerate(){
        if(level) levelLast = level.length;
    level = generateLevel();
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++){
            if(level[i][j] == null) level = generateLevel(); break;
        }
    }
    
    turn = 0;
    enemies = 0;
    chars = [];
    items = [];
    itemRefs = [];
    charRefs = [];
    // Initialization
    for(var i = 0; i < level.length; i++){
        chars[i]    = [];
        charRefs[i] = [];
        items[i]    = [];
        itemRefs[i] = [];
        for(var j = 0; j < level[0].length; j++){
            charRefs[i][j] = -1;
            chars[i][j]    = 0;
            items[i][j]    = 0;
        }
    }

    /******************/
    /** Characters ****/
    /* 1: Player ******/
    /* 2: Enemy *******/
    /******************/
    /***** Items ******/
    /* 1: Ball ********/
    /* 2: Food ********/
    /* 3: Club ********/
    /******************/
    /**** Level *******/
    /* 1. Wall ********/
    /* 2. Stairs ******/
    /* 3. Shop Counter*/
    /* 4. Plant *******/
    /******************/
    
    // Player
    place(1,1);
    
    // Stairs
    place(3,2);
}
function init(){        
    if(level) levelLast = level.length;
    level = generateLevel();
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++){
            if(level[i][j] == null) level = generateLevel(); break;
        }
    }
    
    turn = 0;
    enemies = 0;
    chars = [];
    items = [];
    itemRefs = [];
    charRefs = [];
    // Initialization
    for(var i = 0; i < level.length; i++){
        chars[i]    = [];
        charRefs[i] = [];
        items[i]    = [];
        itemRefs[i] = [];
        for(var j = 0; j < level[0].length; j++){
            charRefs[i][j] = -1;
            chars[i][j]    = 0;
            items[i][j]    = 0;
        }
    }

    /******************/
    /** Characters ****/
    /* 1: Player ******/
    /* 2: Enemy *******/
    /******************/
    /***** Items ******/
    /* 1: Ball ********/
    /* 2: Bepis *******/
    /* 3: Sandwich ****/
    /* 4: Filet *******/
    /* 5: Filler ******/
    /* 6: Filler ******/
    /* 7: Filler ******/
    /* 8: Filler ******/
    /******************/
    /**** Level *******/
    /* 1. Wall ********/
    /* 2. Stairs ******/
    /* 3. Shop Counter*/
    /* 4. Plant *******/
    /******************/
    
    // Player
    place(1,1);
    
    // Stairs
    //place(3,2);
    {
        var plop = false;
        while(!plop){
            var rngX = Math.round(Math.random()*(level[0].length-3))+1;
            var rngY = Math.round(Math.random()*(level.length-3))+1;
            var n = 0;
            {
                if(level[rngY - 1][rngX - 1] == 1) { n++; }
                if(level[rngY - 1][rngX    ] == 1) { n++; }
                if(level[rngY - 1][rngX + 1] == 1) { n++; }
                if(level[rngY    ][rngX - 1] == 1) { n++; }
                if(level[rngY    ][rngX + 1] == 1) { n++; }
                if(level[rngY + 1][rngX - 1] == 1) { n++; }
                if(level[rngY + 1][rngX    ] == 1) { n++; }
                if(level[rngY + 1][rngX + 1] == 1) { n++; }
            }
            if(rngY > 1 && rngY < level.length - 2 && rngX > 1 && rngX < level[0].length - 2
                && level[rngY][rngX] == 0 && (n == 0 || n == 1 || n == 3 || n == 5)) {
                level[rngY][rngX] = 2; //stairs
                plop = true;
            }
            
        }
    } 
    
    
    // Plant
    var plants = Math.round(Math.random()*6);
    for(var i = 0; i < plants; i++){
        var plop = false;
        while(!plop){
            var rngX = Math.round(Math.random()*(level[0].length-3))+1;
            var rngY = Math.round(Math.random()*(level.length-3))+1;
            //console.log(rngX+" "+rngY+" "+level.length+" "+level[0].length);
            if(rngY>1&&rngY<level.length-2&&rngX>1&&rngX<level[0].length-2&&level[rngY][rngX]==0 &&
                (level[rngY][rngX-1]==1&&level[rngY-1][rngX]==1&&level[rngY-1][rngX-1]==1)||
                (level[rngY][rngX+1]==1&&level[rngY-1][rngX]==1&&level[rngY-1][rngX+1]==1)||
                (level[rngY][rngX-1]==1&&level[rngY+1][rngX]==1&&level[rngY+1][rngX-1]==1)||
                (level[rngY][rngX+1]==1&&level[rngY+1][rngX]==1&&level[rngY+1][rngX+1]==1)){                
                level[rngY][rngX] = 4;
                plop = true;
            }
            
        }
    }
    
    
    // Shop
    var chance = rand(3);
    if(chance == 0){
        var pl = false;
        while(!pl){
            var rngX = Math.round(Math.random()*level[0].length);
            var rngY = Math.round(Math.random()*level.length);
            while(level == null || level[rngY]==null || level[rngY][rngX] == null) regenerate();
            if(level[rngY][rngX] == 0 && level[rngY][rngX+1] == 0 && level[rngY][rngX+2] == 0){
                level[rngY][rngX] = 3;
                level[rngY][rngX+1] = 3;
                level[rngY][rngX+2] = 3;
                
                for(var i = 0; i < 3; i++)
                    shopItems[i] = rand(6)+1;
                pl = true;
            }
        }
    }
    
    // Furniture
    var num = rand(8)+10;
    for(var i = 0; i < num; i++){       
        var type = rand(4)+5;
        var plop = false;
        while(!plop){
            var rngX = Math.round(Math.random()*(level[0].length-3))+1;
            var rngY = Math.round(Math.random()*(level.length-3))+1;
            var n = 0;
            {
                if(level[rngY - 1][rngX - 1] == 1) { n++; }
                if(level[rngY - 1][rngX    ] == 1) { n++; }
                if(level[rngY - 1][rngX + 1] == 1) { n++; }
                if(level[rngY    ][rngX - 1] == 1) { n++; }
                if(level[rngY    ][rngX + 1] == 1) { n++; }
                if(level[rngY + 1][rngX - 1] == 1) { n++; }
                if(level[rngY + 1][rngX    ] == 1) { n++; }
                if(level[rngY + 1][rngX + 1] == 1) { n++; }
            }
            if(rngY > 1 && rngY < level.length - 2 && rngX > 1 && rngX < level[0].length - 2
                && level[rngY][rngX] == 0 && (n == 0 || n == 1 || n == 3 || n == 5)) {
                level[rngY][rngX] = type;
                plop = true;
            }
            
        }
    } 
    // Enemies
    var num = rand(6);
    if(num<3) 
    Q.audio.play('lobby.mp3',{ loop: true });
   else  Q.audio.play('fight.mp3',{ loop: true });
    for(var i = 0; i < num; i++){        
        place(1,2);
    }
   
    // Items
    var num = rand(4)+1;
    for(var i = 0; i < num; i++){       
        var type = rand(4)+1;
        place(2,type);
    } 
}
function buy(){
    if(level[player.p.ty][player.p.tx]==3){
        var buyable = 0;
        if(level[player.p.ty][player.p.tx+1]==3&&level[player.p.ty][player.p.tx+2]==3) buyable = 0;
        else if(level[player.p.ty][player.p.tx-1]==3&&level[player.p.ty][player.p.tx+1]==3) buyable = 1;
        else if(level[player.p.ty][player.p.tx-1]==3&&level[player.p.ty][player.p.tx-2]==3) buyable = 2;
        if(shopItems[buyable]>=0){
            var price = prices[shopItems[buyable]];
            if(balls>=price){  Q.audio.play('ching.mp3');
                balls -= price;
                $("#balls").children(".value").text(balls);
                if(shopItems[buyable] == 1){  
                    Q.audio.play('food.mp3');
                    updateHealth(food_bepis.health);
                }
                else if(shopItems[buyable] == 2){  
                    Q.audio.play('food.mp3');
                    updateHealth(food_sandwich.health);
                }
                else if(shopItems[buyable] == 3){  
                    Q.audio.play('food.mp3');
                    updateHealth(food_filet.health);
                }
                else if(shopItems[buyable] == 4){ 
                    player.p.weapon = club_wedge; 
                    $("#weapon").children(".value").text(player.p.weapon.name);
                }
                else if(shopItems[buyable] == 5){ 
                    player.p.weapon = club_iron; 
                    $("#weapon").children(".value").text(player.p.weapon.name);
                }
                else if(shopItems[buyable] == 6){ 
                    player.p.weapon = club_driver; 
                    $("#weapon").children(".value").text(player.p.weapon.name);
                }
                shopItems[buyable] = -1;
                shopRefs[buyable].destroy();
                $("#shopitem").css("display","none");
                $("#price").css("display","none");
            }
        }
    }else diagnostics();
}
// for use in generating enemies
function randomPower() {
  var pow = rand(100);
  pow = pow + floor * 2
  if(pow < 60) {
    return 1;
  } else if(pow < 90) {
    return 2;
  } else if(pow < 120) {
    return 3;
  } else {
    return 4;
  }
}

// for use in generating enemies
function getWeapon(power) {
  switch(power) {
    case 1:
      return club_putter;
    case 2:
      return club_wedge;
    case 3:
      return club_iron;
    case 4:
      return club_driver;
  }
}
// enemy
function getHealth(power) {
    switch(power) {
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 6;
        case 4:
            return 9;
    }
}
