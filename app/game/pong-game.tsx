"use client";

import { useEffect } from "react";
import { pongGame } from "./pong";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../lib/constants";
import clsx from "clsx";

export default function PongGame() {
  useEffect(() => {
    pongGame();
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div
        className={clsx(
          "flex items-center justify-center rounded-md bg-gray-950"
        )}
      >
        <canvas
          id="canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        ></canvas>
      </div>
    </div>
  );
}
