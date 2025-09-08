import { SportsClubSectionProps } from "@/types/staticPages";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface SportsClubProps {
  data: SportsClubSectionProps;
  isMobile?: boolean;
}

const SportsClub = ({ data, isMobile }: SportsClubProps) => {
  const { title, description, image, mobileImage } = data;
  const imageToUse = isMobile && mobileImage ? mobileImage : image;

  return (
    <section className="md:-mb-[94px] ">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription
          title={title || ""}
          description={description || ""}
          className="px-[24px]"
        />
      </ScrollAnimation>
      <ScrollAnimation delay={0.4} direction="up">
        <div className="w-full flex justify-center">
          <Image
            src={imageToUse}
            alt={title || ""}
            width={1440}
            height={775}
            className="mt-[1px] max-w-full h-auto"
          />
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default SportsClub;
