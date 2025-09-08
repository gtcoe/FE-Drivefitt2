import { CardSection, CardType } from "@/types/staticPages";
import Card from "@/components/StaticPages/Card";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const CardSection4 = ({
  data,
  isMobile,
}: {
  data: CardSection;
  isMobile?: boolean;
}) => {
  const { title, description, cardSection } = data;

  const CustomMobileCard = ({ card }: { card: CardType }) => (
    <div
      className="rounded-[20px] p-[2px]"
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <a
        href={card.link}
        className="relative block rounded-[20px] overflow-hidden h-[256px] w-full"
        style={{
          backgroundImage: `url(${card.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute left-0 bottom-0 w-full p-6 flex justify-between items-end gap-[20px]">
          <div className="flex flex-col">
            <h3
              className="text-white font-semibold mb-4"
              style={{
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "24px",
                letterSpacing: "-1px",
              }}
            >
              {card.title}
            </h3>
            <p
              className="text-white font-light"
              style={{
                fontWeight: 300,
                fontSize: "12px",
                lineHeight: "16px",
                letterSpacing: "-2%",
              }}
            >
              {card.description}
            </p>
          </div>

          {card.link && (
            <div
              className={`flex items-end justify-end flex-shrink-0  -mr-[15px] ${
                card.description?.length && card.description?.length < 100
                  ? "-mb-[13px]"
                  : "-mb-[7px]"
              }`}
            >
              <Image
                src={
                  "https://da8nru77lsio9.cloudfront.net/images/redirectionButton.svg"
                }
                alt="redirectionBtn"
                width={50}
                height={50}
                style={{
                  width: "50px",
                  height: "50px",
                  opacity: 1,
                }}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );

  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      {isMobile ? (
        <div className="flex flex-col w-full gap-4">
          {cardSection.map((card, idx) => (
            <ScrollAnimation key={idx} delay={0.3 + idx * 0.15} direction="up">
              <CustomMobileCard card={card} />
            </ScrollAnimation>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 gap-[40px]">
          {cardSection.map((card, idx) => (
            <ScrollAnimation key={idx} delay={0.3 + idx * 0.15} direction="up">
              <Card
                data={card}
                iconClass="!size-10"
                textPlusImageClass="md:pb-[40px]"
                imageClass="md:h-[360px]"
                type={1}
              />
            </ScrollAnimation>
          ))}
        </div>
      )}
    </section>
  );
};

export default CardSection4;
