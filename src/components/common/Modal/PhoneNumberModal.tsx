"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/authAPI";
import { OTPPurpose } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { UserInfoModal } from "./";

type ModalState = "phone" | "otp";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: (
    phoneNumber: string,
    userData?: {
      id: number;
      name: string;
      email: string;
      phone: string;
      dateOfBirth?: string;
    }
  ) => void; // Optional callback for successful authentication with user data
}

interface PhoneStepProps {
  phoneNumber: string;
  isFocused: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onContinue: () => void;
  isMobile?: boolean;
  isLoading?: boolean;
  error?: string;
}

interface OTPStepProps {
  phoneNumber: string;
  otpValues: string[];
  onOTPChange: (index: number, value: string) => void;
  onVerify: () => void;
  onChangePhone: () => void;
  timeLeft: number;
  onResendOTP: () => void;
  isMobile?: boolean;
  isLoading?: boolean;
  error?: string;
}

// Phone Number Step Component
const PhoneStep = ({
  phoneNumber,
  isFocused,
  onPhoneChange,
  onFocus,
  onBlur,
  onContinue,
  isMobile,
  isLoading,
  error,
}: PhoneStepProps) => (
  <>
    {/* Logo */}
    <div className="mb-8 md:mb-[48px] md:px-[64px]">
      <Image
        src="https://da8nru77lsio9.cloudfront.net/images/logo.svg"
        alt="DRIVEFITT"
        width={isMobile ? 165 : 212}
        height={isMobile ? 28 : 36}
        style={{
          width: isMobile ? "165px" : "212px",
          height: isMobile ? "28px" : "36px",
        }}
        className="object-contain"
      />
    </div>

    {/* Phone Input */}
    <div className="w-full mb-6 md:mb-[24px]">
      <input
        type="tel"
        placeholder={isFocused ? "" : "Enter phone number"}
        value={phoneNumber}
        onChange={onPhoneChange}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={10}
        className="w-full bg-transparent border-b-2 border-[#333333] pl-4 pr-4 py-3 md:py-4 text-[#00DBDC] placeholder-[#8A8A8A] focus:outline-none transition-colors duration-200 font-light text-base md:text-2xl md:leading-7 caret-[#00DBDC] text-center"
      />
    </div>

    {/* Error Message */}
    {error && (
      <div className="w-full mb-4 text-center">
        <p className="text-red-400 text-sm font-medium">{error}</p>
      </div>
    )}

    {/* Continue Button */}
    <button
      onClick={onContinue}
      disabled={phoneNumber.length !== 10 || isLoading}
      className={`w-full bg-[#00DBDC] border border-transparent rounded-lg py-3 md:py-3 text-[#0D0D0D] font-medium text-base md:text-lg mb-6 md:mb-[48px] ${
        isMobile
          ? ""
          : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
      } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00DBDC] disabled:hover:text-[#0D0D0D] disabled:hover:border-transparent`}
    >
      {isLoading ? "Sending..." : "Continue"}
    </button>

    {/* Terms and Privacy */}
    <div className="font-light md:text-base leading-5 tracking-[-0.02em] text-center text-[#6A6A6A] md:max-w-[291px]">
      <span className="md:mx-3">* By Continuing you agree to the </span>
      <br className="md:hidden" />
      <a
        href="/terms"
        className={`text-white ${
          isMobile ? "" : "hover:text-[#00DBDC]"
        } transition-colors underline`}
      >
        Terms & Conditions
      </a>
      <span> and </span>
      <a
        href="/privacy"
        className={`text-white ${
          isMobile ? "" : "hover:text-[#00DBDC]"
        } transition-colors underline`}
      >
        Privacy Policy
      </a>
      <span>.</span>
    </div>
  </>
);

// OTP Verification Step Component
const OTPStep = ({
  phoneNumber,
  otpValues,
  onOTPChange,
  onVerify,
  onChangePhone,
  timeLeft,
  onResendOTP,
  isMobile,
  isLoading,
  error,
}: OTPStepProps) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
      setFocusedIndex(0);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleInputBlur = () => {
    setFocusedIndex(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = e.target as HTMLInputElement;

    if (e.key === "Backspace") {
      e.preventDefault();

      if (input.value) {
        // If current input has value, clear it
        onOTPChange(index, "");
      } else if (index > 0) {
        // If current input is empty, move to previous input and clear it
        const prevInput = document.querySelector(
          `input[data-index="${index - 1}"]`
        ) as HTMLInputElement;
        if (prevInput) {
          onOTPChange(index - 1, "");
          prevInput.focus();
        }
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = document.querySelector(
        `input[data-index="${index - 1}"]`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      const nextInput = document.querySelector(
        `input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Prevent default arrow key behavior
    }
  };

  return (
    <>
      {/* Title */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-white font-semibold text-[32px] leading-[36px] tracking-[0%] text-center">
          Enter Code
        </h2>
      </div>

      {/* Description */}
      <div className="mb-8 md:mb-10 text-center">
        <p className="text-[#8A8A8A] font-light text-[20px] leading-[28px] tracking-[0%]">
          We&apos;ve sent a whatsapp message
        </p>
        <p className="text-[#8A8A8A] font-light text-[20px] leading-[28px] tracking-[0%]">
          with a code to your phone
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-white font-light text-[20px] leading-[28px] tracking-[0%] break-all">
            +91 {phoneNumber}
          </span>
          <button
            onClick={onChangePhone}
            className="text-[#00DBDC] font-light text-[20px] leading-[28px] tracking-[0%] whitespace-nowrap"
          >
            Change
          </button>
        </div>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-10">
        {otpValues.map((value, index) => (
          <input
            key={index}
            ref={index === 0 ? firstInputRef : null}
            type="text"
            value={value}
            onChange={(e) => onOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleInputFocus(index)}
            onBlur={handleInputBlur}
            data-index={index}
            maxLength={1}
            className={`w-12 h-12 md:w-16 md:h-16 bg-transparent border-2 rounded-lg text-center text-white text-lg md:text-xl font-medium focus:outline-none transition-colors duration-200 ${
              value || focusedIndex === index
                ? "border-[#00DBDC]"
                : "border-[#333333]"
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full mb-4 text-center">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={onVerify}
        disabled={otpValues.some((val) => val === "") || isLoading}
        className={`w-full bg-[#00DBDC] border border-transparent rounded-lg py-3 md:py-3 text-[#0D0D0D] font-medium text-base md:text-lg mb-6 md:mb-8 ${
          isMobile
            ? ""
            : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
        } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00DBDC] disabled:hover:text-[#0D0D0D] disabled:hover:border-transparent`}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      {/* Resend OTP */}
      <div className="text-center">
        <span className="text-[#8A8A8A] font-medium text-base leading-[20px] tracking-[-0.02em]">
          Didn&apos;t receive OTP?{" "}
        </span>
        {timeLeft > 0 ? (
          <span className="text-[#00DBDC] font-medium text-base leading-[20px] tracking-[-0.02em]">
            {formatTime(timeLeft)}
          </span>
        ) : (
          <button
            onClick={onResendOTP}
            disabled={isLoading}
            className={`text-[#00DBDC] font-medium text-base leading-[20px] tracking-[-0.02em] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Resend"}
          </button>
        )}
      </div>
    </>
  );
};

const PhoneNumberModal = ({
  isOpen,
  onClose,
  isMobile,
  onSuccess,
}: PhoneNumberModalProps) => {
  const [modalState, setModalState] = useState<ModalState>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleVerifyRef = useRef<() => Promise<void>>();
  const hasAutoSubmittedRef = useRef(false);
  const { login } = useAuth();
  const router = useRouter();

  // Check if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside
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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Disable/enable body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setModalState("phone");
      setPhoneNumber("");
      setIsFocused(false);
      setOtpValues(["", "", "", ""]);
      setTimeLeft(59);
      setError(""); // Clear error when modal is closed
      hasAutoSubmittedRef.current = false; // Reset auto-submit flag
    }
  }, [isOpen]);

  // OTP Timer
  useEffect(() => {
    if (modalState === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [modalState, timeLeft]);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 10) {
        setPhoneNumber(value);
      }
    },
    []
  );

  const sendOTPAndUpdateDBAsync = useCallback(
    async (phone: string, purpose: OTPPurpose, otp: string) => {
      try {
        // Step 2: Send SMS with the generated OTP via Edge Runtime
        const smsResponse = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            purpose,
            otp,
          }),
        });

        const smsResult = await smsResponse.json();

        // Step 3: Update vendor response in database
        await fetch("/api/auth/otp-db-operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operation: "update_vendor_response",
            phone,
            purpose,
            vendorResponse: {
              success: smsResult.success,
              response: smsResult.message || "OTP sent successfully",
            },
          }),
        });

        console.log("Background OTP operations completed:", {
          success: smsResult.success,
        });
      } catch (error) {
        console.error("Error in background OTP operations:", error);
        // Don't show error to user since this runs in background
      }
    },
    []
  );

  const handleContinue = useCallback(async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true);
      setError("");

      try {
        // Step 1: Generate OTP and store in database
        const dbResponse = await fetch("/api/auth/otp-db-operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operation: "generate_and_store",
            phone: phoneNumber,
            purpose: OTPPurpose.LOGIN,
          }),
        });

        const dbResult = await dbResponse.json();
        if (!dbResult.success) {
          setError("Failed to generate OTP");
          return;
        }

        // Show OTP screen immediately after successful database operation
        setModalState("otp");

        // Step 2 & 3: Run SMS sending and DB update in background (don't wait)
        sendOTPAndUpdateDBAsync(phoneNumber, OTPPurpose.LOGIN, dbResult.otp);
      } catch (error) {
        console.error("Error in OTP flow:", error);
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [phoneNumber, sendOTPAndUpdateDBAsync]);

  const handleOTPChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return; // Only allow digits

      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Reset auto-submit flag only if we're going from 4 digits to less than 4 digits
      // This allows auto-submit to work when completing the 4th digit
      const wasComplete = otpValues.every((val) => val !== "");
      const isComplete = newOtpValues.every((val) => val !== "");

      if (wasComplete && !isComplete) {
        hasAutoSubmittedRef.current = false;
      }

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(
          `input[data-index="${index + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    },
    [otpValues]
  );

  const handleVerify = useCallback(async () => {
    const otp = otpValues.join("");

    if (otp.length === 4 && otpValues.every((val) => val !== "")) {
      setIsLoading(true);
      setError("");

      try {
        const response = await authAPI.verifyOTP(
          phoneNumber,
          otp,
          OTPPurpose.LOGIN
        );

        if (response.success && response.data) {
          // User exists, store user data and token in Redux
          const user = response.data.user;
          const token = response.data.token;

          // Store user data in Redux
          console.log("PhoneNumberModal: Attempting to login user:", user);
          const loginResult = await login({ user, token });
          console.log("PhoneNumberModal: Login result:", loginResult);

          if (loginResult.type === "auth/loginUser/fulfilled") {
            // Check if user has complete profile data
            const hasCompleteProfile =
              user.name && user.email && user.phone;

            console.log("PhoneNumberModal: User data after login:", {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              dateOfBirth: user.dateOfBirth,
              hasCompleteProfile,
            });

            if (!hasCompleteProfile) {
              // User exists but profile is incomplete, open UserInfoModal
              console.log(
                "PhoneNumberModal: User profile incomplete, opening UserInfoModal"
              );
              setIsUserInfoModalOpen(true);
              return;
            }

            // If onSuccess callback is provided, use it instead of redirecting
            if (onSuccess) {
              onSuccess(phoneNumber, user);
              onClose();
              return;
            }

            // Default behavior: Use membership data from OTP verification response
            if (user.hasMembership) {
              // User has membership, redirect to profile
              console.log(
                "PhoneNumberModal: User has membership, redirecting to profile"
              );
              onClose();
              router.push("/profile");
            } else {
              // User doesn't have membership, redirect to membership page
              console.log(
                "PhoneNumberModal: User has no membership, redirecting to membership page"
              );
              onClose();
              router.push("/membership");
            }
          } else {
            setError("Login failed. Please try again.");
          }
        } else if (response.success && !response.data) {
          // User doesn't exist, open UserInfoModal for registration
          setIsUserInfoModalOpen(true);
          // Don't close the modal yet - let UserInfoModal handle the flow
        } else {
          setError(response.message || "Invalid OTP");
          // Don't reset flag on error - only reset when user changes OTP values
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Server Down, Please try again later."
        );
        // Don't reset flag on error - only reset when user changes OTP values
      } finally {
        setIsLoading(false);
      }
    }
  }, [otpValues, phoneNumber, onClose, login, onSuccess, router]);

  // Store handleVerify in ref to avoid circular dependency
  useEffect(() => {
    handleVerifyRef.current = handleVerify;
  }, [handleVerify]);

  // Auto-submit OTP when all 4 digits are entered (only once)
  useEffect(() => {
    if (
      modalState === "otp" &&
      otpValues.every((val) => val !== "") &&
      !isLoading &&
      !hasAutoSubmittedRef.current
    ) {
      hasAutoSubmittedRef.current = true; // Mark as auto-submitted to prevent repeated calls
      const timer = setTimeout(() => {
        // Use ref to call handleVerify without circular dependency
        if (handleVerifyRef.current) {
          handleVerifyRef.current();
        }
      }, 100); // Small delay to ensure state is updated
      return () => clearTimeout(timer);
    }
  }, [otpValues, modalState, isLoading]);

  const handleChangePhone = useCallback(() => {
    setModalState("phone");
    setTimeLeft(59); // Reset timer when going back to phone input
  }, []);

  const handleResendOTP = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.sendOTP(phoneNumber, OTPPurpose.LOGIN);

      if (response.success) {
        setTimeLeft(59);
        setOtpValues(["", "", "", ""]);
        hasAutoSubmittedRef.current = false; // Reset auto-submit flag when resending OTP
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div
      className="z-[10000] p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative flex flex-col items-center justify-center"
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`z-10 w-8 h-8  mb-[24px] md:w-10 md:h-10 rounded-full bg-gray-600 bg-opacity-50 flex items-center justify-center ${
            isMobile ? "" : "hover:bg-opacity-70"
          } transition-all duration-200 md:mb-[22px]`}
        >
          <Image
            src="https://da8nru77lsio9.cloudfront.net/images/otp-modal-close-icon.svg"
            alt="Close"
            width={16}
            height={16}
            className="w-[48px] h-[48px] "
          />
        </button>

        <div
          className={`rounded-[20px] md:rounded-[40px] p-[2px] w-full w-[340px] md:w-[420px]`}
          style={{
            background:
              "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
          }}
        >
          <div className="bg-[#0D0D0D] rounded-[20px] md:rounded-[40px] flex flex-col items-center px-6 py-8 md:px-[40px] md:py-[48px]">
            {modalState === "phone" ? (
              <PhoneStep
                phoneNumber={phoneNumber}
                isFocused={isFocused}
                onPhoneChange={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onContinue={handleContinue}
                isMobile={isMobile}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <OTPStep
                phoneNumber={phoneNumber}
                otpValues={otpValues}
                onOTPChange={handleOTPChange}
                onVerify={handleVerify}
                onChangePhone={handleChangePhone}
                timeLeft={timeLeft}
                onResendOTP={handleResendOTP}
                isMobile={isMobile}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isUserInfoModalOpen && createPortal(modalContent, document.body)}
      <UserInfoModal
        isOpen={isUserInfoModalOpen}
        onClose={() => {
          setIsUserInfoModalOpen(false);
        }}
        isMobile={isMobile}
        phoneNumber={phoneNumber}
        onParentClose={onClose}
      />
    </>
  );
};

export default PhoneNumberModal;
