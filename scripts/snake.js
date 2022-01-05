const rAF = window.requestAnimationFrame;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

const osbUp = document.getElementById('upButton')
const osbLeft = document.getElementById('leftButton')
const osbRight = document.getElementById('rightButton')
const osbDown = document.getElementById('downButton')

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


let speed = 5;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let coordX = 0;
let coordY = 0;

// game loop
function drawGame() {
    clearScreen();
    changeSnakePosition();

    checkAppleCollision();
    drawApple();
    drawSnake();
    drawSnakeCoordinates();
    drawScore();
    setTimeout(drawGame, 1000 / speed);

}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnakeCoordinates() {
    coordX = headX;
    coordY = headY;
    ctx.fillStyle = 'grey';
    ctx.font = '8pt verdana';
    ctx.fillText('x:' + coordX + ' y:' + coordY, 18, 18);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '10pt verdana';
    ctx.fillText('Score ' + score, canvas.width-70, 18);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i=0; i<snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    
    snakeParts.push(new SnakePart(headX, headY));
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }
}

function changeSnakePosition() {
    headX += xVelocity;
    headY += yVelocity;
    headX = headX % 20;
    headY = headY % 20;

    if (headX < 0) {
        headX = tileCount - 1;
        
    }
    if (headY < 0) {
        headY = tileCount - 1;
    }
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize+2, tileSize+2)
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

document.addEventListener('keydown', keyDown);

window.addEventListener("gamepadconnected", gamepadDown);

function gamepadDown(event) {
    if (event.gamepad.buttons[14]){
        console.log("left")
    }
}

//keyboard controlls setup
function keyDown(event) {
    switch(event.keyCode) {
        case 37: //go left
            if (xVelocity == 1)
                return;
            xVelocity = -1;
            yVelocity = 0;
            break
        case 65: //go left (a button)
            if (xVelocity == 1)
                return;
            xVelocity = -1;
            yVelocity = 0;
            break
        case 38: //go up
            if (yVelocity == 1)
                return;
            xVelocity = 0;
            yVelocity = -1;
            break
        case 87: //go up (w button)
            if (yVelocity == 1)
                return;
            xVelocity = 0;
            yVelocity = -1;
            break
        case 39: //go right
            if (xVelocity == -1)
                return;
            xVelocity = 1;
            yVelocity = 0;
            break
        case 68: //go right (d button)
            if (xVelocity == -1)
                return;
            xVelocity = 1;
            yVelocity = 0;
            break
        case 40: //go down
            if (yVelocity == -1)
                return;
            xVelocity = 0;
            yVelocity = 1;
            break
        case 83: //go down (s button)
            if (yVelocity == -1)
                return;
            xVelocity = 0;
            yVelocity = 1;
            break
    }
}

// gamepad controlls setup
function updateLoop() {
    let gp = navigator.getGamepads()[0];

    gpControl(gp);
    
    rAF(updateLoop);
}

function connectGamepad(event) {
	console.log(event.gamepad)
	rAF(updateLoop);

}

function gpControl(gp) {
    /* Gamepad layout:
    up = 12
    down = 13
    left = 14
    right = 15

    A = 0
    B = 1
    X = 2
    Y = 3
    */

    //up
    if (gp.buttons[12].pressed) {
        if (yVelocity == 1)
            return;
        xVelocity = 0;
        yVelocity = -1;
    }
    //down
    if (gp.buttons[13].pressed) {
        if (yVelocity == -1)
            return;
        xVelocity = 0;
        yVelocity = 1;
    }
    //left
    if (gp.buttons[14].pressed) {
        if (xVelocity == 1)
            return;
        xVelocity = -1;
        yVelocity = 0;
    }
    //right
    if (gp.buttons[15].pressed) {
        if (xVelocity == -1)
            return;
        xVelocity = 1;
        yVelocity = 0;
    }
}

// onscreen controlls setup
//up
osbUp.addEventListener('click', function() {
    if (yVelocity == 1)
        return;
    xVelocity = 0;
    yVelocity = -1;
});
//left
osbLeft.addEventListener('click', function() {
        if (xVelocity == 1)
            return;
        xVelocity = -1;
        yVelocity = 0;
});
//right
osbRight.addEventListener('click', function() {
    if (xVelocity == -1)
        return;
    xVelocity = 1;
    yVelocity = 0;
});
//down
osbDown.addEventListener('click', function() {
    if (yVelocity == -1)
        return;
    xVelocity = 0;
    yVelocity = 1;
});

drawGame()

window.addEventListener('gamepadconnected', connectGamepad);