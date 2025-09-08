"use client";
import { Hero, TitleWord } from "@/types/staticPages";
import { homeData } from "@/data/home";
import CountdownTimer from "./CountdownTimer";
import { useState } from "react";
import EmailModal from "@/components/common/Modal/EmailModal";
import PhoneNumberModal from "@/components/common/Modal/PhoneNumberModal";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { useAuth } from "@/hooks/useAuth";

interface HeroSectionProps {
  data: Hero;
  pageName?: string;
  isMobile?: boolean;
}

const HeroSection = ({ data, pageName, isMobile }: HeroSectionProps) => {
  const { titleWords, description, btnPrimaryText } = data;
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const handlePrimaryButtonClick = () => {
    if (isAuthenticated) {
      // If logged in, redirect to membership/plans page
      window.location.href = "/membership";
    } else if (btnPrimaryText === "Join the Waitlist") {
      // If not logged in and it's "Join the Waitlist", redirect to contact-us
      window.location.href = "/contact-us";
    } else {
      // If not logged in and it's "Join Now", open phone modal
      setIsPhoneModalOpen(true);
    }
  };

  // const handleSecondaryButtonClick = () => {
  //   if (isAuthenticated) {
  //     // If logged in, redirect to membership/plans page
  //     window.location.href = "/membership";
  //   } else {
  //     // If not logged in, open phone modal
  //     setIsPhoneModalOpen(true);
  //   }
  // };

  const renderTitle = (titleWords: TitleWord[]) => {
    return (
      <ScrollAnimation delay={0.2} direction="up">
        <h1
          className={`text-white text-[42px] leading-[50px] tracking-[-2px] md:leading-[72px] md:text-6xl font-bold md:mb-[24px] mb-[22px] ${
            pageName === "home" ? "md:mb-[60px]" : ""
          }`}
        >
          {titleWords.map((word, index) => (
            <span
              key={index}
              className={`${
                word.color ? `text-[${word.color}]` : "text-white"
              } ${word.isItalic ? "italic" : ""}`}
            >
              {word.text}
            </span>
          ))}
        </h1>
      </ScrollAnimation>
    );
  };

  return (
    <>
      <div className="h-fit md:min-h-[745px] flex flex-col justify-center md:justify-start items-center md:items-start text-center md:text-start px-6 md:px-[120px]">
        <div
          className={`${
            pageName === "cricket"
              ? "max-w-full md:max-w-[739px]"
              : "max-w-full md:max-w-[600px]"
          } ${
            pageName === "home"
              ? "mt-[200px] md:mt-[145px]"
              : `${
                  pageName === "recovery"
                    ? "md:mt-[197px] mt-[170px]"
                    : "md:mt-[125px] mt-[170px]"
                }`
          }`}
        >
          {renderTitle(titleWords)}
          {pageName !== "home" ? (
            <ScrollAnimation delay={0.4} direction="up">
              <p className="text-white md:text-base md:leading-5 text-sm leading-[18px] tracking-[-2%] font-light mb-[28px] md:mb-[80px] md:max-w-[486px]">
                {description}
              </p>
            </ScrollAnimation>
          ) : null}
          <ScrollAnimation delay={0.6} direction="up">
            <div className="flex gap-4 justify-center md:justify-start">
              {btnPrimaryText && (
                <button
                  onClick={handlePrimaryButtonClick}
                  className={`bg-[#00DBDC] border border-transparent text-[#0D0D0D] px-6 py-3 md:px-14 rounded-[4px] md:rounded-lg font-medium leading-[100%] tracking-[-5%] text-base md:text-lg ${
                    isMobile
                      ? ""
                      : " h-[56px] hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
                  } transition-all duration-200`}
                >
                  {isAuthenticated ? "Join Now" : btnPrimaryText}
                </button>
              )}
              {/* {btnSecondaryText !== "" && (
                <button
                  onClick={handleSecondaryButtonClick}
                  className={`bg-transparent border border-[#00DBDC] text-[#00DBDC] px-10 py-3 md:px-14 rounded-lg font-medium leading-[100%] tracking-[-5%] text-base md:text-lg ${
                    isMobile
                      ? ""
                      : "h-[56px] hover:bg-[#00DBDC] hover:text-[#0D0D0D]"
                  } transition-all duration-200 justify-center items-center`}
                >
                  {isAuthenticated ? "Join Now" : btnSecondaryText}
                </button>
              )} */}
            </div>
          </ScrollAnimation>
        </div>
      </div>
      {pageName === "home" && homeData.countdownSection && (
        <ScrollAnimation delay={0.8} direction="up">
          <CountdownTimer
            countdownData={homeData.countdownSection}
            isMobile={isMobile}
          />
        </ScrollAnimation>
      )}

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        isMobile={isMobile}
      />

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};

export default HeroSection;
