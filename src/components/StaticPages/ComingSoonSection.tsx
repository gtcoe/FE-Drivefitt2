import { ComingSoonSection as ComingSoonSectionType } from "@/types/staticPages";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface ComingSoonSectionProps {
  data: ComingSoonSectionType;
  isMobile?: boolean;
}

const ComingSoonSection = ({ data }: ComingSoonSectionProps) => {
  const {
    title,
    description,
    iconImage: illustration,
    btnPrimaryText,
    btnSecondaryText,
    btnPrimaryLink = "/",
    btnSecondaryLink,
  } = data;

  return (
    <div className="flex items-center justify-center h-[calc(100vh-170px)]">
      <div className="mx-auto text-center px-4">
        <ScrollAnimation
          delay={0.2}
          direction="up"
          className="flex flex-col items-center justify-center"
        >
          <div className="mb-8 w-[80px] h-[80px] md:mb-[48px] md:w-[120px] md:h-[120px]">
            <Image
              src={illustration}
              alt="Coming Soon Illustration"
              className="opacity-60 w-full h-full"
              width={120}
              height={120}
            />
          </div>
          <h1 className="text-white text-[32px] font-semibold leading-[40px] tracking-[-1px] mb-4 md:text-[48px] md:font-bold md:leading-[60px] md:tracking-[-2px] md:mb-[24px] md:w-[497px] md:h-[120px]">
            {title}
          </h1>

          <p className="text-[#FFFFFF] text-[14px] font-light leading-5 tracking-[-0.5px] mb-8 max-w-[300px] md:text-[16px] md:leading-6 md:tracking-[-1px] md:mb-[48px] md:max-w-none">
            {description}
          </p>

          <div className="flex flex-row gap-4 md:flex-row md:gap-4 md:w-auto">
            {btnSecondaryText && btnSecondaryLink && (
              <Link href={btnSecondaryLink} className="w-full md:w-auto">
                <button className="w-[155px] bg-transparent text-[#00DBDC] border border-[#00DBDC] rounded-[8px] py-3 text-[16px] font-medium leading-[24px] md:w-[224px] md:h-[56px] md:text-[20px] md:leading-[100%] md:tracking-[-2%] md:py-4 md:px-12 hover:bg-[#00DBDC] hover:text-[#0D0D0D] transition-all duration-200">
                  {btnSecondaryText}
                </button>
              </Link>
            )}

            <Link href={btnPrimaryLink} className="w-full md:w-auto">
              <button className="w-[155px] bg-[#00DBDC] border border-transparent rounded-[8px] py-3 text-[16px] font-medium leading-[24px] text-[#0D0D0D] md:w-[224px] md:h-[56px] md:text-[20px] md:leading-[100%] md:tracking-[-2%] md:py-4 hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200">
                {btnPrimaryText}
              </button>
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default ComingSoonSection;
