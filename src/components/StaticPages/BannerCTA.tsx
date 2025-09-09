"use client";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { GallerySectionProps } from "@/types/staticPages";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PhoneNumberModal from "@/components/common/Modal/PhoneNumberModal";

const BannerCTA = ({
  data,
  isMobile,
}: {
  data: GallerySectionProps;
  isMobile?: boolean;
}) => {
  const {
    title,
    description,
    btnLabel,
    desktopImage,
    mobileImage,
    addGradient = true,
    mobileImageUp = false,
  } = data;

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      window.location.href = "/membership";
    } else {
      setIsPhoneModalOpen(true);
    }
  };

  return (
    <div className="relative mt-[15px] md:!mb-[-40px]">
      <div className="h-10 w-full bg-transparent"></div>
      <div
        className="h-[540px] md:h-[568px] w-full pt-10 px-4 md:pt-[120px] md:pb-[100px] md:px-[120px]"
        style={{
          background: addGradient
            ? "linear-gradient(180deg, #1D1D1D 0%, #0D0D0D 100%)"
            : "transparent",
        }}
      >
        <div className="flex">
          <div className={`${isMobile && mobileImageUp ? "mt-[258px]" : ""}`}>
            <ScrollAnimation
              delay={0.2}
              direction="left"
              className="w-full md:w-2/5 flex flex-col text-center justify-center items-center md:text-start md:justify-start md:items-start gap-3 md:gap-4 relative z-10"
            >
              <h2 className="w-full text-center md:text-left md:w-[509px] font-semibold text-2xl leading-7 md:text-5xl md:leading-[56px] tracking-[-1px] md:tracking-[-2px] text-white">
                {title}
              </h2>
              <p className="font-normal w-full text-center md:text-left md:w-[593px] text-sm leading-5 tracking-[0%] text-[#8A8A8A] md:text-base md:tracking-[-1%]">
                {description}
              </p>
              <button
                onClick={() => handleButtonClick()}
                className={`bg-[#00DBDC] h-[37px] py-3 px-10 font-medium text-sm leading-none tracking-tighter md:h-[52px] md:py-4 text-[#0D0D0D] rounded-[4px] md:rounded-lg mt-4 md:mt-[72px] hover:bg-transparent border border-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200`}
              >
                {btnLabel}
              </button>
            </ScrollAnimation>
          </div>
          <div
            className={`h-[341px] md:h-[568px] w-full absolute ${
              isMobile && mobileImageUp ? "top-0" : "bottom-0"
            } right-0 md:top-0`}
            style={{
              zIndex: isMobile && mobileImageUp ? 20 : 1,
            }}
          >
            <Image
              src={`${isMobile ? mobileImage : desktopImage}`}
              alt="book-now-pilates"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default BannerCTA;
