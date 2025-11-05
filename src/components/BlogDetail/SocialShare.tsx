"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SocialShareProps {
  isMobile: boolean;
}

const SocialShare = ({ isMobile }: SocialShareProps) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = [
    {
      name: "X",
      icon: "https://da8nru77lsio9.cloudfront.net/images/x-social.svg",
      url: `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Instagram",
      icon: "https://da8nru77lsio9.cloudfront.net/images/instagram-social.svg",
      url: "#", // Instagram doesn't support direct URL sharing
    },
    {
      name: "LinkedIn",
      icon: "https://da8nru77lsio9.cloudfront.net/images/linkedin-social.svg",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
    },
    {
      name: "Facebook",
      icon: "https://da8nru77lsio9.cloudfront.net/images/facebook-social.svg",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
    },
  ];

  const handleShare = (url: string, name: string) => {
    if (name === "Instagram") {
      // For Instagram, we could copy to clipboard or show a message
      navigator.clipboard?.writeText(currentUrl);
      alert("Link copied to clipboard! You can share it on Instagram.");
      return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className={`${isMobile ? "px-6" : ""}`}>
      <div
        className={`border-t border-b border-[#333333] ${
          isMobile ? "py-8 px-0 mb-[61px]" : "py-7 px-0"
        }`}
      >
        <div
          className={`flex justify-center ${
            isMobile ? "flex-col gap-4" : "items-center gap-8"
          }`}
        >
          {/* Share Text */}
          <span
            className={`text-white font-medium ${
              isMobile
                ? "text-[20px] leading-[32px] tracking-[0%] text-center"
                : "text-[16px] leading-[20px] tracking-[0%]"
            }`}
          >
            Share the post
          </span>

          {/* Social Icons */}
          <div
            className={`flex items-center justify-center ${
              isMobile ? "gap-4" : "gap-6"
            }`}
          >
            {shareLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => handleShare(social.url, social.name)}
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label={`Share on ${social.name}`}
              >
                <div className={`relative ${isMobile ? "w-8 h-8" : "w-6 h-6"}`}>
                  <Image
                    src={social.icon}
                    alt={social.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
