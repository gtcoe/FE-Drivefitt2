"use client";
import { useEffect } from "react";

export default function RazorpayScript() {
  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && window.Razorpay) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/razorpay.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/razorpay.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}


