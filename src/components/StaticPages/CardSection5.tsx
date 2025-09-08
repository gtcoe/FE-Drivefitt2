import { CardSection } from "@/types/staticPages";
import TitleDescription from "@/components/common/TitleDescription";
import CardInfoItem from "@/components/StaticPages/CardInfoItem";
import { CardType } from "@/types/staticPages";
import ScrollAnimation from "@/components/common/ScrollAnimation";

// Custom Card component without hover effects
const StaticCard = ({
  data,
  className,
  imageClass,
}: {
  data: CardType;
  className?: string;
  imageClass?: string;
}) => {
  const { title, description, backgroundImage } = data;

  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] p-[2px] ${className}`}
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <div
        className={`relative rounded-[20px] md:rounded-[40px] overflow-hidden h-[256px] md:h-[407px] cursor-default w-full border-0 ${imageClass}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute left-0 bottom-0 w-full p-6 md:px-10 md:py-[46px] flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-white text-xl leading-6 md:leading-9 md:text-[32px] font-semibold">
              {title}
            </h3>
            <p className="text-white text-base md:text-[14px] font-light leading-tight tracking-tight mt-4 md:max-w-[392px]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom CardInfo component without hover effects
const StaticCardInfo = ({
  data,
  className,
}: {
  data: CardType;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] p-[2px] ${className || ""}`}
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <div
        className="rounded-[20px] md:rounded-[40px] w-full h-full cursor-default flex flex-col justify-center"
        style={{
          background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
        }}
      >
        <CardInfoItem data={data} />
      </div>
    </div>
  );
};

const CardSection5 = ({
  data,
  isMobile,
}: {
  data: CardSection;
  isMobile?: boolean;
}) => {
  const { title, description, cardSection } = data;
  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5 md:gap-8 md:mt-[-60px]">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      {isMobile ? (
        <ScrollAnimation delay={0.3} direction="up">
          <div
            className="rounded-[20px] md:rounded-[40px] p-[2px]"
            style={{
              background:
                "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
            }}
          >
            <div
              className="rounded-[20px] md:rounded-[40px] w-full h-full cursor-pointer flex flex-col justify-center"
              style={{
                background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
              }}
            >
              {cardSection.map((card, idx) => {
                return (
                  <div key={idx} className="flex flex-col">
                    <CardInfoItem data={card} />
                    {idx < cardSection.length - 1 && (
                      <div className="border-b border-[#333333] mx-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollAnimation>
      ) : (
        <div className="grid grid-cols-3 gap-10 w-full h-[722px]">
          <ScrollAnimation
            delay={0.3}
            direction="up"
            className="flex flex-col gap-10"
          >
            <StaticCard
              data={cardSection[0]}
              className="!h-[406px]"
              imageClass="!h-[402px]"
            />
            <StaticCardInfo data={cardSection[1]} className="!h-[276px]" />
          </ScrollAnimation>
          <ScrollAnimation delay={0.4} direction="up" className="flex flex-col">
            <StaticCard
              data={cardSection[2]}
              className="!h-[722px]"
              imageClass="!h-[718px]"
            />
          </ScrollAnimation>
          <ScrollAnimation
            delay={0.5}
            direction="up"
            className="flex flex-col gap-10"
          >
            <StaticCardInfo data={cardSection[3]} className="!h-[276px]" />
            <StaticCard
              data={cardSection[4]}
              className="!h-[406px]"
              imageClass="!h-[402px]"
            />
          </ScrollAnimation>
        </div>
      )}
    </section>
  );
};

export default CardSection5;
