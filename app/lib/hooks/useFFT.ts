import { useEffect, useState } from "react";

export function useFFT(
  audioContext: AudioContext | null,
  microphoneStream: MediaStreamAudioSourceNode | null,
  binCount: number,
) {
  const [fftAnalyserLeft, setFftAnalyserLeft] = useState<AnalyserNode | null>(
    null,
  );
  const [fftAnalyserRight, setFftAnalyserRight] = useState<AnalyserNode | null>(
    null,
  );

  useEffect(() => {
    if (audioContext && microphoneStream) {
      // Create analyser
      const analyserLeft = audioContext.createAnalyser();
      const analyserRight = audioContext.createAnalyser();

      analyserLeft.fftSize = binCount * 2; // FFT size
      analyserRight.fftSize = binCount * 2;

      const splitter = audioContext.createChannelSplitter(2);
      splitter.connect(analyserLeft, 0);
      splitter.connect(analyserRight, 1);

      // Connect microphone to analyser
      microphoneStream.connect(analyserLeft);
      microphoneStream.connect(analyserRight);

      // console.log(microphoneStream.channelCount);

      // console.log(
      //   "FFT size: ",
      //   analyserLeft.fftSize + " " + analyserRight.fftSize,
      // );

      setFftAnalyserLeft(analyserLeft);
      setFftAnalyserRight(analyserRight);
    }
  }, [audioContext, microphoneStream, binCount]);
  return [fftAnalyserLeft, fftAnalyserRight];
}
