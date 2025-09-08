"use client";
import { FranchiseHero } from "@/types/franchisePage";
import Image from "next/image";
import { useState } from "react";
import { FranchiseModal } from "@/components/common/Modal";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface HeroSectionProps {
  data: FranchiseHero;
  pageName: string;
  isMobile?: boolean;
}

const FranchiseHeroSection = ({
  data,
  pageName,
  isMobile,
}: HeroSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    subTitle,
    title,
    description,
    roiTag,
    roiIcon,
    btnPrimaryText,
    desktopImage,
    mobileImage,
  } = data;
  return (
    <div
      className="flex items-center justify-center mb-[-60px]"
      style={{
        background: `url(${
          isMobile ? mobileImage : pageName === "about-us" ? desktopImage : ""
        })`,
        backgroundPosition: "top center",
        backgroundSize: `${pageName === "about-us" ? "cover" : "contain"}`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-3 md:gap-6 mt-[85px] md:mt-[133px]">
          {/* Ecosystem Tag */}
          {subTitle ? (
            <ScrollAnimation delay={0.2} direction="up">
              <div
                className="bg-[#0D2223] border items-center border-[#003434] rounded-full py-2 px-3 md:px-4 md:py-2 mb-0 md:mb-2 flex gap-1"
                style={{ boxShadow: "0px 4px 10px 0px #00DBDC1A" }}
              >
                <Image
                  src="https://da8nru77lsio9.cloudfront.net/images/flash-on.svg"
                  alt="ROI"
                  width={16}
                  height={16}
                  className="mt-1"
                />
                <p className="text-[10px] tracking-[0%] font-light leading-3 md:text-base">
                  {subTitle}
                </p>
              </div>
            </ScrollAnimation>
          ) : null}

          {/* Main Title */}
          <ScrollAnimation delay={0.3} direction="up">
            <div className="text-center w-full">
              <h1 className="text-[40px] md:text-[68px] font-light text-white tracking-[-2px] leading-[44px] md:leading-[78px]">
                {pageName === "about-us" ? (
                  <span className="font-bold">{title}</span>
                ) : null}
                {pageName === "franchise" ? (
                  <>
                    <span className="font-bold">Drive </span>
                    <span className="font-bold">FITT </span>
                    <span className="text-white block md:inline">
                      {isMobile ? title.toUpperCase() : title}
                    </span>
                  </>
                ) : null}
              </h1>
            </div>
          </ScrollAnimation>

          {/* Description */}
          <ScrollAnimation delay={0.4} direction="up">
            <p
              className={`${
                pageName === "franchise" ? "md:max-w-2xl" : "md:max-w-[881px]"
              } text-base md:text-2xl tracking-[0%] leading-[20px] md:tracking-[-2%] text-white max-w-[252px] font-light mb-3 md:mb-4`}
            >
              {description}
            </p>
          </ScrollAnimation>

          {/* ROI Tag */}
          {roiTag ? (
            <ScrollAnimation delay={0.5} direction="up">
              <div className="flex items-center gap-2 text-[#00DBDC] mb-1 md:mb-4 ">
                <Image
                  src={roiIcon}
                  alt="ROI"
                  width={24}
                  height={24}
                  className="text-primary"
                />
                <span className="text-primary text-sm md:text-base">
                  {roiTag}
                </span>
              </div>
            </ScrollAnimation>
          ) : null}

          {/* CTA Button */}
          {btnPrimaryText ? (
            <ScrollAnimation delay={0.6} direction="up">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`bg-[#00DBDC] border border-transparent text-[#0D0D0D] px-6 py-2.5 md:px-14 md:py-4 rounded-[4px] md:rounded-lg font-medium leading-[100%] tracking-[-2%] md:tracking-[-5%] text-sm md:text-xl ${
                  isMobile
                    ? ""
                    : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
                } transition-all duration-200`}
              >
                {btnPrimaryText}
              </button>
            </ScrollAnimation>
          ) : null}
        </div>
      </div>

      <FranchiseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default FranchiseHeroSection;
