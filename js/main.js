// Define canvas
var canvas    = document.getElementById("game"),
    ctx       = canvas.getContext('2d');

//define the variables of the background and images
var bg;

// Spaceships object
spaceships = {
    x    :335,
    y    : canvas.height-120,
    width:50,
    height:50
}

//load functions of the images and background
function loadMedia(){
    bg        = new Image();
    bg.src    = 'img/bg.jpg';
    bg.onload = function(){
        var interval = window.setInterval(frameLoop, 1000/55);
    }
}

function frameLoop() {
    drawBackground();
    drawShip();
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
