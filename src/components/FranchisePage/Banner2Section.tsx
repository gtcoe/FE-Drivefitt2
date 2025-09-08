import { Banner2SectionType } from "@/types/franchisePage";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface Banner2SectionProps {
  data: Banner2SectionType;
  isMobile?: boolean;
}

const Banner2Section = ({ data }: Banner2SectionProps) => {
  const {
    title,
    description,
    class: className,
    titleClass,
    descriptionClass,
    subClass
  } = data;
  return (
    <div className={`w-full px-6 md:px-[120px] ${className}`}>
      <ScrollAnimation delay={0.2} direction="up">
        <div
          className={`w-full items-center justify-center text-center md:text-left h-fit rounded-[30px] border-[2px] border-[#333333]  flex md:gap-[60px] md:flex-row flex-col gap-[30px] ${subClass || "py-8 px-6 md:py-[72px] md:px-[100px]"}`}
          style={{
            background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
          }}
        >
          <ScrollAnimation
            delay={0.3}
            direction="up"
            className="flex flex-col gap-4 md:gap-6"
          >
            <h2
              className={`px-5 md:px-0 ${
                titleClass ||
                "text-2xl md:text-5xl font-semibold leading-7 md:leading-[56px] tracking-[-1px] md:tracking-[-2px] text-center"
              }`}
            >
              {title}
            </h2>
            {description && (
            <p
              className={`${
                descriptionClass ||
                "text-xs md:text-base font-light leading-4 md:leading-5 tracking-[-1%] text-[#8A8A8A] text-center"
              }`}
            >
                {description}
              </p>
            )}
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Banner2Section;
