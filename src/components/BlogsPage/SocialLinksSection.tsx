"use client";

import Image from "next/image";
import Link from "next/link";

interface SocialLink {
  image: string;
  link: string;
}

interface SocialLinksSectionProps {
  isMobile: boolean;
  socialLinks: SocialLink[];
}

const SocialLinksSection = ({
  isMobile,
  socialLinks,
}: SocialLinksSectionProps) => {
  return (
    <div className={`w-full ${isMobile ? "px-6 my-12" : "px-[120px] my-20"}`}>
      <div
        className={`w-full border border-[#333333] rounded-[40px] flex flex-col items-center justify-center ${
          isMobile ? "py-[55px] gap-4" : "py-[60px] gap-12"
        }`}
      >
        {/* Follow us on text */}
        <h2
          className={`text-white font-medium text-center ${
            isMobile
              ? "text-[20px] leading-[32px] tracking-[0%]"
              : "text-[28px] leading-[32px] tracking-[0%]"
          }`}
        >
          Follow us on
        </h2>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity duration-200"
            >
              <div className={`relative ${isMobile ? "w-8 h-8" : "w-10 h-10"}`}>
                <Image
                  src={social.image}
                  alt="Social media"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinksSection;
