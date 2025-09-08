"use client";
import { useState } from "react";
import { LoginModalType } from "@/types/staticPages";
import { PhoneNumberModal, EmailModal } from "./Modal";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { useAuth } from "@/hooks/useAuth";

interface JoinNowProps {
  isMobile?: boolean;
  loginModalType?: LoginModalType;
}

export default function JoinNow({
  isMobile,
  loginModalType = LoginModalType.EMAIL,
}: JoinNowProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <section className="md:px-[120px] px-6 flex justify-center md:-my-[120px]">
      <ScrollAnimation delay={0.2} direction="up">
        <button
          onClick={() => {
            if (isAuthenticated) {
              window.location.href = "/membership";
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          className={`bg-[#00DBDC] border border-transparent rounded-[4px] md:rounded-lg px-10 py-3 text-[#0D0D0D] font-medium text-base ${
            isMobile
              ? "h-[37px] font-medium text-sm leading-none tracking-tighter"
              : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
          } transition-all duration-200 md:px-[48px] md:h-[50px]`}
        >
          Join Now
        </button>
      </ScrollAnimation>

      {/* Login Modals */}
      {loginModalType === LoginModalType.PHONE ? (
        <PhoneNumberModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          isMobile={isMobile}
        />
      ) : (
        <EmailModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          isMobile={isMobile}
        />
      )}
    </section>
  );
}
