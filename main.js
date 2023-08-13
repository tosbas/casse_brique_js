const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const points_numbers = document.getElementById("points_numbers");
const messageBox = document.getElementById("messageBox");
const textInMessageBox = document.getElementById("text");
const bouton_start = document.getElementById("bouton_start");
const helper = document.getElementById("helper");

const audio = document.getElementById("audio");

let start = false;
let startLaunch = false;

canvas.height = 600;

//Paddle conf 
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_SPEED = 7;

//Ball conf
const BALL_RADIUS = 10;
const BALL_VX = 2;
const BALL_VY = 5;

//Briques conf
let posXStartBrique = 50;
let height = 20;

const POSY_START_BRIQUE = 100;
const MAX_ROW = 5;
const MAX_BRIQUES = 5;
const BRIQUES_SPACEY = 30;


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
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
    }

    draw() {
        ctx.fillStyle = this.color;
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
        this.x = canvas.width / 2 - PADDLE_WIDTH / 2;
        this.y = canvas.height - PADDLE_HEIGHT;
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.speed = PADDLE_SPEED;
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

            if (!startLaunch) {
                ball.x += this.speed;
            }

        }
        else if (leftPressed && this.x > 0) {
            this.x -= this.speed;

            if (!startLaunch) {
                ball.x -= this.speed;
            }

        }
    }
};

const paddle = new Paddle();

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = BALL_VX;
        this.vy = BALL_VY;
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

            if (this.y + this.radius > paddle.y && this.x < paddle.x + PADDLE_WIDTH / 6) {
                this.vx = BALL_VX;
            } else if (this.y + this.radius > paddle.y && this.x > paddle.x + PADDLE_WIDTH - PADDLE_WIDTH / 6) {
                this.vx = -BALL_VX;
            }

            this.vy = -this.vy;
        }

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

let ball = new Ball(canvas.width / 2, canvas.height - PADDLE_HEIGHT - BALL_RADIUS, BALL_RADIUS);
let bricks = [];

function createBricks() {

    let posX = posXStartBrique;
    let posY = POSY_START_BRIQUE;

    for (let i = 0; i < MAX_ROW; i++) {
        for (let j = 0; j < MAX_BRIQUES; j++) {
            const width = (canvas.width - (MAX_BRIQUES - 1) * BRIQUES_SPACEY - 2 * posXStartBrique) / MAX_BRIQUES;

            const h = Math.floor(Math.random() * 358);
            const s = 100;
            const l = 50;

            const color = `hsl(${h},${s}%, ${l}%)`;

            bricks.push(new Brique(posX, posY, width, height, color));

            if (j < MAX_BRIQUES - 1) {
                posX += width + BRIQUES_SPACEY;
            }
        }

        posX = posXStartBrique;
        posY += height + BRIQUES_SPACEY;
    }
}

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    paddle.draw();
    bricks.forEach(brick => brick.draw());

    if (start) {

        if (startLaunch) {
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
        }


        paddle.move();
    }

    requestAnimationFrame(draw);
}

const gameOver = () => {
    start = false;
    startLaunch = false;
    textInMessageBox.textContent = "Vous avez perdu !";
    messageBox.classList.remove("cacheText");
    playSound("Sound/sound-defeat.mp3");
}

const gameWin = () => {
    start = false;
    startLaunch = false;
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
    } else if (e.keyCode == 32) {
        startLaunch = true;
        helper.textContent = "";
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
    ball = new Ball(canvas.width / 2, canvas.height - PADDLE_HEIGHT - BALL_RADIUS, BALL_RADIUS);
    paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;
    bricks = [];
    createBricks();
    points_numbers.textContent = 0;
    showMessage("");
    start = true;
    helper.textContent = "Appuyer sur espace pour lancer la balle, <- et -> pour bouger";
});

createBricks();
draw();
