"use client";

import { useEffect } from "react";
import main from "./mic";

export default function Page() {
  useEffect(() => {
    main();
  }, []);

  return <div>Mic</div>;
}
