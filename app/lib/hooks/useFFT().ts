import { useEffect, useState } from "react";

export function useFFT(
  audioContext: AudioContext | null,
  microphoneStream: MediaStreamAudioSourceNode | null,
  binCount: number,
) {
  const [fftAnalyser, setFftAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (audioContext && microphoneStream) {
      // Create analyser
      const analyser = audioContext.createAnalyser();
      // Connect microphone to analyser
      microphoneStream.connect(analyser);

      analyser.fftSize = binCount * 2; // FFT size

      setFftAnalyser(analyser);
    }
  }, [audioContext, microphoneStream, binCount]);
  return fftAnalyser;
}
