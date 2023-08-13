const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const points_numbers = document.getElementById("points_numbers");
const messageBox = document.getElementById("messageBox");
const textInMessageBox = document.getElementById("text");
const bouton_start = document.getElementById("bouton_start");

const audio = document.getElementById("audio");

let start = false;

canvas.height = 600;

const paddleWidth = 100;
const paddleHeight = 10;
const paddleSpeed = 7;
const ballRadius = 10;

let posXStartBrique = 50;
const posYStartBrique = 100;
let height = 20;
const maxRow = 5;
const maxBrique = 10;
const spaceY = 10;
const spaceX = 10;

if (window.innerWidth > 800) {
    canvas.width = 800;
} else {
    canvas.width = window.innerWidth;
    height = 15;
    posXStartBrique = 30;
}

let rightPressed = false;
let leftPressed = false;

class Brique {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}

class Paddle {
    constructor() {
        this.x = canvas.width / 2 - paddleWidth / 2;
        this.y = canvas.height - paddleHeight;
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.speed = paddleSpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    move() {
        if (rightPressed && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        else if (leftPressed && this.x > 0) {
            this.x -= this.speed;
        }
    }
};

const paddle = new Paddle();

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 2;
        this.vy = 7;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    move() {

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }

        if (this.y - this.radius < 0) {
            this.vy = -this.vy;
        }

        if (this.y + this.radius > paddle.y &&
            this.y - this.radius < paddle.y + paddle.height &&
            this.x + this.radius > paddle.x &&
            this.x - this.radius < paddle.x + paddle.width
        ) {

            if (this.y + this.radius > paddle.y && this.x < paddle.x + paddleWidth / 4) {
                this.vx = 2;
            } else if (this.y + this.radius > paddle.y && this.x > paddle.x + paddleWidth - paddleWidth / 4) {
                this.vx = -2;
            }

            this.vy = -this.vy;
        }

        this.draw();

        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            gameOver();
            return true;
        }

        return false;


    }
}

let ball = new Ball(canvas.width / 2, canvas.height - paddleHeight - ballRadius, ballRadius);
let bricks = [];

function createBricks() {

    let posX = posXStartBrique;
    let posY = posYStartBrique;

    for (let i = 0; i < maxRow; i++) {
        for (let j = 0; j < maxBrique; j++) {
            const width = (canvas.width - (maxBrique - 1) * spaceX - 2 * posXStartBrique) / maxBrique;

            bricks.push(new Brique(posX, posY, width, height));

            if (j < maxBrique - 1) {
                posX += width + spaceX;
            }
        }

        posX = posXStartBrique;
        posY += height + spaceY;
    }
}

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    paddle.draw();
    bricks.forEach(brick => brick.draw());

    if (start) {
        const gameOver = ball.move();

        if (!gameOver) {
            for (let i = 0; i < bricks.length; i++) {
                if (
                    ball.x + ball.radius > bricks[i].x &&
                    ball.x - ball.radius < bricks[i].x + bricks[i].width &&
                    ball.y + ball.radius > bricks[i].y &&
                    ball.y - ball.radius < bricks[i].y + bricks[i].height
                ) {
                    playSound("Sound/sound-brick.mp3");
                    bricks.splice(i, 1);
                    points_numbers.innerText++;
                    ball.vy = -ball.vy;
                    break;
                }
            }
        }

        if (bricks.length == 0) {
            gameWin();
        }

        paddle.move();
    }

    requestAnimationFrame(draw);
}

const gameOver = () => {
    start = false;
    textInMessageBox.textContent = "Vous avez perdu !";
    messageBox.classList.remove("cacheText");
    playSound("Sound/sound-defeat.mp3");
}

const gameWin = () => {
    start = false;
    textInMessageBox.textContent = "Félicitation !";
    messageBox.classList.remove("cacheText");
    playSound("Sound/sound-success.mp3");
}

const playSound = (src) => {
    audio.src = src;
    audio.currentTime = 0
    audio.play();
}

const showMessage = (message) => {
    textInMessageBox.textContent = message;
    messageBox.classList.toggle("cacheText");
}



const keyDownHandler = (e) => {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}
const keyUpHandler = (e) => {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


bouton_start.addEventListener("click", () => {
    ball = new Ball(canvas.width / 2, canvas.height - paddleHeight - ballRadius, ballRadius);
    paddle.x = canvas.width / 2 - paddleWidth / 2;
    bricks = [];
    createBricks();
    points_numbers.textContent = 0;
    showMessage("");
    start = true;
});

createBricks();
draw();
