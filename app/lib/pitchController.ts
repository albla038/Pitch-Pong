import { Dispatch, SetStateAction } from "react";
import { octaver } from "./utils";
import { PADDLE_SPEED } from "./constants";

export function pitchController(
  scale: {
    scaleTones: string[] | { tone: string; degree: number }[];
    lowestToneFreq: number;
    highestToneFreq: number;
    octaveToneFreq: number;
  },
  inputPitch: number,
  deltaTimeSeconds: number,
  pixelRange: number = 600,
  setPaddleData: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      velocity: number;
    }>
  >,
) {
  const octaverPitch = octaver(
    scale.lowestToneFreq,
    scale.octaveToneFreq,
    inputPitch,
  );

  setPaddleData((prevPaddleData) => {
    const n =
      Math.log(octaverPitch / scale.lowestToneFreq) * (11 / Math.log(2));

    const desiredY = pixelRange - (n / 11) * pixelRange + pixelRange / 11 / 2 - prevPaddleData.height / 2;

    const currentY = prevPaddleData.y + prevPaddleData.height / 2; // Use paddle center
    const error = desiredY - currentY;
    const gain = 16; // Adjust this value to control responsiveness
    let velocity = error * gain;

    const maxSpeed = PADDLE_SPEED * 2;
    if (velocity > maxSpeed) velocity = maxSpeed;
    if (velocity < -maxSpeed) velocity = -maxSpeed;

    const newY = prevPaddleData.y + velocity * deltaTimeSeconds;

    console.log(
      // "New y: ",
      // newY,
      "pitch: ",
      inputPitch,
      "octaverPitch: ",
      octaverPitch,
    );

    return { ...prevPaddleData, y: newY };
  });
}
