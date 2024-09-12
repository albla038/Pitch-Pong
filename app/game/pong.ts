import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRAY_50,
  GRAY_800,
  GRAY_900,
  GRAY_950,
} from "../lib/constants";
import Ball from "./ball";
import Paddle from "./paddle";

export function pongGame() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isRunning = false;

  let paddleLeft: Paddle;
  let paddleRight: Paddle;
  let ball: Ball;

  const pressedKeys = new Set<string>();
  const PADDLE_SPEED = 5;
  const BALL_SPEED = 4;

  function init() {
    // Get canvas and context
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    // If context is truthy, initialize game and run loop
    if (context) {
      ctx = context;
      ctx.imageSmoothingEnabled = false;

      // Initialize paddles and ball
      paddleLeft = new Paddle(8, CANVAS_HEIGHT / 4, 8, 48, 4, GRAY_50);
      paddleRight = new Paddle(
        CANVAS_WIDTH - (8 + 8),
        (3 / 4) * CANVAS_HEIGHT - (48 + 32),
        8,
        48,
        4,
        GRAY_50,
      );
      ball = new Ball(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        6,
        BALL_SPEED,
        GRAY_50,
      );

      // Add event listeners for keyboard input
      document.addEventListener("keydown", (event) => {
        pressedKeys.add(event.code);
      });
      // Remove key from set if key is released
      document.addEventListener("keyup", (event) => {
        pressedKeys.delete(event.code);
      });

      isRunning = true;
      animate();
    } else {
      console.error("Canvas not supported");
      //TODO: Handle error
    }
  }

  function updatePaddles() {
    if (pressedKeys.has("ArrowUp")) {
      paddleRight.move(0, canvas.height, PADDLE_SPEED, "up");
    }
    if (pressedKeys.has("ArrowDown")) {
      paddleRight.move(0, canvas.height, PADDLE_SPEED, "down");
    }
    if (pressedKeys.has("KeyW")) {
      paddleLeft.move(0, canvas.height, PADDLE_SPEED, "up");
    }
    if (pressedKeys.has("KeyS")) {
      paddleLeft.move(0, canvas.height, PADDLE_SPEED, "down");
    }
  }

  function updateBall() {
    // Check if ball collides with bottom or top of canvas
    if (ball.y < 0 + ball.radius || ball.y > CANVAS_HEIGHT - ball.radius) {
      ball.reflect_y();
    }

    // Check if ball collides with left paddle
    if (
      ball.x <= paddleLeft.x_br + ball.radius &&
      ball.y > paddleLeft.y &&
      ball.y < paddleLeft.y_br
    ) {
      ball.reflect_x();
    }

    // Check if ball collides with right paddle
    if (
      ball.x >= paddleRight.x - ball.radius &&
      ball.y > paddleRight.y &&
      ball.y < paddleRight.y_br
    ) {
      ball.reflect_x();
    }

    // Check if ball collides with left or right wall
    if (ball.x < 0 + ball.radius || ball.x > CANVAS_WIDTH - ball.radius) {
      stop();
    }

    ball.move();
  }

  function stop() {
    isRunning = false;
  }

  // Game loop
  function animate() {
    if (!isRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.beginPath();
    ctx.strokeStyle = GRAY_800;
    ctx.lineWidth = 2;
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();

    // Update paddles according to keyboard input
    updatePaddles();

    paddleLeft.draw(ctx);
    paddleRight.draw(ctx);

    updateBall();

    ball.draw(ctx);

    // Call animate recursively according to browser's refresh rate
    requestAnimationFrame(animate);
  }

  init();
}
