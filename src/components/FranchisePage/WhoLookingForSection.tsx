import { FranchiseCardSection } from "@/types/franchisePage";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface WhatLookingForSectionProps {
  data: FranchiseCardSection;
  isMobile?: boolean;
}

const WhoLookingForSection = ({ data }: WhatLookingForSectionProps) => {
  const { title, description, cardList } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="grid grid-cols-2">
        {cardList.map((card, index) => {
          const isTopRow = index < 2;
          const isLeftColumn = index % 2 === 0;

          return (
            <ScrollAnimation
              key={index}
              delay={0.3 + index * 0.1}
              direction="up"
            >
              <div
                className={`${isTopRow ? "border-b border-[#333333]" : ""} ${
                  isLeftColumn ? "border-r border-[#333333]" : ""
                } p-4 md:px-12 md:py-[60px] flex flex-col items-center gap-3 md:gap-3`}
              >
                <div className="md:w-[100px] md:h-[100px] w-[60px] h-[60px] relative mb-3 md:mb-7">
                  <div
                    className="absolute inset-0 rounded-full md:w-[100px] md:h-[100px] w-[60px] h-[60px]"
                    style={{
                      boxShadow: "0px 7.2px 14.4px 0px #00DBDC33",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-[#00DBDC] rounded-full">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={60}
                        height={60}
                        className="md:max-w-[60px] md:max-h-[60px] w-auto max-w-9 max-h-9 h-auto"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl md:text-[32px] leading-6 tracking-[-1px] text-center md:leading-10 font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-[#8A8A8A] text-xs tracking-[0px] md:text-base leading-4 md:leading-5 text-center">
                  {card.description}
                </p>
              </div>
            </ScrollAnimation>
          );
        })}
      </div>
    </section>
  );
};

export default WhoLookingForSection;
