"use client";

import { useEffect, useRef, useState } from "react";
import TitleDescription from "../common/TitleDescription";

interface EcosystemGifSectionProps {
  isMobile?: boolean;
  title: string;
  description: string;
}

const EcosystemGifSection = ({
  title,
  description,
}: EcosystemGifSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <>
      <TitleDescription
        title={title || "s"}
        description={description || "d"}
        className="px-[24px]"
      />
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center"
      >
        <div className="w-full px-4 md:px-[120px] max-w-[1060px]">
          <div className="relative overflow-hidden rounded-lg">
            {isVisible && (
              <img
                src="https://da8nru77lsio9.cloudfront.net/images/ecosystem4.gif"
                alt="DriveFITT Ecosystem"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={handleImageLoad}
                style={{
                  imageRendering: "auto",
                }}
              />
            )}
            {!isLoaded && isVisible && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                <div className="text-white text-lg">Loading ecosystem...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EcosystemGifSection;
