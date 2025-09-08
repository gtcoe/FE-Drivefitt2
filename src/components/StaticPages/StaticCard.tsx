import { StaticCardType } from "@/types/staticPages";
import Image from "next/image";
import { PROTEIN_BAR_TEXT } from "@/data/constants";

interface StaticCardProps {
  data: StaticCardType;
  className?: string;
}
const StaticCard = ({ data, className }: StaticCardProps) => {
  const { title, description, backgroundImage, modalImage } = data;
  return (
    <div className="cursor-default">
      <div
        className={` rounded-[20px] md:rounded-[40px] p-[2px] ${className}`}
        style={{
          background:
            "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
        }}
      >
        <div
          className="rounded-[20px] md:rounded-[40px] bg-[#0D0D0D] w-full h-full flex flex-col justify-end relative"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className={`absolute top-0 ${
              title === PROTEIN_BAR_TEXT
                ? "right-[3%] top-[-10%] md:right-[3%] md:top-[-10%] h-[276px] md:h-[440px] w-[153px]  md:w-[244px]"
                : "right-[-5%] top-[-9%] md:right-[-5%] md:top-[-27px] h-[271px] md:h-[430px]  w-[260px]  md:w-[412px]"
            }`}
          >
            <Image
              src={modalImage || ""}
              alt={`${title} - ${description}`}
              width={title === PROTEIN_BAR_TEXT ? 244 : 412}
              height={title === PROTEIN_BAR_TEXT ? 440 : 430}
              className={`${
                title === PROTEIN_BAR_TEXT
                  ? "w-[153px] h-[276px] md:w-[244px] md:h-[440px]"
                  : "w-[260px] h-[271px] md:w-[412px] md:h-[430px]"
              } object-contain object-right`}
              style={{
                objectPosition: "right center",
              }}
            />
          </div>
          <div className="flex justify-between items-end p-6 md:p-10 relative">
            <div className="flex flex-col justify-start w-3/5 gap-2 md:gap-4">
              <h3 className="text-white text-[20px]  md:text-[32px] tracking-[-1px] leading-6 md:leading-9 font-semibold">
                <div>The</div>
                <div>{title}</div>
              </h3>
              <p className="text-white text-xs leading-4 md:text-base tracking-[-2%] md:leading-[24px] font-light">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticCard;
