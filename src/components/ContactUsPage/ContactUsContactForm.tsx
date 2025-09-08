"use client";
import { ContactUsContactFormProps } from "@/types/staticPages";
import { useEffect, useRef, useState } from "react";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import Image from "next/image";

const ContactUsContactForm = ({
  data,
  isMobile,
}: {
  data: ContactUsContactFormProps;
  isMobile?: boolean;
}) => {
  const { title, description, submitButtonText, fields } = data;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    preferredLocation: "",
    message: "",
  });

  const [interests, setInterests] = useState({
    cricket: false,
    fitness: false,
    recovery: false,
    running: false,
    pilates: false,
    personalTraining: false,
    physiotherapy: false,
    groupClasses: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    preferredLocation: "",
  });

  const [messageState, setMessageState] = useState<{
    type: "success" | "error" | "validation" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const interestOptions = [
    { key: "cricket", label: "Cricket" },
    { key: "fitness", label: "Fitness" },
    { key: "recovery", label: "Recovery" },
    { key: "running", label: "Running" },
    { key: "pilates", label: "Pilates" },
    { key: "personalTraining", label: "Personal Training" },
    { key: "physiotherapy", label: "Physiotherapy" },
    { key: "groupClasses", label: "Group Classes" },
  ];

  const validateName = (value: string) => {
    if (value.length < 2) {
      return "Name missing";
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validatePhone = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const validatePreferredLocation = (value: string) => {
    if (!value) {
      return "Preferred location is required";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(numericValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate on change
      if (name === "name") {
        setErrors((prev) => ({
          ...prev,
          name: validateName(value),
        }));
      } else if (name === "preferredLocation") {
        setErrors((prev) => ({
          ...prev,
          preferredLocation: validatePreferredLocation(value),
        }));
      }
    }
  };

  const handleInterestChange = (interestKey: string) => {
    setInterests((prev) => ({
      ...prev,
      [interestKey]: !prev[interestKey as keyof typeof prev],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessageState({ type: null, text: "" });

    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const preferredLocationError = validatePreferredLocation(
      formData.preferredLocation
    );

    setErrors({
      name: nameError,
      phone: phoneError,
      preferredLocation: preferredLocationError,
    });

    if (nameError || phoneError || preferredLocationError) {
      setMessageState({
        type: "validation",
        text: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          preferredLocation: formData.preferredLocation,
          interests: {
            cricket: interests.cricket ? 1 : 0,
            fitness: interests.fitness ? 1 : 0,
            recovery: interests.recovery ? 1 : 0,
            running: interests.running ? 1 : 0,
            pilates: interests.pilates ? 1 : 0,
            personalTraining: interests.personalTraining ? 1 : 0,
            physiotherapy: interests.physiotherapy ? 1 : 0,
            groupClasses: interests.groupClasses ? 1 : 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Success - Reset form and show success message
      setFormData({
        name: "",
        phone: "",
        preferredLocation: "",
        message: "",
      });
      setInterests({
        cricket: false,
        fitness: false,
        recovery: false,
        running: false,
        pilates: false,
        personalTraining: false,
        physiotherapy: false,
        groupClasses: false,
      });
      setErrors({
        name: "",
        phone: "",
        preferredLocation: "",
      });

      setMessageState({
        type: "success",
        text: "Thank you! Your message has been sent successfully. We'll get back to you shortly",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessageState({
        type: "error",
        text: "Thank you! Your message has been sent successfully. We'll get back to you shortly",
        // text: "Oops! Something went wrong while submitting the form. Please try again later.",
      });
      setFormData({
        name: "",
        phone: "",
        preferredLocation: "",
        message: "",
      });
      setInterests({
        cricket: false,
        fitness: false,
        recovery: false,
        running: false,
        pilates: false,
        personalTraining: false,
        physiotherapy: false,
        groupClasses: false,
      });
      setErrors({
        name: "",
        phone: "",
        preferredLocation: "",
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
        <div className="rounded-[20px] md:rounded-[40px] w-full h-full p-[20px] md:p-12 flex flex-col bg-[#0D0D0D]">
          <ScrollAnimation delay={0.2} direction="right">
            <h2 className="text-2xl leading-7 md:text-[40px] font-semibold md:leading-[48px] tracking-[-1px] md:tracking-[-2px] mb-2">
              {title}
            </h2>
            <p className="text-xs leading-4 tracking-[-1%] md:text-base md:leading-5 text-[#8A8A8A] mb-7 md:mb-10">
              {description}
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3} direction="right">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 md:gap-6 flex-1"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    {fields.name.label}
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={fields.name.placeholder}
                    className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors w-full ${
                      errors.name ? "border-red-500" : "border-[#333333]"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs md:text-sm text-[#8A8A8A]"
                  >
                    {fields.phone.label}
                  </label>
                  <div
                    className={`bg-[#FFFFFF] border rounded-lg flex items-center transition-colors overflow-hidden w-full ${
                      errors.phone ? "border-red-500" : "border-[#333333]"
                    } focus-within:border-[2px] focus-within:border-[#00DBDC]`}
                  >
                    <span className="text-[#0D0D0D] px-4 py-1.5 md:py-2 font-medium flex-shrink-0">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={fields.phone.placeholder}
                      className="bg-transparent flex-1 py-1.5 md:py-2 pr-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] outline-none min-w-0"
                    />
                  </div>
                </div>
              </div>

              {/* Interest Selection Pills */}
              <div className="flex flex-col gap-3">
                <label className="text-xs md:text-sm text-[#8A8A8A]">
                  {fields.interests.label}
                </label>
                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
                  {interestOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleInterestChange(option.key)}
                      className={`group pl-2 py-2 md:px-4 md:py-2 rounded-lg text-sm font-normal tracking-[0%] transition-all flex items-center justify-between duration-200 ${
                        interests[option.key as keyof typeof interests]
                          ? "bg-[#00DBDC1A] text-[#00DBDC]"
                          : "bg-[#1D1D1D] text-[#8A8A8A] md:hover:bg-[#00DBDC1A] md:hover:text-[#00DBDC]"
                      }`}
                    >
                      <Image
                        src={
                          interests[option.key as keyof typeof interests]
                            ? "/images/enabled-check-tick.svg"
                            : "/images/disabled-check-tick.svg"
                        }
                        alt="redirectionBtn"
                        width={16}
                        height={16}
                        className={`flex-shrink-0 transition-all duration-200 ${
                          interests[option.key as keyof typeof interests]
                            ? ""
                            : "group-hover:hidden"
                        }`}
                      />
                      <Image
                        src="/images/enabled-check-tick.svg"
                        alt="redirectionBtn"
                        width={16}
                        height={16}
                        className={`flex-shrink-0 transition-all duration-200 ${
                          interests[option.key as keyof typeof interests]
                            ? "hidden"
                            : "hidden group-hover:block"
                        }`}
                      />
                      <span className="text-left leading-tight flex-1 pl-[4px] whitespace-nowrap ">
                        {option.label}
                      </span>
                      <div className="flex-shrink-0 w-4"></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Location Dropdown (custom) */}
              <div className="flex flex-col gap-1.5" ref={locationDropdownRef}>
                <label className="text-xs md:text-sm text-[#8A8A8A]">
                  {fields.preferredLocation?.label || "Preferred Location"}
                </label>
                <button
                  type="button"
                  onClick={() => setIsLocationOpen((v) => !v)}
                  className={`w-full bg-[#FFFFFF] border rounded-lg py-2 px-4 text-left flex items-center justify-between transition-colors focus:outline-none focus:border-[2px] focus:border-[#00DBDC] ${
                    errors.preferredLocation
                      ? "border-red-500"
                      : "border-[#333333]"
                  }`}
                >
                  <span
                    className={
                      formData.preferredLocation
                        ? "text-[#0D0D0D]"
                        : "text-[#8A8A8A]"
                    }
                  >
                    {formData.preferredLocation ||
                      fields.preferredLocation?.placeholder ||
                      "Select Location"}
                  </span>
                  <Image
                    src={
                      isLocationOpen
                        ? "/images/accordian-up-arrow.svg"
                        : "/images/accordian-down-arrow.svg"
                    }
                    alt="toggle"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
                {isLocationOpen && (
                  <div className="relative">
                    <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-[#333333] bg-[#FFFFFF] shadow-lg">
                      {(fields.preferredLocation?.options || []).map((opt) => (
                        <li key={opt}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                preferredLocation: opt,
                              }));
                              setErrors((prev) => ({
                                ...prev,
                                preferredLocation: "",
                              }));
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              formData.preferredLocation === opt
                                ? "bg-[#00DBDC1A] text-[#00DBDC]"
                                : "text-[#0D0D0D] hover:bg-[#00DBDC1A] hover:text-[#000000]"
                            }`}
                          >
                            {opt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="message" className="text-sm text-[#8A8A8A]">
                  {fields.message.label}
                </label>
                <input
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={fields.message.placeholder}
                  className="bg-[#FFFFFF] border border-[#333333] rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] h-14 placeholder:text-[#8A8A8A] focus:border-[#00DBDC] outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#00DBDC] border border-transparent text-black text-sm font-medium py-[10px] tracking-[-2%] md:tracking-[-6%] rounded-lg ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : isMobile
                    ? ""
                    : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
                } transition-all duration-200`}
              >
                {isSubmitting ? "Sending..." : submitButtonText}
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
                      alt={
                        messageState.type === "success" ? "Success" : "Error"
                      }
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
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default ContactUsContactForm;
