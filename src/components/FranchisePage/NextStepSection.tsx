import { FranchiseCardSection } from "@/types/franchisePage";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface NextStepSectionProps {
  data: FranchiseCardSection;
  isMobile?: boolean;
}

const NextStepSection = ({ data }: NextStepSectionProps) => {
  const { title, description, cardList, cardTitleClass, cardDescriptionClass } =
    data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="flex gap-4 md:gap-[29px] h-full">
        <div className="relative flex flex-col justify-around items-center">
          <div className="absolute left-1/2 top-[50px] md:top-[100px] bottom-[50px] md:bottom-[100px] w-[2px] border-l-[2px] border-dashed border-[#333333]" />
          {cardList.map((card, index) => {
            return (
              <ScrollAnimation
                key={card.title}
                delay={0.3 + index * 0.15}
                direction="left"
              >
                <div className="relative bg-[#333333] size-[48px] md:size-[100px] rounded-full flex justify-center items-center text-2xl md:text-5xl leading-[100%] md:leading-[56px] font-light">
                  {index + 1}
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
        <div className="flex flex-col justify-between gap-2 md:gap-6 w-full">
          {cardList.map((card, index) => {
            return (
              <ScrollAnimation
                key={index}
                delay={0.3 + index * 0.15}
                direction="right"
              >
                <div
                  className="rounded-[20px] items-center md:rounded-[40px] border border-[#333333] p-6 md:p-10 flex gap-4 md:gap-10"
                  style={{
                    background:
                      "linear-gradient(180deg, #111111 0.77%, #141414 100%)",
                  }}
                >
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={76}
                    height={76}
                    className="size-[56px] md:size-[76px]"
                  />
                  <div className="flex flex-col gap-2 md:gap-4 tracking-[-1px]">
                    <h3
                      className={`${
                        cardTitleClass ||
                        "font-semibold text-xl md:text-[28px] leading-6 md:leading-10"
                      }`}
                    >
                      {card.title}
                    </h3>
                    {card.description && (
                      <p
                        className={`${
                          cardDescriptionClass ||
                          "text-[#8A8A8A] font-light md:font-normal text-xs md:text-base leading-4 md:leading-5 tracking-[0%]"
                        }`}
                      >
                        {card.description}
                      </p>
                    )}
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

export default NextStepSection;
