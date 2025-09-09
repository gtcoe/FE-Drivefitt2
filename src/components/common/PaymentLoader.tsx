"use client";

interface PaymentLoaderProps {
  isVisible: boolean;
  message?: string;
}

export default function PaymentLoader({
  isVisible,
  message = "Processing your payment...",
}: PaymentLoaderProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-[#0D0D0D] rounded-[40px] p-8 max-w-sm w-full shadow-xl"
        style={{
          border: "4px solid transparent",
          background:
            "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%) border-box",
        }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#333333] border-t-[#00DBDC] rounded-full animate-spin"></div>
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
            <p className="text-sm text-white/70">
              Please don&apos;t close this window
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
