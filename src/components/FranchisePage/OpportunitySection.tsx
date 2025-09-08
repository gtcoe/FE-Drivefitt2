import { FranchiseCardSection } from "@/types/franchisePage";
import TitleDescription from "@/components/common/TitleDescription";
import OpportunityCard from "@/components/FranchisePage/OpportunityCard";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface OpportunitySectionProps {
  data: FranchiseCardSection;
  isMobile?: boolean;
}

const OpportunitySection = ({ data }: OpportunitySectionProps) => {
  const { title, description, cardList } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="flex flex-col items-center text-center gap-12">
        <div className="flex flex-col w-full gap-[16px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <ScrollAnimation delay={0.3} direction="up">
              <OpportunityCard card={cardList[0]} className="w-full" />
            </ScrollAnimation>
            <ScrollAnimation delay={0.4} direction="up">
              <OpportunityCard card={cardList[1]} className="w-full" />
            </ScrollAnimation>
            <ScrollAnimation delay={0.5} direction="up">
              <OpportunityCard card={cardList[2]} className="w-full" />
            </ScrollAnimation>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8 items-stretch">
            <ScrollAnimation delay={0.6} direction="up">
              <OpportunityCard
                card={cardList[3]}
                className="w-full"
                isHorizontal={true}
              />
            </ScrollAnimation>
            <ScrollAnimation delay={0.7} direction="up">
              <OpportunityCard
                card={cardList[4]}
                className="w-full"
                isHorizontal={true}
              />
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitySection;
