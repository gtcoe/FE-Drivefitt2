"use client";
import Image from "next/image";

interface MembershipAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile?: () => void;
  onGoHome?: () => void;
}

export default function MembershipAlertModal({
  isOpen,
  onClose,
  onGoToProfile,
  onGoHome,
}: MembershipAlertModalProps) {
  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onGoToProfile?.();
    onClose();
  };

  const handleGoHome = () => {
    onGoHome?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-black rounded-[40px] p-6 md:p-10 flex flex-col items-center gap-6 md:gap-10 relative w-full max-w-[541px] mx-4"
        style={{
          border: "4px solid transparent",
          background:
            "linear-gradient(black, black) padding-box, linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%) border-box",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <Image
            src="/images/success-tick.svg"
            alt="Success"
            width={84}
            height={84}
            className="opacity-100 w-16 h-16 md:w-[84px] md:h-[84px]"
          />
        </div>

        {/* Heading */}
        <h2 className="text-white text-center font-inter font-semibold text-2xl md:text-[32px] leading-7 md:leading-[36px]">
          Active Membership Found
        </h2>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4 md:gap-5">
          {/* Primary Button */}
          <button
            onClick={handleGoToProfile}
            className="w-full bg-[#00DBDC] text-black font-inter font-medium text-sm md:text-base leading-5 rounded-lg py-3 px-8 md:px-12 shadow-[0px_9px_12px_0px_rgba(0,219,220,0.1)] hover:bg-[#00C4C5] transition-colors max-w-[416px] mx-auto"
          >
            View My Profile
          </button>

          {/* Secondary Button */}
          <button
            onClick={handleGoHome}
            className="text-[#00DBDC] font-inter font-medium text-sm md:text-base leading-5 hover:text-[#00C4C5] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
