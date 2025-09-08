"use client";
import { SportsClubSectionProps } from "@/types/staticPages";
import TitleDescription from "@/components/common/TitleDescription";
import ScrollAnimation from "@/components/common/ScrollAnimation";

type BannerType = {
  data: SportsClubSectionProps;
  isMobile?: boolean;
};

const Banner = ({ data, isMobile }: BannerType) => {
  const { title, description, image, mobileImage, btnLabel } = data;
  const imageToUse = isMobile && mobileImage ? mobileImage : image;

  const handleButtonClick = () => {
    window.location.href = "/contact-us";
  };

  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5 md:gap-8">
      <ScrollAnimation delay={0.2} direction="up">
        <div
          className="rounded-[20px] md:rounded-[40px] p-[2px] h-[224px] md:h-[534px]"
          style={{
            background:
              "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
          }}
        >
          <div
            className="rounded-[20px] md:rounded-[40px] w-full h-full flex flex-col justify-center p-6 md:p-10"
            style={{
              background: `linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, #0D0D0D 100%), url(${imageToUse})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundAttachment: "local",
              backgroundSize: "cover",
            }}
          >
            <div className="flex flex-col justify-end md:justify-center h-full items-center gap-4 md:gap-10 md:pt-[115px]">
              <ScrollAnimation delay={0.4} direction="up">
                <TitleDescription
                  title={title || ""}
                  description={description || ""}
                  isBanner={true}
                />
              </ScrollAnimation>
              <ScrollAnimation delay={0.6} direction="up">
                <button
                  onClick={handleButtonClick}
                  className={`bg-[#00DBDC] border border-transparent w-fit leading-[100%] tracking-[-5%] text-base text-[#0D0D0D] md:px-12 py-[10px] px-9 rounded-[4px] md:rounded-lg font-medium ${
                    isMobile
                      ? "font-medium text-sm leading-none tracking-tighter"
                      : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
                  } transition-all duration-200 h-[37px] md:h-[50px] cursor-pointer`}
                >
                  {btnLabel}
                </button>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default Banner;
