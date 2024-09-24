import { useEffect, useState } from "react";

export function useMicrophoneStream() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [microphoneStream, setMicrophoneStream] =
    useState<MediaStreamAudioSourceNode | null>(null);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    let audioCtx: AudioContext | null = null;

    async function initMicrophone() {
      try {
        // request microphone acces
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        audioCtx = new AudioContext();

        //create a media stream source node
        const source = audioCtx.createMediaStreamSource(stream);

        //update state
        setAudioContext(audioCtx);
        setMicrophoneStream(source);
      } catch (error: any) {
        console.error("coudn't initiliaze microphone", error);
        setError("Microphone access was denied or is unavailable.");
      }
    }
    initMicrophone();

    //cleanup function
    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return { audioContext, microphoneStream, error};
}
