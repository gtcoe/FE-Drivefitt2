"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FranchiseHero } from "@/types/franchisePage";
import { MouseEvent, ButtonHTMLAttributes } from "react";
interface JobHeroData
  extends Omit<FranchiseHero, "btnPrimaryText" | "btnPrimaryLink"> {
  jobType?: string;
  isJobDetail?: boolean;
  showBackButton?: boolean;
  btnPrimaryText?: string;
  btnPrimaryLink?: string;
}
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface AboutUsHeroSectionProps {
  data: JobHeroData;
  isMobile?: boolean;
}

const AboutUsHeroSection = ({ data }: AboutUsHeroSectionProps) => {
  const { title, description } = data;
  const router = useRouter();

  return (
    <div className="flex items-center justify-center mb-[-60px]">
      <div className="container mx-auto px-4 relative">
        {data.showBackButton && (
          <button
            {...({} as ButtonHTMLAttributes<HTMLButtonElement>)}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              router.back();
            }}
            className="absolute left-6 md:left-4 top-0 md:top-[62px] bg-[#00DBDC] rounded-full p-[6px] md:p-3 hover:bg-[#00c5c6] transition-all duration-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="#0D0D0D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="#0D0D0D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <div className="flex flex-col items-center text-center gap-3 md:gap-6 mt-[85px] md:mt-[62px]">
          {/* Main Title */}
          <ScrollAnimation delay={0.3} direction="up">
            <div className="text-center w-full">
              <h1 className="text-[40px] md:text-[68px] font-light text-white tracking-[-2px] leading-[44px] md:leading-[78px]">
                <span className="font-bold">{title}</span>
              </h1>
            </div>
          </ScrollAnimation>

          {/* Description or Job Details */}
          <ScrollAnimation delay={0.4} direction="up">
            {data.isJobDetail ? (
              <div className="flex items-center justify-center gap-3">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/careers/marker.svg"
                    alt="Location"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-base md:text-lg text-[#BFBFBF] font-light">
                    {description}
                  </span>
                </div>

                {/* Separator */}
                <div className="w-1 h-1 bg-[#8A8A8A] rounded-full"></div>

                {/* Job Type */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/careers/luggage.svg"
                    alt="Job Type"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-base md:text-lg text-[#BFBFBF] font-light">
                    {data.jobType || "Full time"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="md:max-w-[881px] text-base md:text-2xl tracking-[0%] leading-[20px] md:tracking-[-2%] text-white px-[29px] font-light mb-3 md:mb-4">
                {description}
              </p>
            )}
          </ScrollAnimation>

          {/* Apply Now Button */}
          {data.btnPrimaryText && data.btnPrimaryLink && (
            <ScrollAnimation delay={0.5} direction="up">
              <button
                {...({} as ButtonHTMLAttributes<HTMLButtonElement>)}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  router.push(data.btnPrimaryLink!);
                }}
                className="bg-[#00DBDC] text-black px-8 py-2.5 rounded-lg hover:bg-black hover:text-[#00DBDC] hover:border-[#00DBDC] border border-transparent transition-all duration-200 mt-6"
              >
                {data.btnPrimaryText}
              </button>
            </ScrollAnimation>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsHeroSection;
