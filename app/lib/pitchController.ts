import { Dispatch, SetStateAction } from "react";
import { octaver } from "./utils";

export function pitchController(
  scale: {
    scaleTones: string[];
    lowestToneFreq: number;
    highestToneFreq: number;
    octaveToneFreq: number;
  },
  inputPitch: number,
  pixelRange: number = 800,
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
  const frequencyRange = scale.highestToneFreq - scale.lowestToneFreq;
  const relativePitch = octaverPitch - scale.lowestToneFreq;
  const fraction = relativePitch / frequencyRange;
  const y = pixelRange - fraction * pixelRange;

  // console.log(
  //   "frequencyRange: ",
  //   frequencyRange,
  //   "relativePitch: ",
  //   relativePitch,
  //   "fraction: ",
  //   fraction,
  //   "y: ",
  //   y,
  // );
  setPaddleData((prev) => ({ ...prev, y }));
}
