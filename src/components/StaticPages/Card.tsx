import { CardType } from "@/types/staticPages";
import Image from "next/image";

interface CardProps {
  data: CardType;
  isMobile?: boolean;
  className?: string;
  imageClass?: string;
  iconClass?: string;
  textPlusImageClass?: string;
  type?: number;
}

const Card = ({
  data,
  isMobile,
  className,
  imageClass,
  iconClass,
  textPlusImageClass,
  type,
}: CardProps) => {
  const { title, description, backgroundImage, link, redirectionIcon } = data;

  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] p-[2px] ${className}`}
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <a
        href={link}
        className={`${
          isMobile ? "" : "group"
        } relative block rounded-[20px] md:rounded-[40px] overflow-hidden h-[256px]  ${
          className?.includes("!cursor-default")
            ? "!cursor-default"
            : "!cursor-pointer"
        } w-full border-0 ${imageClass} ${
          type === 1 ? "md:h-[360px]" : "md:h-[407px]"
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div
          className={`absolute inset-0 transition-all duration-300 ease-in-out ${
            isMobile ? "" : "group-hover:backdrop-blur-sm"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div
          className={`absolute left-0 bottom-0 w-full p-6 md:px-10 md:pt-[46px] md:pb-[3px] ${
            isMobile ? "" : "group-hover:md:py-[28px]"
          } flex justify-between items-start ${textPlusImageClass}`}
        >
          <div
            className={`flex flex-col transition-all duration-300 ease-in-out ${
              isMobile ? "" : "transform group-hover:translate-y-[-8px]"
            }`}
          >
            <h3 className="text-white text-xl leading-6 md:leading-9 md:text-[32px] font-semibold">
              {title}
            </h3>
            <p
              className={`text-white text-base md:text-lg font-light leading-tight tracking-tight ${
                isMobile
                  ? "block mt-4"
                  : "hidden group-hover:block mt-4 opacity-0 group-hover:opacity-100"
              } transition-all duration-300 ease-in-out md:max-w-[392px]`}
            >
              {description}
            </p>
          </div>

          {link && (
            <div
              className={`flex items-center justify-center md:pl-[25px]  ${
                description && description.length > 0 && !isMobile
                  ? description.length < 100
                    ? "md:group-hover:mt-[50px]"
                    : "md:group-hover:mt-[60px]"
                  : ""
              }`}
            >
              <Image
                src={
                  redirectionIcon ||
                  "https://da8nru77lsio9.cloudfront.net/images/redirectionButton.svg"
                }
                alt="redirectionBtn"
                width={isMobile ? 32 : 70}
                height={isMobile ? 32 : 70}
                className={`${
                  isMobile ? "!size-8" : iconClass || "!size-[70px]"
                } ${iconClass}`}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default Card;
