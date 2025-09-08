"use client";
import { useEffect, useRef } from "react";
import UserInfoForm from "@/components/common/UserInfoForm";
import Image from "next/image";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  phoneNumber?: string;
  onParentClose?: () => void; // Callback to close parent PhoneNumberModal
  onSuccess?: () => void; // Optional callback for successful registration
}

const UserInfoModal = ({
  isOpen,
  onClose,
  isMobile,
  phoneNumber,
  onParentClose,
  onSuccess,
}: UserInfoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className={`z-10 w-8 h-8 mb-[24px] md:w-10 md:h-10 rounded-full bg-gray-600 bg-opacity-50 flex items-center justify-center ${
            isMobile ? "" : "hover:bg-opacity-70"
          } transition-all duration-200 md:mb-[22px]`}
        >
          <Image
            src="https://da8nru77lsio9.cloudfront.net/images/otp-modal-close-icon.svg"
            alt="Close"
            width={16}
            height={16}
            className="w-[48px] h-[48px]"
          />
        </button>
        <UserInfoForm
          isMobile={isMobile}
          phoneNumber={phoneNumber}
          onParentClose={onParentClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

export default UserInfoModal;
