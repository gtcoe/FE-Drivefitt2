"use client";

import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    console.log("GA_TRACKING_ID not found");
    return null;
  }

  console.log("Loading Google Analytics with ID:", GA_TRACKING_ID);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => console.log("GA script loaded successfully")}
        onError={(e) => console.error("GA script failed to load:", e)}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            console.log('Initializing GA with ID: ${GA_TRACKING_ID}');
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
            console.log('GA initialized successfully');
          `,
        }}
      />
    </>
  );
}
