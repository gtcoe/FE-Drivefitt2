import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DriveFITT - Premium Fitness & Sports Club",
    short_name: "DriveFITT",
    description:
      "Gurugram's premier fitness & sports club with state-of-the-art facilities for cricket, fitness, recovery, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E1119",
    theme_color: "#00DBDC",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    categories: ["fitness", "sports", "health"],
    lang: "en",
    orientation: "portrait",
    scope: "/",
  };
}
