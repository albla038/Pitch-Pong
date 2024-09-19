"use client";

import React, { useState, useRef } from "react";

const App: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // Request access to the user's camera and microphone
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(userMediaStream);

      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(userMediaStream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      // Collect the recorded data when available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Handle the stop event to create a Blob and generate a URL
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url);
      };

      // Start recording
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      // Stop the MediaRecorder
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">MediaStream Recording Demo</h1>

      {!recording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop Recording
        </button>
      )}

      {mediaBlobUrl && (
        <video
          src={mediaBlobUrl}
          controls
          autoPlay
          className="mt-4 max-w-full border border-gray-300 rounded"
        ></video>
      )}
    </div>
  );
};

export default App;
