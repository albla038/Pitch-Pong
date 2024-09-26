export function simplePitchAlgo(
  frequencyArray: number[],
  nyquistFreq: number,
  binSize: number,
) {
  const maxFrequency = Math.max(...frequencyArray);
  const index = frequencyArray.indexOf(maxFrequency);
  const pitch = index * (nyquistFreq / binSize);
  return pitch;
}
