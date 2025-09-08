"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB } from "web-vitals";

export default function WebVitals() {
  useEffect(() => {
    onCLS(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }, []);

  return null;
}
