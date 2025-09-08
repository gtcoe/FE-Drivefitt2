import { ImageCardSection } from "@/types/franchisePage";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface WhatYouReceiveSectionProps {
  data: ImageCardSection;
  isMobile?: boolean;
}

const WhatYouReceiveSection = ({
  data,
  isMobile,
}: WhatYouReceiveSectionProps) => {
  const { title, description, cardList, imageMobile, imageDesktop } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="flex gap-1 md:gap-[60px] md:flex-row flex-col w-full items-center justify-around">
        <ScrollAnimation delay={0.3} direction="left" className="w-[1/2]">
          <div
            className="rounded-[20px] md:rounded-[40px] p-[2px] md:h-[760px] h-full overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
            }}
          >
            <div className="rounded-[20px] md:rounded-[40px] w-full h-full flex flex-col justify-end overflow-hidden">
              <Image
                src={isMobile ? imageMobile : imageDesktop}
                alt={title || ""}
                width={563}
                height={760}
                className="md:w-[563px] h-full w-full object-cover"
              />
            </div>
          </div>
        </ScrollAnimation>
        <div className="w-full md:w-1/2 flex flex-col">
          {cardList.map((card, index) => {
            return (
              <ScrollAnimation
                key={index}
                delay={0.3 + index * 0.1}
                direction="right"
              >
                <div className="flex gap-4 md:gap-10 min-h-full border-b border-[#333333]">
                  <div className="min-h-full flex items-start justify-center py-6 md:py-10">
                    <div className="md:w-12 md:h-12 w-10 h-10 relative">
                      <div
                        className="absolute inset-0 rounded-full md:w-12 md:h-12 w-10 h-10"
                        style={{
                          boxShadow: "0px 7.2px 14.4px 0px #00DBDC33",
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-[#00DBDC] rounded-full">
                          <Image
                            src={card.icon}
                            alt={card.title}
                            width={24}
                            height={24}
                            className="max-w-5 max-h-5 md:max-w-6 md:max-h-6 w-auto h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      card.title === "Ongoing growth support"
                        ? "border-b-0"
                        : ""
                    } flex flex-col gap-2 md:gap-3 py-6 md:py-10 items-start justify-center `}
                  >
                    <div className="font-semibold text-xl md:text-[32px] leading-6 md:leading-10 tracking-[-1px]">
                      {card.title}
                    </div>
                    <div className="font-light text-xs md:text-sm tracking-[0px] leading-4 md:leading-5">
                      {card.description}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceiveSection;
