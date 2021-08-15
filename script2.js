const canvas = document.getElementById('canvas');                         // Reference of "canvas" using its id

const ctx = canvas.getContext('2d');                                      // Without "context", we can't draw on canvas 

const hitSound = new Audio('hit.mp3');                                    // Sounds
const scoreSound = new Audio('comScore.mp3');
const wallHitSound = new Audio('wall.mp3');

const netWidth = 4;                                                       // Sets the Width of Net
const netHeight = canvas.height;                                          // Sets the Height of Net equal to Canvas' Height 
const paddleWidth = 10;                                                   // Sets Paddle Width
const paddleHeight = 100;                                                 // Sets Paddle Height
 
let upArrowPressed = false;
let downArrowPressed = false;

const net = {                                                             // Creating Net
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FFF"
};

const user = {                                                            // Creating User Paddle
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

const ai = {                                                              // Creating Computer AI Paddle
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

const ball = {                                                            // Creating Ball
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#05EDFF'
};

function drawNet() {                                                      // Function to Draw Net
  ctx.fillStyle = net.color;                                              // Sets the Color of Net
  ctx.fillRect(net.x, net.y, net.width, net.height);                      // Drwas a filled Rectangle (Net)
}

function drawScore(x, y, score) {                                         // Function to Draw Score
  ctx.fillStyle = '#fff';                                                 // Sets the color of Score
  ctx.font = '35px sans-serif';                                           // Sets the font of Score
  ctx.fillText(score, x, y);                                              // Draws a Text String
}

function drawPaddle(x, y, width, height, color) {                         // Function to Draw Paddle
  ctx.fillStyle = color;                                                  // Sets the color of Paddle
  ctx.fillRect(x, y, width, height);                                      // Draws a filled Rectangle (Paddle)
}

function drawBall(x, y, radius, color) {                                  // Function to Draw Ball
  ctx.fillStyle = color;                                                  // Sets the color of Ball
  ctx.beginPath();                                                        // Begins Path
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);                            // Draws a circular arc
  ctx.closePath();                                                        // Creates Path from the current point back to the starting point
  ctx.fill();                                                            
}

window.addEventListener('keydown', keyDownHandler);                       // Moving the paddle by using Keyboard
window.addEventListener('keyup', keyUpHandler);

// gets activated when we press down a key
function keyDownHandler(event) {
  // get the keyCode
  switch (event.keyCode) {
    // "up arrow" key
    case 38:
      // set upArrowPressed = true
      upArrowPressed = true;
      break;
    // "down arrow" key
    case 40:
      downArrowPressed = true;
      break;
  }
}

// gets activated when we release the key
function keyUpHandler(event) {
  switch (event.keyCode) {
    // "up arraow" key
    case 38:
      upArrowPressed = false;
      break;
    // "down arrow" key
    case 40:
      downArrowPressed = false;
      break;
  }
}

function reset() {                                                           // Function to Reset the Ball
  // Reset Ball's Value to Older Values
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;

  // Changes the Direction of Ball
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

function collisionDetect(player, ball) {                                     // Function to Detect Collision 
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}


function update() {                                                              // Function to update things position
  // Move the Paddle
  if (upArrowPressed && user.y > 0) {                                  
    user.y -= 8;
  } else if (downArrowPressed && (user.y < canvas.height - user.height)) {
    user.y += 8;
  }

  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {        // check if ball hits top or bottom wall
    wallHitSound.play();                                                           // play wallHitSound
    ball.velocityY = -ball.velocityY;                                              // Changes the Velocity of Ball
  }

   if (ball.x + ball.radius >= canvas.width) {                                      // if ball hit on right wall
    scoreSound.play();                                                              // play scoreSound
    user.score += 1;                                                                // User scored 1 point
    reset();
  }

  if (ball.x - ball.radius <= 0) {                                                   // if ball hit on left wall
    scoreSound.play();                                                               // Play scoreSound
    ai.score += 1;                                                                   // AI scored 1 point
    reset();
  }

  ball.x += ball.velocityX;                                                           // Move the Ball
  ball.y += ball.velocityY;

  ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;                                 // Computer AI paddle movement

  let player = (ball.x < canvas.width / 2) ? user : ai;                               // Collision Detection on Paddles

  if (collisionDetect(player, ball)) {
    // play hitSound
    hitSound.play();
    // default angle is 0deg in Radian
    let angle = 0;

    if (ball.y < (player.y + player.height / 2)) {                                     // if ball hit the top of paddle then -1 * Math.PI / 4 = -45deg
      angle = -1 * Math.PI / 4;
    } else if (ball.y > (player.y + player.height / 2)) {
      angle = Math.PI / 4;                                                             // if it hit the bottom of paddle then angle will be Math.PI / 4 = 45deg
    }
    ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);        // Changes velocity of ball according to which paddle it hits 
    ball.velocityY = ball.speed * Math.sin(angle);
    ball.speed += 0.1;                                                                 // Increases the Speed of Ball
  }
}

function render() {                                                                    // Render Function Draws everything on to Canvas
  ctx.fillStyle = "#000";                                                              // Set a Style
  ctx.fillRect(0, 0, canvas.width, canvas.height);                                     // Draws the Black Board
  drawNet();                                                                           // Draw Net
  drawScore(canvas.width / 4, canvas.height / 6, user.score);                          // Draw User Score
  drawScore(3 * canvas.width / 4, canvas.height / 6, ai.score);                        // Draw Computer AI Score
  drawPaddle(user.x, user.y, user.width, user.height, user.color);                     // Draw User Paddle
  drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);                               // Draw Computer AI Paddle
  drawBall(ball.x, ball.y, ball.radius, ball.color);                                   // Draw Ball
}

function gameLoop() {                                                                  // Main Game Loop
  update();                                                                            // Update Function here
  render();                                                                            // Render Function here
}

setInterval(gameLoop, 1000 / 60);                                                      // Calls Game Loop function 60 times per second