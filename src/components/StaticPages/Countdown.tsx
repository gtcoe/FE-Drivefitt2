import TimeFlipCard from "@/components/StaticPages/TimerFlipCard";
import { CountdownProps } from "@/types/staticPages";

const Countdown = ({ countdownData, isMobile }: CountdownProps) => {
  const { title, date, bgImage, mobileBgImage, location, openingText, labels } =
    countdownData;

  if (!title || !date || !bgImage) {
    return null;
  }

  const safeLabels = labels || {
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
  };

  const backgroundImage = isMobile && mobileBgImage ? mobileBgImage : bgImage;

  return (
    <div
      className="w-full max-w-[1200px] mx-auto h-fit md:h-[236px] flex items-center rounded-[30px] border-[2px] border-[#343434]"
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full flex-col flex-stretch md:flex-row pt-6 pb-[38px] md:py-[40px] gap-4 md:gap-20 justify-between md:px-[46px] text-center md:text-left">
        <div className="flex items-center px-8 md:px-0 md:w-[402px] md:ml-[59px] w-full md:flex-1">
          <h2 className="text-xl leading-7 text-white md:text-[32px] md:leading-[46px] font-semibold tracking-[-1px]">
            {title}
            {!isMobile && <br />}
            <span className="text-[#00DBDC] italic md:text-[30px]">
              {location}
            </span>
          </h2>
        </div>
        <div className="text-[#8A8A8A] text-[10px] md:text-sm md:leading-5 leading-3 text-center items-center flex flex-col gap-3">
          <div className="text-xs md:text-sm">{openingText}</div>
          <TimeFlipCard countdownDate={date} labels={safeLabels} />
        </div>
      </div>
    </div>
  );
};

export default Countdown;
