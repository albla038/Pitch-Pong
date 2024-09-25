"use client";

import { useEffect, useState } from "react";
import { useMicrophoneStream } from "../lib/hooks/useMicrophoneStream";
import { usePitchDetection } from "../lib/hooks/usePitchDetection";

export default function Page() {
  const [maxFrequency, setMaxFrequency] = useState<number | null>(null);
  const { audioContext, microphoneStream, error } = useMicrophoneStream();

  usePitchDetection(audioContext, microphoneStream, (frequency) => {
    setMaxFrequency(frequency);
  });

  return <p>{maxFrequency && maxFrequency}</p>;
}
