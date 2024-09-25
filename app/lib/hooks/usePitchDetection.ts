import { useRef } from "react";

export function usePitchDetection(
  audioContext: AudioContext | null,
  microphoneStream: MediaStreamAudioSourceNode | null,
  callback: (maxFrequency: number) => void,
) {
  if (!audioContext || !microphoneStream) return;

  // Create analyser
  const analyser = audioContext.createAnalyser();
  // Connect microphone to analyser
  microphoneStream.connect(analyser);

  analyser.fftSize = 32768; // FFT size
  const bufferLength = analyser.frequencyBinCount; // Half of fftSize

  const dataArray = new Uint8Array(bufferLength);

  const sampleRate = audioContext.sampleRate;
  const frequencyStep = sampleRate / bufferLength;

  function loop() {
    analyser.getByteFrequencyData(dataArray);
    const test = Array.from(dataArray);

    const maxFrequencyAmplitude = Math.max(...test);
    const index = test.indexOf(maxFrequencyAmplitude);
    const maxFrequency = index * frequencyStep;

    // console.log(audioData.current);
    callback(maxFrequency);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
