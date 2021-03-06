// Define canvas
var canvas    = document.getElementById("game"),
    ctx       = canvas.getContext('2d');

//define the variables of the background and images
var bg,

// Anwser Tex
    answerText = {
        counter  : -1,
        title    : "",
        subtitle : ""
    },

// define the enemies
    enemies = [],

//define the variables of the enemies hots
    enemiesShots=[],

//define the variables of the game object
    game = {
        status: "init"
    },

//define the variables of the Keywords events
    keyword = {},

//define the variables of the shots
    shots = [],

// Spaceships object
spaceships = {
    x     :335,
    y     : canvas.height-120,
    width :50,
    height:50,
    count : 0
};

//load functions of the images and background
function frameLoop() {
    moveSpaceships()
    drawBackground();
    drawShip();
    movingShots();
    drawShots();
    drawEnemies();
    updateEnemies();
    contactVerify();
    drawEnemiesShots();
    moveEnemiesShots();
    updateGameStatus();
    DrawAnswer();
}

// Random function
function random(infr,supr){
    var probability = supr - infr;
    var a = Math.random()*probability;
        a = Math.floor(a);
    return parseInt(infr + a);
}
function loadMedia(){
    bg        = new Image();
    bg.src    = 'img/bg.jpg';
    bg.onload = function(){
        var interval = window.setInterval(frameLoop, 1000/55);
    }
}

function drawBackground(){
    ctx.drawImage(bg,0,0);
}

function drawShip(){
    ctx.save();
    ctx.fillStyle ='#FFFFFF';
    ctx.fillRect(spaceships.x,spaceships.y,spaceships.width,spaceships.height);
    ctx.restore();
}

loadMedia();

//Keywords events

function addKeywordsEvents(){
    addEvents(document,'keydown',function(e){
        keyword[e.keyCode] = true;
    });
    addEvents(document,"keyup",function(e){
        keyword[e.keyCode] = false;
        //debugger;
    });

    function addEvents(element, eventName, fn){
        if (element.addEventListener) {
            element.addEventListener(eventName,fn,false);
        }else if (element.attachEvent) {
            element.attachEvent(eventName,fn);
        }
    };
}
addKeywordsEvents();

// Move Spaceships

function moveSpaceships(){

    if (keyword[37]) { // Move to left
        spaceships.x -=10;
        if (spaceships.x < 0) {
            spaceships.x = 0;
        }
    }
    if (keyword[39]) { // Move to Right
        spaceships.x +=10;
        limit = canvas.width - spaceships.width;
        if (spaceships.x > limit) {
            spaceships.x = limit;
        }
    }

    if (keyword[32]) { // event of shot
        if (!keyword.fire) {
            fire();
            keyword.fire = true;
        }
    }else{
        keyword.fire = false;
    }

    if (spaceships.state == "hit") {
        spaceships.count++;
        if(spaceships.count>=0){
            spaceships.count = 0;
            spaceships.state="dead";
            game.status = "game over";
            answerText.title ="Game Over";
            answerText.subtitle = "Press the R key to restart";
            answerText.counter = 0;
        }
    }
}

// Shoot laser bullets :)
function movingShots(){
    for (var i in shots) {
        shot = shots[i];
        shot.y-=2;
    }
    //deleting shots
    shots = shots.filter(function(shot){
        return shot.y > 0
    });
}
// Add shots
function fire(){
    shots.push({
        x     : spaceships.x+20,
        y     : spaceships.y-10,
        width : 10,
        height: 10
    });
}

function drawShots(){
    ctx.save();
    ctx.fillStyle = "#FFFFFF";

    for (var i in shots) {
        shot = shots[i];
        ctx.fillRect(shot.x,shot.y,shot.width,shot.height);
    }
    ctx.restore();
}

//Add Enemies

function drawEnemies(){
    for (i  in enemies) {
        var enemy = enemies[i];
        ctx.save();
        if (enemy.state=="alive") {
            ctx.fillStyle ="#FF0000";
        }else {
            ctx.fillStyle ="#000000";
        }
        ctx.fillRect(enemy.x,enemy.y,enemy.width,enemy.height);
        ctx.restore();
    }
}

function updateEnemies(){
    if (game.status == "init") {
        for (var i = 0; i < 10; i++) {
            enemies.push({
                x: 10 + i*50,
                y: 10,
                width: 40,
                height: 40,
                state: "alive",
                count: 0
            });
        }
        game.status ="playing";
    }
    for (var i in enemies) {
        var enemy = enemies[i];
        if (!enemy) continue;
        if(enemy && enemy.state=="alive"){
            enemy.count++;
            enemy.x += Math.sin(enemy.count*Math.PI/90)*4;
            if(random(0, enemies.length*10)==4){
                enemiesShots.push(addEnemiesShots(enemy));
            }
        }
        if (enemy && enemy.state=="hit") {
            enemy.count++;
            if (enemy.count>10) {
                enemy.state="dead";
                enemy.count=0;
            }
        }
        enemies = enemies.filter(function(enemy){
            if (enemy && enemy.state!="dead") return true;
            return false;
        });
    }

    function addEnemiesShots(enemy){
        return {
            x: enemy.x,
            y: enemy.y,
            width:  5,
            height: 5,
            count: 0
        }
    }
}

//impacts of shots

function hits(a,b){
    hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width){
        if (b.y + b.height >= a.y && b.y < a.y + a.width) {
            hit = true;
        }
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true;
        }
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {

        }
    }
    return hit;
}

function contactVerify(){
    for (var i in shots) {
        shot = shots[i];
        for (var j in enemies) {
            enemy = enemies[j];
            if(hits(shot,enemy)){
                enemy.state="hit";
                enemy.count=0;
            }
        }
    }
    if (spaceships.state =="hit" || spaceships.state=="dead") return;
    for (var i in enemiesShots){
        var shot = enemiesShots[i];
        if(hits(shot,spaceships)){
            spaceships.state ="hit";
            // spaceships.count=
            console.log("contacto");
        }
    }
}
// Add enemies shots
function drawEnemiesShots(){
    for (var i in enemiesShots) {
        var shot = enemiesShots[i];
        ctx.save();
        ctx.fillStyle ="yellow";
        ctx.fillRect(shot.x,shot.y,shot.width,shot.height);
        ctx.restore();
    }
}

function moveEnemiesShots(){
    for (var i in enemiesShots) {
        var shots = enemiesShots[i];
        shots.y += 5;
    }
    enemiesShots = enemiesShots.filter(function(shots){
        return shots.y < canvas.height;
    });
}

// Game Status

function updateGameStatus(){
    if(game.status =="playing" && enemies.length == 0){
        game.status          = "win";
        answerText.title     = "You Won!";
        answerText.subtitle  = "Press the R key to restart";
        answerText.counter   = 0;
    }
    if (answerText.counter >= 0) {
        answerText.counter++;
    }
    if((game.status == "game over" || game.status =="win") && keyword[82]){
        game.status = "init";
        spaceships.state ="alive";
        answerText.counter =-1;
    }
}

function DrawAnswer(){
    if(answerText.counter == -1) return;
    var alpha = answerText.counter/50.0;
    if(alpha > 1){
        for (var i in enemies) {
            delete enemies[i];
        }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if(game.status =="game over"){
        ctx.fillStyle ="#FFFFFF";
        ctx.font ="Bold 40pt Arial";
        ctx.fillText(answerText.title,220,200);
        ctx.font ="14pt Arial";
        ctx.fillText(answerText.subtitle,250,250);
    }

    if(game.status =="win"){
        ctx.fillStyle ="#FFFFFF";
        ctx.font ="Bold 40pt Arial";
        ctx.fillText(answerText.title,250,200);
        ctx.font ="14pt Arial";
        ctx.fillText(answerText.subtitle,260,250);
    }
}
