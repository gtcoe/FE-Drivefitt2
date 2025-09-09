"use client";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { GallerySectionProps } from "@/types/staticPages";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PhoneNumberModal from "@/components/common/Modal/PhoneNumberModal";

const Banner3JoinUs = ({
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
      <div
        className=" md:h-[460px] w-full md:pt-10 px-6 md:py-[106px] md:px-[120px]"
        style={{
          background: addGradient
            ? "linear-gradient(180deg, #1D1D1D 0%, #0D0D0D 100%)"
            : "transparent",
        }}
      >
        <div className="flex items-start md:items-center h-fit md:h-full">
          <div>
            <ScrollAnimation
              delay={0.2}
              direction="left"
              className="w-full md:w-2/5 flex mt-[224px] md:mt-0 flex-col text-center justify-center items-center md:text-start md:justify-start md:items-start gap-4 md:gap-5 relative z-10"
            >
              <h2 className="w-full text-center md:text-left md:w-[509px] font-semibold text-2xl leading-7 md:text-5xl md:leading-[56px] tracking-[-1px] md:tracking-[-2px] text-white">
                {title}
              </h2>
              <p className="font-light w-full text-center md:text-left md:w-[452px] text-sm leading-5 tracking-[0%] text-[#8A8A8A] md:text-base md:tracking-[-2%]">
                {description}
              </p>
              <button
                onClick={() => handleButtonClick()}
                className={`bg-[#00DBDC] h-[37px] font-medium text-sm leading-none tracking-tighter md:w-[231px]  md:h-[52px] text-sm md:text-base px-10 py-3 md:py-4 text-[#0D0D0D] rounded-[4px] md:rounded-lg mt-1 md:mt-7 hover:bg-transparent border border-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200`}
              >
                {btnLabel}
              </button>
            </ScrollAnimation>
          </div>
          <div className="h-[224px] md:h-[460px] w-full absolute md:bottom-0 right-0 top-0">
            <Image
              src={`${isMobile ? mobileImage : desktopImage}`}
              alt="gallery-1"
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

export default Banner3JoinUs;
