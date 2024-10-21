// Game board dimensions
export const GAME_BOARD_WIDTH = 800;
export const GAME_BOARD_HEIGHT = 600;

// Speeds
export const PADDLE_SPEED = 400;
export const BALL_SPEED = 150;

// Colors
export const GRAY_50 = "#f9fafb";
export const GRAY_800 = "#1f2937";
export const GRAY_900 = "#111827";
export const GRAY_950 = "#030712";

// Inital data
export const initialLeftPaddleData = {
  x: 8,
  y: GAME_BOARD_HEIGHT / 2 - 64 / 2,
  width: 8,
  height: 64,
  color: GRAY_50,
  velocity: 0,
};

export const initialRightPaddleData = {
  x: GAME_BOARD_WIDTH - (8 + 8),
  y: GAME_BOARD_HEIGHT / 2 - 64 / 2,
  width: 8,
  height: 64,
  color: GRAY_50,
  velocity: 0,
};
