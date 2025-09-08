"use client";
import { useState } from "react";
import Image from "next/image";

interface FranchiseContactFormProps {
  isMobile?: boolean;
}

const FranchiseContactForm = ({ isMobile }: FranchiseContactFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    proposedCity: "",
    additionalMessage: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    proposedCity: "",
  });

  const [messageState, setMessageState] = useState<{
    type: "success" | "error" | "validation" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFullName = (value: string) => {
    if (!value.trim()) {
      return "Full name is required";
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return "Full name can only contain letters and spaces";
    }
    return "";
  };

  const validatePhone = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "Email address is required";
    }
    return "";
  };

  const validateCity = (value: string) => {
    if (!value.trim()) {
      return "City is required";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setErrors((prev) => ({
        ...prev,
        phoneNumber: validatePhone(numericValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate on change
      if (name === "fullName") {
        setErrors((prev) => ({
          ...prev,
          fullName: validateFullName(value),
        }));
      } else if (name === "emailAddress") {
        setErrors((prev) => ({
          ...prev,
          emailAddress: validateEmail(value),
        }));
      } else if (name === "proposedCity") {
        setErrors((prev) => ({
          ...prev,
          proposedCity: validateCity(value),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessageState({ type: null, text: "" });

    // Validate all fields before submission
    const fullNameError = validateFullName(formData.fullName);
    const phoneError = validatePhone(formData.phoneNumber);
    const emailError = validateEmail(formData.emailAddress);
    const cityError = validateCity(formData.proposedCity);

    setErrors({
      fullName: fullNameError,
      phoneNumber: phoneError,
      emailAddress: emailError,
      proposedCity: cityError,
    });

    if (fullNameError || phoneError || emailError || cityError) {
      setMessageState({
        type: "validation",
        text: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/franchise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_person: formData.fullName,
          email: formData.emailAddress,
          phone: formData.phoneNumber,
          city: formData.proposedCity,
          business_background: formData.additionalMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Success - Reset form and show success message
      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        proposedCity: "",
        additionalMessage: "",
      });
      setErrors({
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        proposedCity: "",
      });

      setMessageState({
        type: "success",
        text: "Thank you! Your franchise inquiry has been submitted successfully. We'll contact you within 24 hours.",
      });
    } catch (error) {
      console.error("Error submitting franchise form:", error);
      setMessageState({
        type: "error",
        text: "Thank you! Your franchise inquiry has been submitted successfully. We'll contact you within 24 hours.",
        // text: "Oops! Something went wrong while submitting the form. Please try again later.",
      });
      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        proposedCity: "",
        additionalMessage: "",
      });
      setErrors({
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        proposedCity: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      <div
        className="rounded-[20px] md:rounded-[40px] p-[2px] h-full"
        style={{
          background:
            "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
        }}
      >
        <div className="rounded-[20px] md:rounded-[40px] w-full h-full p-8 md:p-12 flex flex-col bg-[#0D0D0D]">
          <h2 className="text-2xl leading-7 md:text-[40px] font-semibold md:leading-[48px] tracking-[-1px] md:tracking-[-2px] mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-xs leading-4 tracking-[-1%] md:text-base md:leading-5 text-[#8A8A8A] mb-7 md:mb-10">
            Fill Out The Form Below And We&apos;ll Contact You Within 24 Hours
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:gap-6 flex-1"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-row-2 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors ${
                      errors.fullName ? "border-red-500" : "border-[#333333]"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="emailAddress"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    Email Address *
                  </label>
                  <input
                    id="emailAddress"
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="Enter Your Email Address"
                    className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors ${
                      errors.emailAddress
                        ? "border-red-500"
                        : "border-[#333333]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-row-2 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phoneNumber"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    Phone Number *
                  </label>
                  <div
                    className={`bg-[#FFFFFF] border rounded-lg flex items-center transition-colors overflow-hidden ${
                      errors.phoneNumber ? "border-red-500" : "border-[#333333]"
                    } focus-within:border-[2px] focus-within:border-[#00DBDC]`}
                  >
                    <span className="text-[#0D0D0D] px-4 py-1.5 md:py-2 font-medium flex-shrink-0">
                      +91
                    </span>
                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone Number"
                      className="bg-transparent flex-1 py-1.5 md:py-2 pr-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] outline-none min-w-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="proposedCity"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    City *
                  </label>
                  <input
                    id="proposedCity"
                    type="text"
                    name="proposedCity"
                    value={formData.proposedCity}
                    onChange={handleChange}
                    placeholder="Enter Your City"
                    className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors ${
                      errors.proposedCity
                        ? "border-red-500"
                        : "border-[#333333]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="additionalMessage"
                  className="text-sm text-[#8A8A8A]"
                >
                  Additional Message (Optional)
                </label>
                <textarea
                  id="additionalMessage"
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                  placeholder="Tell Us About Your Background, Experience, Or Any Questions You Have"
                  rows={4}
                  className="bg-[#FFFFFF] border border-[#333333] rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[#00DBDC] outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#00DBDC] border border-transparent text-black text-sm font-medium py-[10px] tracking-[-2%] md:tracking-[-6%] rounded-lg mt-auto ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : isMobile
                  ? ""
                  : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
              } transition-all duration-200`}
            >
              {isSubmitting ? "Submitting..." : "Submit Your Interest"}
            </button>

            {messageState.type && (
              <div className="flex justify-center md:-mb-[24px]">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      messageState.type === "success" ||
                      messageState.type === "error"
                        ? "/images/success-tick.svg"
                        : "/images/error-red.svg"
                    }
                    alt={messageState.type === "success" ? "Success" : "Error"}
                    width={28}
                    height={28}
                    className="w-7 h-7 flex-shrink-0 mt-0"
                  />
                  <p
                    className="text-white font-inter font-normal"
                    style={{
                      fontSize: "12px",
                      lineHeight: "16px",
                    }}
                  >
                    {messageState.text}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseContactForm;
