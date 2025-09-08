import { AppDownloadProps } from "@/types/staticPages";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const AppDownload = ({
  data,
  isMobile,
}: {
  data: AppDownloadProps;
  isMobile?: boolean;
}) => {
  // Add defensive check for undefined data
  if (!data) {
    return null;
  }

  const {
    title,
    description,
    googlePlayImg,
    appStoreImg,
    mobileImage,
    desktopImage,
  } = data;
  return (
    <ScrollAnimation delay={0.2} direction="up">
      <div className="relative md:px-[120px] px-6">
        {/* <Image
        src={mobileImage}
        alt="mobile"
        width={400}
        height={400}
        className="w-[240px] h-[200px] md:w-[400px] md:h-[400px] absolute bottom-[2px] right-[20vw] md:right-[190px] z-20"
      /> */}
        <div
          className="rounded-[20px] md:rounded-[40px] p-[2px] h-[420px] md:h-[540px]"
          style={{
            background:
              "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
          }}
        >
          <div
            className="rounded-[20px] md:rounded-[40px] w-full h-full cursor-pointer flex flex-col justify-start md:justify-center relative overflow-hidden"
            style={{
              backgroundImage: `url(${isMobile ? mobileImage : desktopImage})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <div className="flex flex-start px-5 pt-8 md:py-[124px] md:pl-[92px]">
              <div className="flex flex-col text-center md:text-start gap-3 md:gap-4 md:w-[573px] md:h-[292px]">
                <h2 className="text-2xl md:text-5xl font-semibold leading-7 md:leading-[56px] tracking-[-1px] md:tracking-[-2px]">
                  {title}
                </h2>
                {description && (
                  <p className="text-xs md:text-base font-light w-full md:w-[80%] leading-4 md:leading-5 tracking-[-1%] text-[#8A8A8A] mb-3 md:mb-[48px]">
                    {description}
                  </p>
                )}
                <div className="flex gap-4 justify-center md:justify-start">
                  <Image
                    src={googlePlayImg}
                    alt="google-play"
                    width={180}
                    height={56}
                    className="w-[120px] h-10 md:w-[140px] md:h-[64px]"
                  />
                  <Image
                    src={appStoreImg}
                    alt="app-store"
                    width={180}
                    height={56}
                    className="w-[120px] h-10 md:w-[140px] md:h-[64px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default AppDownload;
