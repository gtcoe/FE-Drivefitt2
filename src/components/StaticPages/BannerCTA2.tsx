"use client";
import { GallerySectionProps } from "@/types/staticPages";
import Image from "next/image";

const BannerCTA2 = ({
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
    mobileImageUp = false,
    imageClass,
    specialBackgroundClass,
    showStrip = true,
    parentClass,
  } = data;

  const handleButtonClick = () => {
    window.location.href = "/contact-us";
  };

  return (
    <div
      className={`relative mt-[15px] md:!mb-[-40px] md:mt-[-100px] bg-[#1D1D1D33] z-10 pb-[35px]`}
      style={{
        background: !isMobile
          ? specialBackgroundClass ||
            "linear-gradient(to bottom, #000000 0%, #000000 8%, #1D1D1D33 8%, #1D1D1D33 100%)"
          : "#1D1D1DB2",
      }}
    >
      {!isMobile && showStrip && (
        <div className="h-10 w-full bg-transparent"></div>
      )}
      <div
        className={`h-[540px] md:h-[492px] w-full pt-10 md:pt-[120px] md:pb-[100px] md:pl-[120px] ${parentClass}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full ">
          <div
            className={`flex-1 md:order-1 px-6 ${
              isMobile && mobileImageUp ? "order-2" : ""
            }`}
          >
            <div className="w-full flex flex-col text-center justify-center items-center md:text-start md:justify-start md:items-start gap-3 md:gap-4 relative z-10 ">
              <h2 className="w-full text-center md:text-left font-semibold text-[24px] leading-[28px] md:text-[48px] md:leading-[56px] tracking-[-1px] md:tracking-[-2px] text-white">
                {title}
              </h2>
              <p className="font-normal w-full text-center md:text-left md:w-[593px] text-sm leading-5 tracking-[0%] font-light text-[#FFFFFF] md:text-base md:tracking-[-1%]">
                {description}
              </p>
              <button
                onClick={() => handleButtonClick()}
                className={`bg-[#00DBDC] w-full max-w-[255px] h-[43px] md:h-[52px] text-base leading-5 tracking-[5%] py-3 md:py-4 text-[#0D0D0D] rounded-[4px] md:rounded-lg mt-4 md:mt-6 hover:bg-transparent border border-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200 font-medium`}
              >
                {btnLabel}
              </button>
            </div>
          </div>
          <div
            className={`flex-1 md:max-w-[656px] md:max-h-[564px] relative md:order-2 -md:mr-[120px] md:mb-[96px] ${
              isMobile && mobileImageUp ? "order-first" : imageClass || "mt-12"
            } md:mt-[4px]`}
          >
            <div className="h-[320px] md:h-[564px] w-full relative">
              <Image
                src={`${isMobile ? mobileImage : desktopImage}`}
                alt="gallery-1"
                fill
                className="object-cover rounded-lg md:rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCTA2;
