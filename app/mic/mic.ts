"use client";

import React, { useState, useRef } from "react";

const MediaRecorderComponent = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Function to start recording
  const startRecording = async () => {
    try {
      // Request access to media devices (video and audio)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Display the video stream in the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Create a MediaRecorder to record the stream
      const recorder = new MediaRecorder(mediaStream);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        recordedChunks.current = []; // Clear recorded chunks for the next session
      };

      setMediaRecorder(recorder);
      setStream(mediaStream);
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop()); // Stop the camera and microphone
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">React MediaStream Recorder</h1>

      {/* Video Element for live streaming */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-80 h-60 bg-black rounded-md mb-4"
      ></video>

      {/* Controls to start/stop recording */}
      <div className="mb-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Playback of the recorded video */}
      {videoURL && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Playback</h3>
          <video
            src={videoURL}
            controls
            className="w-80 h-60 bg-black rounded-md"
          ></video>
        </div>
      )}
    </div>
  );
};

export default MediaRecorderComponent;
