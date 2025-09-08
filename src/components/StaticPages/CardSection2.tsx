import { StaticCardProps } from "@/types/staticPages";
import StaticCard from "@/components/StaticPages/StaticCard";
import TitleDescription from "@/components/common/TitleDescription";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const CardSection2 = ({
  data,
  isMobile,
}: {
  data: StaticCardProps;
  isMobile?: boolean;
}) => {
  const { title, description, cardSection } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      {isMobile ? (
        <div className="flex flex-col w-full gap-4">
          {data.cardSection.map((card, idx) => (
            <ScrollAnimation key={idx} delay={0.3 + idx * 0.2} direction="up">
              <StaticCard data={card} className="h-[256px] md:h-[407px]" />
            </ScrollAnimation>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-10">
          <ScrollAnimation delay={0.3} direction="up">
            <StaticCard
              data={cardSection[0]}
              className="h-[256px] md:h-[407px]"
            />
          </ScrollAnimation>
          <ScrollAnimation delay={0.5} direction="up">
            <StaticCard
              data={cardSection[1]}
              className="h-[256px] md:h-[407px]"
            />
          </ScrollAnimation>
        </div>
      )}
    </section>
  );
};

export default CardSection2;
