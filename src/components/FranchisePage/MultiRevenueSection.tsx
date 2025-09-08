import { FranchiseCardSection } from "@/types/franchisePage";
import TitleDescription from "@/components/common/TitleDescription";
import MultiRevenueCard from "@/components/FranchisePage/MultiRevenueCard";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export interface MultiRevenueSectionProps {
  data: FranchiseCardSection;
  isMobile?: boolean;
}

const MultiRevenueSection = ({ data }: MultiRevenueSectionProps) => {
  const { title, description, cardList, cardTitleClass, cardDescriptionClass } =
    data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="flex flex-col items-center text-center gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 w-full">
          {cardList.map((card, index) => (
            <ScrollAnimation
              key={index}
              delay={0.3 + index * 0.1}
              direction="up"
            >
              <MultiRevenueCard
                card={card}
                cardTitleClass={cardTitleClass}
                cardDescriptionClass={cardDescriptionClass}
              />
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MultiRevenueSection;
