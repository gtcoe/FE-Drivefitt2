"use client";

import TitleDescription from "../common/TitleDescription";
import ScrollAnimation from "../common/ScrollAnimation";

interface Package {
  name: string;
  sessions: string;
  includes: string;
}

interface ChooseYourPathSectionProps {
  title: string;
  packages: Package[];
  buttonText?: string;
  isMobile?: boolean;
}

const ChooseYourPathSection = ({
  title,
  packages,
  buttonText = "Book Your Class Today",
  isMobile = false,
}: ChooseYourPathSectionProps) => {
  const handleBookClass = () => {
    console.log("Book class clicked");
  };

  return (
    <div className="w-full">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title} />
      </ScrollAnimation>

      <div className="px-6 md:px-[120px] max-w-[1440px] mx-auto mt-8 md:mt-[20px]">
        {/* Desktop Table View */}
        <ScrollAnimation delay={0.3} direction="up">
          <div className="hidden md:block">
            <div
              className="rounded-[40px] overflow-hidden relative p-[2px]"
              style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                opacity: 1,
                background:
                  "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
              }}
            >
              {/* Inner container with dark background */}
              <div className="bg-[#111111] rounded-[38px] w-full z-10 overflow-hidden h-auto">
                {/* Table Header */}
                <div
                  className="border-b border-[#333333] bg-[#151617] rounded-t-[38px]"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "25% 25% 50%",
                  }}
                >
                  <div className="px-[60px] py-[40px] text-left">
                    <h3 className="text-[#8A8A8A] uppercase text-base font-medium tracking-[4px] leading-5">
                      PACKAGE
                    </h3>
                  </div>
                  <div className="py-[40px] text-center border-l border-[#333333]">
                    <h3 className="text-[#8A8A8A] uppercase text-base font-medium tracking-[4px] leading-5">
                      SESSIONS / MONTH
                    </h3>
                  </div>
                  <div className="px-[60px] py-[40px] text-left border-l border-[#333333]">
                    <h3 className="text-[#8A8A8A] uppercase text-base font-medium tracking-[4px] leading-5">
                      INCLUDES
                    </h3>
                  </div>
                </div>

                {/* Table Rows */}
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`${
                      index < packages.length - 1
                        ? "border-b border-[#333333]"
                        : ""
                    }`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "25% 25% 50%",
                    }}
                  >
                    <div className="px-[60px] py-[40px] text-left flex items-center">
                      <p className="text-white text-2xl font-normal leading-7">
                        {pkg.name}
                      </p>
                    </div>
                    <div className="px-[60px] py-[40px] text-center border-l border-[#333333] flex items-center justify-center">
                      <p className="text-white text-2xl font-normal leading-7">
                        {pkg.sessions}
                      </p>
                    </div>
                    <div className="px-[60px] py-[40px] text-left border-l border-[#333333] flex items-center">
                      <p className="text-white text-2xl font-normal leading-7">
                        {pkg.includes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Mobile Table View */}
        <ScrollAnimation delay={0.4} direction="up">
          <div className="md:hidden ">
            <div
              className="rounded-[40px] overflow-hidden relative p-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
              }}
            >
              {/* Inner container with dark background */}
              <div className="bg-[#141414] rounded-[38px] p-0">
                {packages.map((pkg, index) => (
                  <div key={index} className="p-[24px] pb-0">
                    {/* Row 1: Package Name and Sessions */}
                    <div className="flex mb-[24px]" style={{ gap: "32px" }}>
                      {/* Package Component */}
                      <div className="flex flex-col">
                        <p className="text-white text-base font-normal leading-6 mb-[2px]">
                          {pkg.name}
                        </p>
                        <p className="text-[#8A8A8A] uppercase text-xs font-medium tracking-[2px] leading-4">
                          PACKAGE
                        </p>
                      </div>

                      {/* Sessions Component */}
                      <div className="flex flex-col">
                        <p className="text-white text-base font-normal leading-6 mb-[2px]">
                          {pkg.sessions}
                        </p>
                        <p className="text-[#8A8A8A] uppercase text-xs font-medium tracking-[2px] leading-4">
                          SESSIONS / MONTH
                        </p>
                      </div>
                    </div>

                    {/* Row 3: Includes content (full width) */}
                    <div className="mb-[2px]">
                      <p className="text-white text-base font-normal leading-5">
                        {pkg.includes}
                      </p>
                    </div>

                    {/* Row 4: Includes label (left aligned) */}
                    <div
                      className={`${
                        index === packages.length - 1 ? "mb-0" : "mb-[24px]"
                      }`}
                    >
                      <p className="text-[#8A8A8A] uppercase text-xs font-medium tracking-[2px] leading-4">
                        INCLUDES
                      </p>
                    </div>

                    {/* Divider between packages (except last one) */}
                    {index < packages.length - 1 && (
                      <div className="border-b-2 border-[#333333] -mx-[24px]"></div>
                    )}
                    {index === packages.length - 1 && (
                      <div className="pb-[24px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Book Class Button */}
        <ScrollAnimation delay={0.5} direction="up">
          <div className="flex justify-center mt-6 md:mt-[60px]">
            <button
              onClick={handleBookClass}
              className={`bg-[#00DBDC] border border-transparent w-fit leading-[100%] tracking-[-5%] text-base text-[#0D0D0D] px-10 py-3 rounded-[4px] md:rounded-lg font-medium ${
                isMobile
                  ? "h-[37px] font-medium text-sm leading-none tracking-tighter"
                  : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
              } transition-all duration-200 md:px-[48px] md:h-[50px]`}
            >
              {buttonText}
            </button>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default ChooseYourPathSection;
