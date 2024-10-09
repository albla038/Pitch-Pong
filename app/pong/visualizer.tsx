"use client";

import { GAME_BOARD_HEIGHT } from "@/app/lib/constants";
import { useEffect, useRef } from "react";

export default function Visualizer({
  side,
  fftAnalyser,
}: {
  side: "left" | "right";
  fftAnalyser: AnalyserNode | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestID = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Visualizer: Canvas failed");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("Visualizer: Context failed");
      return;
    }

    if (!fftAnalyser) {
      console.log("Visualizer: fftAnalyser failed");
      return;
    }

    //console.log("Visualizer: fftAnalyser success");

    const dataArray = new Uint8Array(fftAnalyser.frequencyBinCount);
    fftAnalyser.getByteFrequencyData(dataArray);

    const barArray: Bar[] = [];
    const numOfBars = 100;

    // const barX = side === "right" ? 0 : canvas.width;
    const barX = 0;

    for (let i = 0; i < numOfBars; i++) {
      const bar = new Bar(
        barX,
        i * (canvas.height / numOfBars),
        50,
        (canvas.height / numOfBars) * 1,
        "white",
      );
      barArray.push(bar);
    }

    const sumNum = 5;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fftAnalyser.getByteFrequencyData(dataArray);
      const frequencyArray = Array.from(dataArray);
      const slicedArray = frequencyArray.slice(0, numOfBars * sumNum);
      console.log(`Visualizer: ${side} array: `, slicedArray[100]);

      barArray.forEach((bar, index) => {
        let amp = 0;
        for (let i = index; i < index + sumNum; i++) {
          amp += slicedArray[i];
        }

        bar.width = (amp / sumNum / 256) * canvas.width;
        bar.draw(ctx);
      });

      requestID.current = requestAnimationFrame(draw);
    };

    requestID.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(requestID.current);
  }, [fftAnalyser, side]);

  return (
    <canvas width={100} height={GAME_BOARD_HEIGHT} ref={canvasRef}></canvas>
  );
}

class Bar {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
