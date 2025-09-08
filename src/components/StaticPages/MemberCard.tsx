import { MemberItem } from "@/types/staticPages";
import Image from "next/image";

const MemberCard = ({ data }: { data: MemberItem }) => {
  const { title, description, backgroundImage } = data;
  return (
    <div
      className="relative rounded-[20px] md:rounded-[40px] h-[304px] md:h-[568px] w-[200px] md:w-full cursor-pointer member-card-bg"
      style={{
        backgroundImage: `linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%), url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <h3 className="text-white leading-6 tracking-0 text-xl font-semibold">
          {title}
        </h3>
        <p className="text-[#D4D4D8] text-sm font-normal leading-[22px] tracking-0">
          {description}
        </p>
      </div>
      <div className="absolute bottom-1 right-1">
        <Image
          src="https://da8nru77lsio9.cloudfront.net/images/Play.svg"
          alt="play"
          width={98}
          height={98}
        />
      </div>
    </div>
  );
};

export default MemberCard;
