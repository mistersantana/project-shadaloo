// Pong Game

const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game objects
const paddleWidth = 12;
const paddleHeight = 90;
const ballRadius = 10;

let leftPaddleY = HEIGHT / 2 - paddleHeight / 2;
let rightPaddleY = HEIGHT / 2 - paddleHeight / 2;
const paddleSpeed = 7; // for AI

let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);

let scoreLeft = 0;
let scoreRight = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - paddleHeight / 2;
  // Clamp paddle position
  leftPaddleY = Math.max(0, Math.min(HEIGHT - paddleHeight, leftPaddleY));
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game objects
function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY - ballRadius < 0) {
    ballY = ballRadius;
    ballSpeedY *= -1;
  }
  if (ballY + ballRadius > HEIGHT) {
    ballY = HEIGHT - ballRadius;
    ballSpeedY *= -1;
  }

  // Ball collision with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballX = paddleWidth + ballRadius;
    ballSpeedX *= -1;

    // Add some "spin"
    let hitPos = (ballY - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Ball collision with right paddle
  if (
    ballX + ballRadius > WIDTH - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballX = WIDTH - paddleWidth - ballRadius;
    ballSpeedX *= -1;

    // Add some "spin"
    let hitPos = (ballY - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Ball out of bounds: left or right
  if (ballX - ballRadius < 0) {
    scoreRight++;
    resetBall();
  } else if (ballX + ballRadius > WIDTH) {
    scoreLeft++;
    resetBall();
  }

  // AI control for right paddle
  let targetY = ballY - paddleHeight / 2;
  if (rightPaddleY + paddleHeight / 2 < ballY - 10) {
    rightPaddleY += paddleSpeed;
  } else if (rightPaddleY + paddleHeight / 2 > ballY + 10) {
    rightPaddleY -= paddleSpeed;
  }
  // Clamp AI paddle
  rightPaddleY = Math.max(0, Math.min(HEIGHT - paddleHeight, rightPaddleY));

  // Update scores
  document.getElementById('score-left').textContent = scoreLeft;
  document.getElementById('score-right').textContent = scoreRight;
}

function resetBall() {
  ballX = WIDTH / 2;
  ballY = HEIGHT / 2;
  ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Middle dashed line
  ctx.setLineDash([12, 16]);
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Left paddle
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Right paddle
  ctx.fillRect(WIDTH - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0ff';
  ctx.fill();
}

gameLoop();