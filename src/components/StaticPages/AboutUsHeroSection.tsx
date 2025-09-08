"use client";
import { FranchiseHero } from "@/types/franchisePage";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface AboutUsHeroSectionProps {
  data: FranchiseHero;
  isMobile?: boolean;
}

const AboutUsHeroSection = ({ data }: AboutUsHeroSectionProps) => {
  const { title, description } = data;

  return (
    <div className="flex items-center justify-center mb-[-60px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-3 md:gap-6 mt-[85px] md:mt-[62px]">
          {/* Main Title */}
          <ScrollAnimation delay={0.3} direction="up">
            <div className="text-center w-full">
              <h1 className="text-[40px] md:text-[68px] font-light text-white tracking-[-2px] leading-[44px] md:leading-[78px]">
                <span className="font-bold">{title}</span>
              </h1>
            </div>
          </ScrollAnimation>

          {/* Description */}
          <ScrollAnimation delay={0.4} direction="up">
            <p className="md:max-w-[881px] text-base md:text-2xl tracking-[0%] leading-[20px] md:tracking-[-2%] text-white px-[29px] font-light mb-3 md:mb-4">
              {description}
            </p>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default AboutUsHeroSection;
