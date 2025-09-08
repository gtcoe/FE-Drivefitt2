import { RecoveryBannerProps } from "@/types/staticPages";
import ScrollAnimation from "@/components/common/ScrollAnimation";

type RecoveryBannerType = {
  data: RecoveryBannerProps;
  isMobile?: boolean;
};

const RecoveryBanner = ({ data, isMobile }: RecoveryBannerType) => {
  const { title, description, image, mobileImage } = data;
  const imageToUse = isMobile && mobileImage ? mobileImage : image;

  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <div
          className="rounded-[20px] md:rounded-[40px] p-[1.5px] md:p-[2px] h-[392px] md:h-[408px md:w-full mx-auto"
          style={{
            background:
              "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
          }}
        >
          <div
            className="rounded-[20px] md:rounded-[40px] w-full h-full flex flex-col justify-center p-6"
            style={{
              background: `linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, #0D0D0D 100%), url(${imageToUse})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundAttachment: "local",
              backgroundSize: "cover",
            }}
          >
            <div className="flex flex-col h-full items-center justify-end md:items-start md:max-w-[600px] md:pl-[36px] md:pt-[36px] md:pb-[36px]">
              <h2 className="text-white text-[24px] md:text-[48px] leading-[28px] md:leading-[66px] font-semibold tracking-[-1px] md:tracking-[-2.4px] mb-4 md:mb-[28px] md:max-w-[441px] capitalize text-center md:text-left">
                {title}
              </h2>
              <p className="text-white text-[12px] md:text-[16px] leading-[20px] md:leading-[32px] font-light tracking-[0px] md:max-w-[536px] text-center md:text-left">
                {description}
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default RecoveryBanner;
