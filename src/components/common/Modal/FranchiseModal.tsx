"use client";
import { useEffect, useRef } from "react";
import FranchiseContactForm from "@/components/common/FranchiseContactForm";
import Image from "next/image";

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const FranchiseModal = ({ isOpen, onClose, isMobile }: FranchiseModalProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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
        <FranchiseContactForm isMobile={isMobile} />
      </div>
    </div>
  );
};

export default FranchiseModal;
