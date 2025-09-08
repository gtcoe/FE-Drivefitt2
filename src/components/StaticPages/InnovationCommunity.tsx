import { InnovationCommunitySectionProps } from "@/types/staticPages";
import InfoCard from "@/components/StaticPages/InfoCard";
import TitleDescription from "@/components/common/TitleDescription";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const InnovationCommunity = ({
  data,
}: {
  data: InnovationCommunitySectionProps;
}) => {
  const { title, description, infoSection } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5 ">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-3 gap-5 md:gap-10">
        {infoSection.map((item, index) => (
          <ScrollAnimation
            key={item.title}
            delay={0.3 + index * 0.1}
            direction="up"
          >
            <InfoCard data={item} />
          </ScrollAnimation>
        ))}
      </div>
    </section>
  );
};

export default InnovationCommunity;
