import { CountdownSection } from "@/types/staticPages";
import Countdown from "@/components/StaticPages/Countdown";

interface CountdownProps {
  countdownData: CountdownSection;
  isMobile?: boolean;
}

const CountdownTimer = ({ countdownData, isMobile }: CountdownProps) => {
  return (
    <div className="w-full px-6 md:px-[120px] mt-[39px] md:-mt-[107px]">
      <Countdown countdownData={countdownData} isMobile={isMobile} />
    </div>
  );
};

export default CountdownTimer;
