"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LeftSidebarProps } from "@/types/adminPortal";

const LeftSidebar = ({
  selectedOption,
  onOptionSelect,
  navItems,
}: LeftSidebarProps) => {
  const pathname = usePathname();
  const getIconForOption = (optionId: string) => {
    switch (optionId) {
      case "dashboard":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 2H3C2.44772 2 2 2.44772 2 3V8C2 8.55228 2.44772 9 3 9H8C8.55228 9 9 8.55228 9 8V3C9 2.44772 8.55228 2 8 2Z"
              fill="currentColor"
            />
            <path
              d="M17 2H12C11.4477 2 11 2.44772 11 3V8C11 8.55228 11.4477 9 12 9H17C17.5523 9 18 8.55228 18 8V3C18 2.44772 17.5523 2 17 2Z"
              fill="currentColor"
            />
            <path
              d="M8 11H3C2.44772 11 2 11.4477 2 12V17C2 17.5523 2.44772 18 3 18H8C8.55228 18 9 17.5523 9 17V12C9 11.4477 8.55228 11 8 11Z"
              fill="currentColor"
            />
            <path
              d="M17 11H12C11.4477 11 11 11.4477 11 12V17C11 17.5523 11.4477 18 12 18H17C17.5523 18 18 17.5523 18 17V12C18 11.4477 17.5523 11 17 11Z"
              fill="currentColor"
            />
          </svg>
        );
      case "blogs":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V4Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M6 7H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 10H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 13H10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "career-management":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L9 5L11 5L10 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 5L6 16L10 20L14 16L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      case "web-analytics":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 3V17H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M7 12L10 9L13 12L17 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      case "form-submission":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M7 6H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 10H11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 13L15 10L17 12L14 15L12 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      case "users":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 9C12.2091 9 14 7.20914 14 5C14 2.79086 12.2091 1 10 1C7.79086 1 6 2.79086 6 5C6 7.20914 7.79086 9 10 9Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M3 20C3 16.134 6.13401 13 10 13C13.866 13 17 16.134 17 20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "payments":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M1 5C1 4.44772 1.44772 4 2 4H18C18.5523 4 19 4.44772 19 5V15C19 15.5523 18.5523 16 18 16H2C1.44772 16 1 15.5523 1 15V5Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M1 8H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 12H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 12H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-10 top-10 w-[220px] h-[calc(100vh-80px)] bg-[#1D1D1D] rounded-2xl">
      {/* Logo */}
      <div className="mt-6 mb-8 mx-10 flex justify-center">
        <Image
          src="https://da8nru77lsio9.cloudfront.net/images/logo.svg"
          alt="Drive FITT Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Navigation Items */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const isSelected = selectedOption === item.id;
          const isFormSubmission = item.id === "form-submission";
          const isFormSubmissionSubPage =
            pathname.includes("/form-submission/");
          const showSubItems =
            isFormSubmission && (isSelected || isFormSubmissionSubPage);

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => onOptionSelect?.(item.id)}
                className={`w-full h-[52px] px-6 py-4 flex items-center gap-4 transition-all duration-200 rounded-lg ${
                  isSelected ? "bg-[#00DBDC]" : "hover:bg-[#333333]"
                }`}
              >
                <div
                  className={`${
                    isSelected ? "text-[#0D0D0D]" : "text-[#BFBFBF]"
                  }`}
                >
                  {getIconForOption(item.id)}
                </div>
                <span
                  className={`font-medium text-sm leading-5 tracking-[0%] ${
                    isSelected ? "text-[#0D0D0D]" : "text-[#BFBFBF]"
                  }`}
                >
                  {item.label}
                </span>
              </button>

              {/* Sub Items */}
              {showSubItems && item.subItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubSelected = pathname === subItem.path;
                    return (
                      <button
                        key={subItem.id}
                        type="button"
                        onClick={() => onOptionSelect?.(subItem.id)}
                        className={`w-full h-[40px] px-4 py-2 flex items-center gap-3 transition-all duration-200 rounded-lg ${
                          isSubSelected
                            ? "bg-[#333333] text-[#00DBDC]"
                            : "text-[#BFBFBF] hover:bg-[#333333] hover:text-white"
                        }`}
                      >
                        <span
                          className={`text-sm leading-5 ${
                            isSubSelected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {subItem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
