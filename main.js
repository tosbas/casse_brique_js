const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const points_numbers = document.getElementById("points_numbers");
const messageBox = document.getElementById("messageBox");
const textInMessageBox = document.getElementById("text");
const bouton_start = document.getElementById("bouton_start");
const helper = document.getElementById("helper");

const select_lvl = document.getElementById("select-lvl");
const menu_lvl = document.getElementById("menu-lvl");

const audio = document.getElementById("audio");

const mobileMove = document.getElementById("mobile-move");
const leftMove = document.getElementById("left-move");
const space = document.getElementById("space");
const rightMove = document.getElementById("right-move");

let start = false;
let startLaunch = false;

let moveMobileLeft = false;
let moveMobileRight = false;

let rightPressed = false;
let leftPressed = false;

canvas.height = 600;
canvas.width = 800;

//Paddle conf 
const PADDLE_WIDTH = 50;
const PADDLE_HEIGHT = 10;
const PADDLE_SPEED = 7;

//Ball conf
const BALL_RADIUS = 10;
const BALL_VX = 2;
let ball_vy = 2;

//Briques conf
let posXStartBrique = 50;
let height = 20;

const POSY_START_BRIQUE = 100;
let max_row = 5;
let max_briques = 5;
const BRIQUES_SPACEY = 30;





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
        this.cornerWidht = 30;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x - this.cornerWidht, this.y, this.cornerWidht, this.height)
        ctx.fillRect(this.x + this.width, this.y, this.cornerWidht, this.height)
        ctx.fill();
    }

    move() {
        if ((rightPressed || moveMobileRight) && this.x + this.width + this.cornerWidht < canvas.width) {
            this.x += this.speed;

            if (!startLaunch) {
                ball.x += this.speed;
            }

        }
        else if ((leftPressed || moveMobileLeft) && this.x - this.cornerWidht > 0) {
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
        this.vy = ball_vy;

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
            this.x + this.radius > paddle.x - paddle.cornerWidht &&
            this.x - this.radius < paddle.x + paddle.width + paddle.cornerWidht
        ) {

            if (this.y + this.radius > paddle.y && this.x + this.radius < paddle.x && this.x + this.radius > paddle.x - paddle.cornerWidht) {
                if (this.vx == -2) {
                    this.vx = BALL_VX;
                } else {
                    this.vx = -BALL_VX;
                }

            } else if (this.y + this.radius > paddle.y && this.x - this.radius > paddle.x + PADDLE_WIDTH && this.x - this.radius < paddle.x + PADDLE_WIDTH + paddle.cornerWidht) {
                if (this.vx == -2) {
                    this.vx = BALL_VX;
                } else {
                    this.vx = -BALL_VX;
                }
            }

            this.vy = -this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            gameTerminated("Vous avez perdu !", "Sound/sound-defeat.mp3");
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

    for (let i = 0; i < max_row; i++) {
        for (let j = 0; j < max_briques; j++) {
            const width = (canvas.width - (max_briques - 1) * BRIQUES_SPACEY - 2 * posXStartBrique) / max_briques;

            const h = Math.floor(Math.random() * 358);
            const s = 100;
            const l = 50;

            const color = `hsl(${h},${s}%, ${l}%)`;

            bricks.push(new Brique(posX, posY, width, height, color));

            if (j < max_briques - 1) {
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

                        const points_number_value = parseInt(points_numbers.innerText);

                        if (points_number_value >= 10 && points_number_value <= 19) {
                            points_numbers.style = "color:red";
                        }
                        else if (points_number_value >= 20) {
                            points_numbers.style = "color:green";
                        }

                        ball.vy = -ball.vy;
                        break;
                    }
                }
            }

            if (bricks.length == 0) {
                gameTerminated("Félicitation !", "Sound/sound-success.mp3")
            }
        }


        paddle.move();
    }

    requestAnimationFrame(draw);
}


const gameTerminated = (message, sound) => {
    start = false;
    startLaunch = false;
    textInMessageBox.textContent = message
    messageBox.classList.remove("cacheText");
    playSound(sound);
    space.style = "";
    menu_lvl.style = "";
}

const playSound = (src) => {
    audio.src = src;
    audio.volume = 0.5;
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

leftMove.addEventListener("touchstart", () => {

    moveMobileLeft = true;
})

leftMove.addEventListener("touchend", () => {
    moveMobileLeft = false;
})


rightMove.addEventListener("touchstart", () => {

    moveMobileRight = true;
})

rightMove.addEventListener("touchend", () => {
    moveMobileRight = false;
})

space.addEventListener("click", () => {
    if (start) {
        startLaunch = true;
        helper.textContent = "";
        space.style = "display:none";
    }
})

bouton_start.addEventListener("click", () => {
    ball = new Ball(canvas.width / 2, canvas.height - PADDLE_HEIGHT - BALL_RADIUS, BALL_RADIUS);
    paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;
    bricks = [];
    createBricks();
    points_numbers.style = ""; 
    points_numbers.textContent = 0;
    showMessage("");
    start = true;
    menu_lvl.style = "display:none";
    helper.innerHTML = "Appuyer sur espace pour lancer la balle, <br> <i class='fa-solid fa-arrow-left'></i> et <i class='fa-solid fa-arrow-right'></i> pour bouger,<br> les cotés gauche et droite (orange) inverse la direction de la balle";
});

const getLvlSelected = () => {
    const lvlSelected = parseInt(select_lvl.value);

    switch (lvlSelected) {
        case 0: {
            ball_vy = 2
            max_row = 5;
            max_briques = 5;
        }
            break;
        case 1: {
            ball_vy = 4;
            max_row = 6;
            max_briques = 7;
        }
            break;
        case 2: {
            ball_vy = 6;
            max_row = 7;
            max_briques = 8;
        }
            break;
        case 3: {
            ball_vy = 8;
            max_row = 8;
            max_briques = 10;
        }
            break;
    }

}

document.addEventListener("change", () => {
    bricks = [];
    getLvlSelected();
    createBricks();

})

getLvlSelected();
createBricks();
draw();
