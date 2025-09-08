import { CardType } from "@/types/staticPages";
import Image from "next/image";

const CardInfoItem = ({ data }: { data: CardType }) => {
  const { title, description, iconImage } = data;

  return (
    <div className="flex p-6 md:p-8 md:flex-col flex-row gap-4 md:gap-8">
      <Image src={iconImage || ""} alt={title || ""} width={56} height={56} />
      <div className="flex flex-col gap-2 md:gap-3 w-full text-white">
        <h2 className="text-base leading-5 md:text-[32px] tracking-[-1px] md:leading-9 font-semibold">
          {title}
        </h2>
        <p className="text-xs tracking-[-2%] font-light md:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardInfoItem;
