import { Card } from "@/types/franchisePage";
import Image from "next/image";

interface OpportunityCardProps {
  card: Card;
  className?: string;
  isHorizontal?: boolean;
}

const OpportunityCard = ({
  card,
  className,
  isHorizontal = false,
}: OpportunityCardProps) => {
  const { icon, title, description, subTitle } = card;
  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] h-full p-4 md:p-10 flex ${
        isHorizontal
          ? "flex-col md:flex-row md:items-start"
          : "flex-row md:flex-col items-center md:items-start"
      } border border-[#333333] gap-3 ${className}`}
      style={{
        background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
      }}
    >
      <Image
        src={icon}
        alt={title}
        width={96}
        height={96}
        className={`${
          isHorizontal ? "mb-0 md:mr-8" : "mb-2 md:mb-7"
        } size-[60px] md:size-[96px]`}
      />
      <div
        className={`flex flex-col ${
          isHorizontal ? "items-start text-left" : "items-start text-left"
        }`}
      >
        <h4 className="text-xl md:text-2xl font-semibold text-white mb-1 md:mb-3">
          {title}
        </h4>
        <h3 className="text-xl md:text-3xl leading-10 font-normal text-white tracking-[1px] mb-[12px]">
          {subTitle}
        </h3>
        <p className="text-[#8A8A8A] font-light text-base leading-5">
          {description}
        </p>
      </div>
    </div>
  );
};

export default OpportunityCard;
