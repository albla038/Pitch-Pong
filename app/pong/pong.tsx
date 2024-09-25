"use client";

import {
  GAME_BOARD_HEIGHT,
  GAME_BOARD_WIDTH,
  PADDLE_SPEED,
  BALL_SPEED,
  GRAY_50,
  initialLeftPaddleData,
  initialRightPaddleData,
} from "@/app/lib/constants";
import { useFrameLoop } from "@/app/lib/hooks/useFrameLoop";
import { getPitch, getRandomAngle, testFFT } from "@/app/lib/utils";
import Ball from "@/app/pong/ball";
import HalfWayLine from "@/app/pong/half-way-line";
import Paddle from "@/app/pong/paddle";
import Title from "@/app/pong/title";
import { useEffect, useRef, useState } from "react";
import { useMicrophoneStream } from "../lib/hooks/useMicrophoneStream";
import { useFFT } from "@/app/lib/hooks/useFFT()";

function setInitialBallData() {
  const angle = getRandomAngle();
  return {
    x: GAME_BOARD_WIDTH / 2,
    y: GAME_BOARD_HEIGHT / 2,
    radius: 8,
    color: GRAY_50,
    velocityX: BALL_SPEED * Math.cos(angle),
    velocityY: BALL_SPEED * Math.sin(angle),
    opacity: 1,
  };
}

export default function Pong() {
  // State
  const [gameState, setGameState] = useState<
    "initial" | "running" | "paused" | "game over"
  >("initial");

  const pressedKeys = useRef(new Set<string>());

  const [leftPaddleData, setLeftPaddleData] = useState(initialLeftPaddleData);

  const [rightPaddleData, setRightPaddleData] = useState(
    initialRightPaddleData,
  );

  const [ballData, setBallData] = useState(setInitialBallData);
  const [leftPlayerScore, setLeftPlayerScore] = useState(0);
  const [rightPlayerScore, setRightPlayerScore] = useState(0);

  // Event listeners
  useEffect(() => {
    function handleAddKey(code: string) {
      pressedKeys.current.add(code);
    }

    function handleRemoveKey(code: string) {
      pressedKeys.current.delete(code);
    }

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        console.log("Space pressed");
        setGameState((prev) => (prev === "running" ? "paused" : "running"));
      } else {
        handleAddKey(event.code);
      }
    });

    window.addEventListener("keyup", (event) => handleRemoveKey(event.code));

    return () => {
      window.removeEventListener("keydown", (event) =>
        handleAddKey(event.code),
      );

      window.removeEventListener("keyup", (event) =>
        handleRemoveKey(event.code),
      );
    };
  }, []);

  // Game logic functions
  function handleKeyboardInput(deltaTimeSeconds: number) {
    if (pressedKeys.current.has("KeyW")) {
      movePaddle("left", -PADDLE_SPEED * deltaTimeSeconds);
    }

    if (pressedKeys.current.has("KeyS")) {
      movePaddle("left", PADDLE_SPEED * deltaTimeSeconds);
    }

    if (pressedKeys.current.has("ArrowUp")) {
      movePaddle("right", -PADDLE_SPEED * deltaTimeSeconds);
    }

    if (pressedKeys.current.has("ArrowDown")) {
      movePaddle("right", PADDLE_SPEED * deltaTimeSeconds);
    }
  }

  function movePaddle(side: "left" | "right", speed: number) {
    if (side === "left") {
      setLeftPaddleData((prev) => ({
        ...prev,
        y: prev.y + speed,
      }));
    }

    if (side === "right") {
      setRightPaddleData((prev) => ({
        ...prev,
        y: prev.y + speed,
      }));
    }
  }

  function checkPaddleBoundaries() {
    // Left paddle top boundary
    if (leftPaddleData.y < 0) {
      setLeftPaddleData((prev) => ({
        ...prev,
        y: 0,
      }));
    }

    // Left paddle bottom boundary
    if (GAME_BOARD_HEIGHT < leftPaddleData.y + leftPaddleData.height) {
      setLeftPaddleData((prev) => ({
        ...prev,
        y: GAME_BOARD_HEIGHT - leftPaddleData.height,
      }));
    }

    // Right paddle top boundary
    if (rightPaddleData.y < 0) {
      setRightPaddleData((prev) => ({
        ...prev,
        y: 0,
      }));
    }

    // Right paddle bottom boundary
    if (GAME_BOARD_HEIGHT < rightPaddleData.y + rightPaddleData.height) {
      setRightPaddleData((prev) => ({
        ...prev,
        y: GAME_BOARD_HEIGHT - rightPaddleData.height,
      }));
    }
  }

  function moveBall(deltaTimeSeconds: number) {
    setBallData((prev) => ({
      ...prev,
      x: prev.x + prev.velocityX * deltaTimeSeconds,
      y: prev.y + prev.velocityY * deltaTimeSeconds,
    }));
  }

  function checkBallCollisions() {
    // Collision with top boundary
    if (ballData.y - ballData.radius < 0) {
      setBallData((prev) => ({
        ...prev,
        y: 0 + ballData.radius,
        velocityY: -prev.velocityY,
      }));
    }

    // Collision with bottom boundary
    if (ballData.y + ballData.radius > GAME_BOARD_HEIGHT) {
      setBallData((prev) => ({
        ...prev,
        y: GAME_BOARD_HEIGHT - ballData.radius,
        velocityY: -prev.velocityY,
      }));
    }

    // Collision with left paddle
    if (
      ballData.x - ballData.radius < leftPaddleData.x + leftPaddleData.width && // ball is to the left of the right edge of the paddle
      ballData.x + ballData.radius > leftPaddleData.x && // ball is to the right of the left edge of the paddle
      ballData.y + ballData.radius > leftPaddleData.y && // ball is below the top edge of the paddle
      ballData.y + ballData.radius < leftPaddleData.y + leftPaddleData.height // ball is above the bottom edge of the paddle
    ) {
      setBallData((prev) => ({
        ...prev,
        x: leftPaddleData.x + leftPaddleData.width + ballData.radius,
        velocityX: -prev.velocityX,
      }));
    }

    // Collision with right paddle
    if (
      ballData.x - ballData.radius <
        rightPaddleData.x + rightPaddleData.width && // ball is to the right of the right edge of the paddle
      ballData.x + ballData.radius > rightPaddleData.x && // ball is to the right of the right edge of the paddle
      ballData.y + ballData.radius > rightPaddleData.y && // ball is below the top edge of the paddle
      ballData.y + ballData.radius < rightPaddleData.y + rightPaddleData.height // ball is above the bottom edge of the paddle
    ) {
      setBallData((prev) => ({
        ...prev,
        x: rightPaddleData.x - ballData.radius,
        velocityX: -prev.velocityX,
      }));
    }

    // Collision with left boundary
    if (ballData.x - ballData.radius < 0) {
      // Game over
      setRightPlayerScore((prev) => prev + 1);
      stop();
    }

    // Collision with right boundary
    if (ballData.x + ballData.radius > GAME_BOARD_WIDTH) {
      // Game over
      setLeftPlayerScore((prev) => prev + 1);
      stop();
    }
  }

  function stop() {
    setBallData(setInitialBallData);
    setGameState("game over");
  }

  const [frameTime, setFrameTime] = useState(0);
  const [countDown, setCountDown] = useState(3);

  const binSize = 16384;

  const { audioContext, microphoneStream, error } = useMicrophoneStream();
  const fftAnalyser = useFFT(audioContext, microphoneStream, binSize);

  // Loop hook, runs every frame
  useFrameLoop(gameState, (time, deltaTime) => {
    // Get pitch from microphone
    if (audioContext && fftAnalyser) {
      const dataArray = new Uint8Array(fftAnalyser.frequencyBinCount);
      fftAnalyser.getByteFrequencyData(dataArray);
      const frequencyArray = Array.from(dataArray);
      // const pitch = getPitch(frequencyArray, audioContext.sampleRate, binSize);
      // console.log(pitch);
      const maxFrequency = Math.max(...frequencyArray);
      const index = frequencyArray.indexOf(maxFrequency);
      const pitch = (index * audioContext.sampleRate) / binSize;
      console.log(pitch);
    }

    setFrameTime(time);
    const deltaTimeSeconds = deltaTime / 1000;

    handleKeyboardInput(deltaTimeSeconds);

    // Move ball if game is running
    if (gameState === "running") {
      moveBall(deltaTimeSeconds);
    }

    // If game is over, count down to start new game
    if (gameState === "game over") {
      setCountDown((prev) => prev - deltaTimeSeconds);
    }
  });

  let ballOpacity = 1;

  // If game is over, signal new game with a pulsating ball
  if (gameState === "game over") {
    ballOpacity = Math.pow(Math.cos(countDown * Math.PI), 12) + 0.25;

    // If countdown is over, start game again
    if (countDown <= 0) {
      setCountDown(3);
      setGameState("running");
    }
  }

  // Check paddle boundaries and ball collisions
  checkPaddleBoundaries();
  checkBallCollisions();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gray-100">
      <main className="relative flex h-[724px] w-[1024px] flex-col items-center justify-center rounded-md bg-gray-900">
        <div className="absolute left-1/2 top-3 flex w-[800px] -translate-x-1/2 items-end justify-around text-center font-mono text-gray-50">
          <p className="text-3xl">{leftPlayerScore}</p>
          <button
            onClick={() => {
              setGameState((prev) =>
                prev === "running" ? "paused" : "running",
              );
            }}
          >
            {gameState === "running" ? "Pause" : "Start"}
          </button>
          <p className="text-3xl">{rightPlayerScore}</p>
        </div>
        <div
          className="relative flex items-center justify-center rounded-md bg-gray-950"
          style={{ width: GAME_BOARD_WIDTH, height: GAME_BOARD_HEIGHT }}
        >
          <HalfWayLine />
          {gameState === "initial" && (
            <Title text="press space to start" pulse={false} />
          )}
          {gameState === "paused" && (
            <Title text="paused" pulse={true} frameTime={frameTime} />
          )}
          <Paddle {...leftPaddleData} key={"left"} />
          <Paddle {...rightPaddleData} key={"right"} />
          <Ball {...ballData} opacity={ballOpacity}></Ball>
        </div>
      </main>
    </div>
  );
}
