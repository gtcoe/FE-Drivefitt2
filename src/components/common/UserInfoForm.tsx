"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface UserInfoFormProps {
  isMobile?: boolean;
  phoneNumber?: string;
  onParentClose?: () => void;
  onSuccess?: () => void; // Optional callback for successful registration
}

const UserInfoForm = ({
  isMobile,
  phoneNumber,
  onParentClose,
  onSuccess,
}: UserInfoFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
  });

  const [messageState, setMessageState] = useState<{
    type: "success" | "error" | "validation" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  // Set phone number from props
  useEffect(() => {
    if (phoneNumber) {
      setFormData((prev) => ({ ...prev, phone: phoneNumber }));
    }
  }, [phoneNumber]);

  const validateName = (value: string) => {
    if (!value.trim()) {
      return "Name is required";
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

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateGender = (value: string) => {
    if (!value.trim()) {
      return "Gender is required";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
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

      if (name === "name") {
        setErrors((prev) => ({
          ...prev,
          name: validateName(value),
        }));
      } else if (name === "email") {
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value),
        }));
      }
    }
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));
    setErrors((prev) => ({
      ...prev,
      gender: validateGender(gender),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessageState({ type: null, text: "" });

    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const genderError = validateGender(formData.gender);

    setErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      birthday: "",
      gender: genderError,
    });

    if (nameError || phoneError || emailError || genderError) {
      setMessageState({
        type: "validation",
        text: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.birthday,
        gender: formData.gender as "Male" | "Female",
      };

      console.log("UserInfoForm: Starting registration with data:", userData);
      const result = await register(userData);
      console.log("UserInfoForm: Registration result:", result);

      if (result.type === "auth/registerUser/fulfilled") {
        // Registration successful, redirect to membership page
        console.log(
          "UserInfoForm: Registration successful, payload:",
          result.payload
        );
        setMessageState({
          type: "success",
          text: "Registration successful!",
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          birthday: "",
          gender: "",
        });
        setErrors({
          name: "",
          email: "",
          phone: "",
          birthday: "",
          gender: "",
        });

        // If onSuccess callback is provided, use it instead of redirecting
        if (onSuccess) {
          console.log("UserInfoForm: Calling onSuccess callback");
          setTimeout(() => {
            console.log("UserInfoForm: Executing onSuccess callback");
            onSuccess();
          }, 500);
        } else {
          // Default behavior: Close parent modal and redirect to membership page
          setTimeout(() => {
            onParentClose?.(); // Close the PhoneNumberModal
            window.location.href = "/membership";
          }, 500);
        }
      } else {
        setMessageState({
          type: "error",
          text:
            (result.payload as string) ||
            "Registration failed. Please try again.",
        });
      }
    } catch (error: unknown) {
      console.error("Error submitting user info form:", error);
      setMessageState({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Server Down, Please try again later.",
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
          <h2 className="text-2xl leading-7 md:text-[40px] font-semibold md:leading-[48px] tracking-[-1px] md:tracking-[-2px] mb-2 text-center">
            Tell us a bit about yourself
          </h2>
          <p className="text-xs leading-4 tracking-[-1%] md:text-base md:leading-5 text-[#8A8A8A] mb-7 md:mb-10 text-center">
            This will only take a minute and helps us create your perfect
            experience.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:gap-6 flex-1"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs md:text-sm text-white">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors ${
                    errors.name ? "border-red-500" : "border-[#333333]"
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs md:text-sm text-white"
                >
                  Email id *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email id"
                  className={`bg-[#FFFFFF] border rounded-lg py-1.5 md:py-2 px-4 text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:border-[2px] focus:border-[#00DBDC] outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-[#333333]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs md:text-sm text-white"
                  >
                    Phone number *
                  </label>
                  <div
                    className={`bg-[#F5F5F5] border rounded-lg flex items-center transition-colors overflow-hidden ${
                      errors.phone ? "border-red-500" : "border-[#333333]"
                    }`}
                  >
                    <span className="text-[#0D0D0D] px-4 py-1.5 md:py-2 font-medium flex-shrink-0">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      placeholder="Enter phone number"
                      className="bg-transparent flex-1 py-1.5 md:py-2 pr-4 text-[#666666] placeholder:text-[#8A8A8A] outline-none min-w-0 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="birthday"
                    className="text-xs md:text-sm text-white"
                  >
                    When&apos;s your birthday?
                  </label>
                  <div className="bg-[#FFFFFF] border border-[#333333] rounded-lg flex items-center transition-colors overflow-hidden focus-within:border-[2px] focus-within:border-[#00DBDC] relative">
                    <Image
                      src="/images/calendar-event.svg"
                      alt="Calendar"
                      width={20}
                      height={20}
                      className="ml-4 flex-shrink-0"
                    />
                    <input
                      id="birthday"
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="bg-transparent flex-1 py-1.5 md:py-2 px-4 text-[#0D0D0D] outline-none min-w-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs md:text-sm text-white">Gender</label>
                <div className="flex gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenderChange("male")}
                    className={`group pl-2 py-2 md:px-4 md:py-2 rounded-lg text-sm font-normal tracking-[0%] transition-all flex items-center justify-between duration-200 ${
                      formData.gender === "male"
                        ? "bg-[#00DBDC1A] text-[#00DBDC]"
                        : "bg-[#1D1D1D] text-[#8A8A8A] md:hover:bg-[#00DBDC1A] md:hover:text-[#00DBDC]"
                    }`}
                  >
                    <Image
                      src={
                        formData.gender === "male"
                          ? "/images/enabled-check-tick.svg"
                          : "/images/disabled-check-tick.svg"
                      }
                      alt="check"
                      width={16}
                      height={16}
                      className={`flex-shrink-0 transition-all duration-200 ${
                        formData.gender === "male" ? "" : "group-hover:hidden"
                      }`}
                    />
                    <Image
                      src="/images/enabled-check-tick.svg"
                      alt="check"
                      width={16}
                      height={16}
                      className={`flex-shrink-0 transition-all duration-200 ${
                        formData.gender === "male"
                          ? "hidden"
                          : "hidden group-hover:block"
                      }`}
                    />
                    <span className="text-left leading-tight flex-1 pl-[4px] whitespace-nowrap">
                      Male
                    </span>
                    <div className="flex-shrink-0 w-4"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderChange("female")}
                    className={`group pl-2 py-2 md:px-4 md:py-2 rounded-lg text-sm font-normal tracking-[0%] transition-all flex items-center justify-between duration-200 ${
                      formData.gender === "female"
                        ? "bg-[#00DBDC1A] text-[#00DBDC]"
                        : "bg-[#1D1D1D] text-[#8A8A8A] md:hover:bg-[#00DBDC1A] md:hover:text-[#00DBDC]"
                    }`}
                  >
                    <Image
                      src={
                        formData.gender === "female"
                          ? "/images/enabled-check-tick.svg"
                          : "/images/disabled-check-tick.svg"
                      }
                      alt="check"
                      width={16}
                      height={16}
                      className={`flex-shrink-0 transition-all duration-200 ${
                        formData.gender === "female" ? "" : "group-hover:hidden"
                      }`}
                    />
                    <Image
                      src="/images/enabled-check-tick.svg"
                      alt="check"
                      width={16}
                      height={16}
                      className={`flex-shrink-0 transition-all duration-200 ${
                        formData.gender === "female"
                          ? "hidden"
                          : "hidden group-hover:block"
                      }`}
                    />
                    <span className="text-left leading-tight flex-1 pl-[4px] whitespace-nowrap">
                      Female
                    </span>
                    <div className="flex-shrink-0 w-4"></div>
                  </button>
                </div>
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {messageState.type && (
              <div className="flex justify-center md:-mb-[24px]">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      messageState.type === "success"
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

export default UserInfoForm;
