import { Dispatch, SetStateAction } from "react";

export function controller(
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
    }>
  >,
) {
  const frequencyRange = scale.highestToneFreq - scale.lowestToneFreq;
  const relativePitch = inputPitch - scale.lowestToneFreq;
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
