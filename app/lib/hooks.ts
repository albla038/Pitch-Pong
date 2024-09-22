import { useEffect, useRef } from "react";

export function useFrameLoop(
  isRunning: boolean,
  callback: (time: number, deltaTime: number) => void,
) {
  const requestID = useRef(0);
  const previousTime = useRef<number | null>(null);

  // Recieves current time from requestAnimationFrame
  function loop(time: number) {
    if (previousTime.current) {
      // Time difference between now and last frame
      const deltaTime = time - previousTime.current;
      // Send time and deltaTime to callback
      callback(time, deltaTime);
    }

    previousTime.current = time;
    // Request loop again
    requestID.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    requestID.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestID.current);
    };
  }, [isRunning]);
}
