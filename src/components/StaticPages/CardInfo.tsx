import { CardType } from "@/types/staticPages";
import CardInfoItem from "@/components/StaticPages/CardInfoItem";

type CardInfoProps = {
  data: CardType;
  isMobile?: boolean;
  className?: string;
};

const CardInfo = ({ data, className }: CardInfoProps) => {
  return (
    <div
      className={`rounded-[20px] md:rounded-[40px] p-[2px] ${className || ""}`}
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <div
        className={`rounded-[20px] md:rounded-[40px] w-full h-full ${
          className?.includes("!cursor-default")
            ? "!cursor-default"
            : "!cursor-pointer"
        } flex flex-col justify-center`}
        style={{
          background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
        }}
      >
        <CardInfoItem data={data} />
      </div>
    </div>
  );
};

export default CardInfo;
