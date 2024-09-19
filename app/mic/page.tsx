"use client";

import { useEffect } from "react";
import MediaRecorderComponent from "./mic";

export default function Page() {
  useEffect(() => {
    //MediaRecorderComponent();
  }, []);

  return (
    <div className="text-red-600 p-6">
      <h1 className="text-3xl">Test</h1>
    </div>
  );
}
