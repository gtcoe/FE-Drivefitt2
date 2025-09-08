import { Card } from "@/types/franchisePage";
import Image from "next/image";

interface VisionCardProps {
  card: Card;
  className?: string;
  isMobile?: boolean;
  isHorizontal?: boolean;
}

const VisionCard = ({ card, className, isMobile }: VisionCardProps) => {
  const {
    icon,
    title,
    description,
    subTitle,
    tooltipImage,
    tooltipImageMobile,
    backgroundImage,
  } = card;

  // Define specific positioning for each person based on their image
  const getImageStyles = (personName: string) => {
    switch (personName) {
      case "Mark Sellar":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "6%",
        };
      case "Deke Smith":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "4%",
        };
      case "Shubman Gill":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          right: "25%",
          top: "10%",
        };
      case "Preity G Zinta":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "8%",
        };
      case "Vikram Bhatia":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "10%",
        };
      default:
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "10%",
        };
    }
  };

  const getImageStylesMobile = (personName: string) => {
    switch (personName) {
      case "Mark Sellar":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "4%",
          top: "6%",
        };
      case "Deke Smith":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "16%",
          top: "12%",
        };
      case "Shubman Gill":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          right: "25%",
          top: "12%",
        };
      case "Preity G Zinta":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "8%",
          top: "12%",
        };
      case "Vikram Bhatia":
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "12%",
        };
      default:
        return {
          objectPosition: "center bottom",
          objectFit: "cover" as const,
          left: "25%",
          top: "10%",
        };
    }
  };

  const getTooltipStyles = (personName: string) => {
    switch (personName) {
      case "Mark Sellar":
        return {
          left: "10%",
          top: "36%",
        };
      case "Deke Smith":
        return {
          // right: "15%",
          top: "34%",
          left: "60%",
        };
      case "Shubman Gill":
        return {
          // right: "7%",
          top: "35%",
          left: "60%",
        };
      case "Preity G Zinta":
        return {
          left: "15%",
          top: "58%",
        };
      case "Vikram Bhatia":
        return {
          left: "12%",
          top: "40%",
        };
      default:
        return {
          left: "25%",
          top: "10%",
        };
    }
  };

  const getTooltipStylesMobile = (personName: string) => {
    switch (personName) {
      case "Mark Sellar":
        return {
          right: "10%",
          top: "23%",
        };
      case "Deke Smith":
        return {
          // right: "15%",
          top: "50%",
          left: "10%",
        };
      case "Shubman Gill":
        return {
          // right: "7%",
          top: "39%",
          left: "60%",
        };
      case "Preity G Zinta":
        return {
          right: "15%",
          top: "22%",
        };
      case "Vikram Bhatia":
        return {
          left: "12%",
          top: "45%",
        };
      default:
        return {
          left: "25%",
          top: "10%",
        };
    }
  };

  const imageStyles = isMobile
    ? getImageStylesMobile(title)
    : getImageStyles(title);

  const tooltipStyles = isMobile
    ? getTooltipStylesMobile(title)
    : getTooltipStyles(title);

  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] h-[352px] md:h-[429px] flex overflow-hidden relative border border-[#333333] ${className}`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: backgroundImage ? `url("${backgroundImage}")` : `url("/images/VisionaryCardBg.svg")`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Person Image */}
      <div
        className="absolute top-0 left-0 w-full h-[260px] md:!h-[380px] overflow-hidden "
        style={imageStyles}
      >
        <Image
          src={icon}
          alt={title}
          width={286}
          height={380}
          className="h-[320px] md:!h-[380px]"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(17, 17, 17, 0) 53.15%, #141414 94.04%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute flex flex-col items-center justify-center gap-1"
        style={tooltipStyles}
      >
        {tooltipImage && tooltipImageMobile ? (
          <div>
            <Image
              src={isMobile ? tooltipImageMobile : tooltipImage}
              alt={title}
              height={39}
              width={150}
              className="w-fit h-[26px]md:!h-[39px]"
            />
          </div>
        ) : (
          <div className="bg-[#00DBDC] text-[#0D0D0D] px-3 py-1 rounded-md text-sm font-semibold w-fit">
            {title}
          </div>
        )}
        <p className="text-[#00DBDC] text-xs w-[111px] md:w-full font-light tracking-[0%] leading-4 italic">
          {subTitle}
        </p>
      </div>
      {/* Content */}
      <div
        className={`${
          title === "Mark Sellar" || title === "Deke Smith"
            ? "md:py-6 md:px-[60px]"
            : "md:px-5 md:py-3"
        } absolute bottom-0 p-5 left-0 right-0 z-10`}
      >
        <p className="text-[#FFFFFF99] font-light text-xs md:text-sm tracking-[0%] md:tracking-[-2%] text-center leading-4 md:leading-5">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VisionCard;
