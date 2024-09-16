"use client";

import { useEffect } from "react";
import main from "./mic";

export default function Page() {
  useEffect(() => {
    main();
  }, []);

  return <button className="bg-gray-500 p-5 rounded-xl">start</button>;
}
