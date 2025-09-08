import ScrollAnimation from "@/components/common/ScrollAnimation";
import Image from "next/image";

interface Banner2WithImageProps {
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  mobileBackgroundImage?: string;
  isMobile?: boolean;
  className?: string;
}

const Banner2WithImage = ({
  title,
  description,
  image,
  backgroundImage,
  mobileBackgroundImage,
  isMobile,
  className,
}: Banner2WithImageProps) => {
  return (
    <div className={`w-full px-6 md:px-[120px] ${className}`}>
      <ScrollAnimation delay={0.2} direction="up">
        <div
          className="w-full h-fit rounded-[30px] border-[2px] border-[#333333] relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
          }}
        >
          {/* Background image - desktop: right 50%, mobile: lower 60% */}
          <div
            className={`absolute bg-cover bg-center ${
              isMobile
                ? "bottom-0 left-0 w-full h-[60%]"
                : "top-0 right-0 w-1/2 h-full -mr-[244px]"
            }`}
            style={{
              backgroundImage: `url(${
                isMobile && mobileBackgroundImage
                  ? mobileBackgroundImage
                  : backgroundImage
              })`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Content container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center px-6 pt-[32px] md:pr-[40px] md:pl-[60px] md:gap-[11px]">
            {/* Left side - Text content */}
            <div className="flex flex-col gap-4 md:gap-6 text-center md:text-left md:max-w-[617px]">
              <ScrollAnimation delay={0.3} direction="up">
                <h2
                  className="text-white font-semibold"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "48px",
                    lineHeight: isMobile ? "28px" : "56px",
                    letterSpacing: "-1px",
                  }}
                >
                  {title}
                </h2>
              </ScrollAnimation>

              <ScrollAnimation delay={0.4} direction="up">
                <p
                  className="text-[#FFFFFF] font-light"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: isMobile ? "14px" : "16px",
                    lineHeight: isMobile ? "20px" : "24px",
                    letterSpacing: "0px",
                  }}
                >
                  {description}
                </p>
              </ScrollAnimation>
            </div>

            {/* Right side - Image */}
            <div className="flex-1 flex justify-center md:justify-end -mt-[10px]">
              <ScrollAnimation delay={0.5} direction="right">
                <Image
                  src={image}
                  alt="Personal Training"
                  width={473}
                  height={400}
                  className="w-full max-w-[400px] md:max-w-[473px] h-auto object-cover rounded-[20px]"
                />
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Banner2WithImage;
