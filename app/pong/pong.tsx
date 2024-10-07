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
import { getPitch, getRandomAngle } from "@/app/lib/utils";
import Ball from "@/app/pong/ball";
import HalfWayLine from "@/app/pong/half-way-line";
import Paddle from "@/app/pong/paddle";
import Title from "@/app/pong/title";
import { useEffect, useRef, useState } from "react";
import { useMicrophoneStream } from "../lib/hooks/useMicrophoneStream";
import { useFFT } from "@/app/lib/hooks/useFFT";
import { simplePitchAlgo } from "@/app/lib/simplePitchAlgo";
import { pitchController } from "@/app/lib/pitchController";
import { majorScales } from "@/app/lib/data";
import MusicScale from "@/app/pong/music-scale";

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
      if (code === "KeyW") {
        setLeftPaddleData((prev) => ({
          ...prev,
          velocity: -PADDLE_SPEED,
        }));
      }
      if (code === "KeyS") {
        setLeftPaddleData((prev) => ({
          ...prev,
          velocity: PADDLE_SPEED,
        }));
      }
      if (code === "ArrowUp") {
        setRightPaddleData((prev) => ({
          ...prev,
          velocity: -PADDLE_SPEED,
        }));
      }
      if (code === "ArrowDown") {
        setRightPaddleData((prev) => ({
          ...prev,
          velocity: PADDLE_SPEED,
        }));
      }
    }

    function handleRemoveKey(code: string) {
      if (code === "KeyW") {
        setLeftPaddleData((prev) => ({
          ...prev,
          velocity: 0,
        }));
      }
      if (code === "KeyS") {
        setLeftPaddleData((prev) => ({
          ...prev,
          velocity: 0,
        }));
      }
      if (code === "ArrowUp") {
        setRightPaddleData((prev) => ({
          ...prev,
          velocity: 0,
        }));
      }
      if (code === "ArrowDown") {
        setRightPaddleData((prev) => ({
          ...prev,
          velocity: 0,
        }));
      }
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

  function movePaddles(deltaTimeSeconds: number) {
    setLeftPaddleData((prev) => ({
      ...prev,
      y: prev.y + prev.velocity * deltaTimeSeconds,
    }));

    setRightPaddleData((prev) => ({
      ...prev,
      y: prev.y + prev.velocity * deltaTimeSeconds,
    }));
  }

  function checkPaddleBoundaries() {
    // Left paddle top boundary
    if (leftPaddleData.y < 0) {
      setLeftPaddleData((prev) => ({
        ...prev,
        y: 0,
        velocity: 0,
      }));
    }

    // Left paddle bottom boundary
    if (GAME_BOARD_HEIGHT < leftPaddleData.y + leftPaddleData.height) {
      setLeftPaddleData((prev) => ({
        ...prev,
        y: GAME_BOARD_HEIGHT - leftPaddleData.height,
        velocity: 0,
      }));
    }

    // Right paddle top boundary
    if (rightPaddleData.y < 0) {
      setRightPaddleData((prev) => ({
        ...prev,
        y: 0,
        velocity: 0,
      }));
    }

    // Right paddle bottom boundary
    if (GAME_BOARD_HEIGHT < rightPaddleData.y + rightPaddleData.height) {
      setRightPaddleData((prev) => ({
        ...prev,
        y: GAME_BOARD_HEIGHT - rightPaddleData.height,
        velocity: 0,
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

    // // Collision with right boundary
    // if (ballData.x + ballData.radius > GAME_BOARD_WIDTH) {
    //   // Game over
    //   setLeftPlayerScore((prev) => prev + 1);
    //   stop();
    // }

    // TODO FOR TESTING ONLY
    // Collision with right boundary
    if (ballData.x + ballData.radius > GAME_BOARD_WIDTH) {
      setBallData((prev) => ({
        ...prev,
        x: rightPaddleData.x - ballData.radius,
        velocityX: -prev.velocityX,
      }));
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
  const [fftAnalyserLeft, fftAnalyserRight] = useFFT(
    audioContext,
    microphoneStream,
    binSize,
  );

  const pitchLeft = useRef(-1);
  const pitchRight = useRef(-1);
  const initalTime = 0.05;
  const timeBuffer = useRef(initalTime);

  // Loop hook, runs every frame
  useFrameLoop(gameState, (time, deltaTime) => {
    const deltaTimeSeconds = deltaTime / 1000;

    movePaddles(deltaTimeSeconds);

    // Get pitch from microphone
    if (audioContext && fftAnalyserLeft && fftAnalyserRight) {
      const dataArrayLeft = new Uint8Array(fftAnalyserLeft.frequencyBinCount);
      const dataArrayRight = new Uint8Array(fftAnalyserRight.frequencyBinCount);

      timeBuffer.current -= deltaTimeSeconds;
      // console.log("Time buffer: ", timeBuffer.current);

      if (timeBuffer.current <= 0) {
        fftAnalyserLeft.getByteFrequencyData(dataArrayLeft);
        fftAnalyserRight.getByteFrequencyData(dataArrayRight);
        const frequencyArrayLeft = Array.from(dataArrayLeft);
        const frequencyArrayRight = Array.from(dataArrayRight);
        timeBuffer.current = initalTime;
        const gatedArrayLeft = frequencyArrayLeft.map((e) => {
          if (e < 48) return 0;
          else return e;
        });
        const gatedArrayRight = frequencyArrayRight.map((e) => {
          if (e < 48) return 0;
          else return e;
        });

        const pLeft = getPitch(
          gatedArrayLeft,
          audioContext.sampleRate,
          binSize,
        );
        const pRight = getPitch(
          frequencyArrayLeft,
          audioContext.sampleRate,
          binSize,
        );
        // const pitch = simplePitchAlgo(
        //   frequencyArray,
        //   audioContext.sampleRate,
        //   binSize,
        // );

        if (pLeft > 0) pitchLeft.current = pLeft;
        if (pRight > 0) pitchRight.current = pRight;
        console.log("Pitch: ", pitchLeft.current + " " + pitchRight.current);
        // console.log("Audio context: ", audioContext);

        pitchController(
          majorScales["A1"],
          pitchLeft.current,
          GAME_BOARD_HEIGHT,
          setLeftPaddleData,
        );
      }
    }

    setFrameTime(time);

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

        {/* Game board area */}
        <div
          className="flex"
          style={{
            width: GAME_BOARD_WIDTH + 2 * 40,
            height: GAME_BOARD_HEIGHT,
          }}
        >
          <MusicScale
            className="grow rounded-l-md"
            scaleTones={majorScales["Chromatic"].scaleTones}
          />
          <div
            className="relative flex items-center justify-center bg-gray-950"
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
          <MusicScale
            className="grow rounded-r-md"
            scaleTones={majorScales["Chromatic"].scaleTones}
          />
        </div>
      </main>
    </div>
  );
}
