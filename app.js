const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const p1ScoreEl = document.getElementById('player1-score');
const p2ScoreEl = document.getElementById('player2-score');
const gameOverMsg = document.getElementById('game-over-message');
const winnerText = document.getElementById('winner-text');
const restartBtn = document.getElementById('restart-btn');

const WINNING_SCORE = 5;
let isGameOver = false;

const paddle = { width: 10, height: 100, speed: 8 };
const player1 = { x: 10, y: canvas.height / 2 - 50, score: 0 };
const player2 = { x: canvas.width - 20, y: canvas.height / 2 - 50, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 5, dx: 5, dy: 5 };

const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

document.addEventListener('keydown', (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
document.addEventListener('keyup', (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

restartBtn.addEventListener('click', resetGame);

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Send ball in random direction
    // const theta = Math.random() * 2 * Math.PI;
    const theta = (Math.abs(Math.random()) * Math.PI / 3 + Math.PI / 6) * (Math.random() < 0.5 ? -1 : 1);
    ball.dx = Math.sin(theta) * ball.speed;
    ball.dy = Math.cos(theta) * ball.speed;

    // ball.dx = -Math.sign(ball.dx) * ball.speed;
    // ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

function resetGame() {
    player1.score = 0;
    player2.score = 0;
    player1.y = canvas.height / 2 - paddle.height / 2;
    player2.y = canvas.height / 2 - paddle.height / 2;
    ball.speed = 5;
    updateScore();
    isGameOver = false;
    gameOverMsg.classList.add('hidden');
    resetBall();
    requestAnimationFrame(gameLoop);
}

function updateScore() {
    p1ScoreEl.textContent = player1.score;
    p2ScoreEl.textContent = player2.score;
}

function checkWin() {
    if (player1.score >= WINNING_SCORE || player2.score >= WINNING_SCORE) {
        isGameOver = true;
        winnerText.textContent = player1.score >= WINNING_SCORE ? 'Player 1 Wins!' : 'Player 2 Wins!';
        gameOverMsg.classList.remove('hidden');
    }
}

function update() {
    if (isGameOver) return;

    // Player 1 Movement
    if (keys.w && player1.y > 0) player1.y -= paddle.speed;
    if (keys.s && player1.y < canvas.height - paddle.height) player1.y += paddle.speed;

    // Player 2 Movement
    if (keys.ArrowUp && player2.y > 0) player2.y -= paddle.speed;
    if (keys.ArrowDown && player2.y < canvas.height - paddle.height) player2.y += paddle.speed;

    // Ball Movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall Collision (Top/Bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Paddle Collision
    const hitPlayer1 = ball.dx < 0 && ball.x - ball.radius < player1.x + paddle.width && ball.y > player1.y && ball.y < player1.y + paddle.height;
    const hitPlayer2 = ball.dx > 0 && ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + paddle.height;

    if (hitPlayer1 || hitPlayer2) {
        ball.dx *= -1.1; // Increment speed on paddle hit
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        player2.score++;
        updateScore();
        checkWin();
        if (!isGameOver) resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        updateScore();
        checkWin();
        if (!isGameOver) resetBall();
    }
}

function draw() {
    // Canvas Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center Line
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player1.x, player1.y, paddle.width, paddle.height);
    ctx.fillRect(player2.x, player2.y, paddle.width, paddle.height);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

resetBall();
gameLoop();