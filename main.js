const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const points = document.getElementById("points");
let points_numbers = document.getElementById("points_numbers");

const div_text = document.createElement("div");
div_text.setAttribute("id", "div_text");
const button_restart = document.createElement("button");
button_restart.innerText = "Rejouer";

canvas.width = 600;
canvas.height = 600;

let start = true;

if (start == true) {

    const paddle = {
        x: canvas.width / 2,
        y: canvas.height - 20,
        width: 150,
        height: 30,
    }

    function draw_paddle() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.fillRect(paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height)
        ctx.fill();

    }

    document.addEventListener('keydown', (e) => {
        if (e.keyCode == 37 && paddle.x - paddle.width / 2 > 0) {
            paddle.x -= 100;
        } else if (e.keyCode == 39 && paddle.x != canvas.width) {
            paddle.x += 100
        }
    })

    // objet ball

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speedX: Math.random() * 2 + 1.5,
        speedY: 2,
    }

    function drawBall() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.speedX = -ball.speedX;
        } else if (ball.y - ball.radius < 0 || ball.y + ball.radius >= paddle.y && ball.x >= paddle.x - paddle.width / 2 && ball.x <= paddle.x + paddle.width / 2) {
            ball.speedY = -ball.speedY;
        } else if (ball.y > canvas.height) {

            start = false;

        } else {
            for (let i = 0; i < array.length; i++) {
                if (ball.x <= array[i].x + array[i].width && // ball.x <= brique.x + brique.width
                    ball.x >= array[i].x && // ball.y + ball.width >= brique.x
                    ball.y <= array[i].y + array[i].height &&
                    ball.y >= array[i].y) { // ball.x + ball.height >= brique.y
                    ball.speedY = -ball.speedY;
                    array.splice(i, 1)
                    points_numbers.innerText++;

                }
            }

        }

        ball.x += ball.speedX;
        ball.y += ball.speedY;

    }

}

// class brique 

class Brique {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 30;
        this.speedX = 1;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}

// tableau contenant chaque briques

const array = [];

let x = 0
let y = 20

for (let i = 0; i < 30; i++) {
    array.push(new Brique(x, y));
    x += 100

    if (array[i].x + array[i].width >= canvas.width) {
        x = 0;
        y += 50;
    }

}

// function qui anime le tout 

function anim() {

    if (start == true) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(anim);

        for (let i = 0; i < array.length; i++) {
            array[i].draw();
        }

        drawBall();
        draw_paddle();


        if (array.length == 0) {
            setTimeout(() => {

                start = false;

            }, 100)
        }


    } else if (start == false) {

        document.querySelector("body").appendChild(div_text);

        if (array.length == 0) {

            div_text.innerText = "Congratulation !";
            div_text.appendChild(button_restart);

        } else if (array.length != 0) {
            div_text.innerText = "Vous avez perdu ! ";
            div_text.appendChild(button_restart);
        }
    }

}

anim();

// relancer le jeu

button_restart.addEventListener("click", () => {
    location.reload();
})