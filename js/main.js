// Define canvas
var canvas    = document.getElementById("game"),
    ctx       = canvas.getContext('2d');

//define the variables of the background and images
var bg,

//define the variables of the Keywords events
    keyword = {},

//define the variables of the shots
    shots = [],

// Spaceships object
spaceships = {
    x    :335,
    y    : canvas.height-120,
    width:50,
    height:50
};

//load functions of the images and background
function frameLoop() {
    moveSpaceships()
    drawBackground();
    drawShip();
    movingShots();
    drawShots()
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
