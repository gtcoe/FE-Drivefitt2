"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileDropdownProps {
  isMobile?: boolean;
}

export default function UserProfileDropdown({
  isMobile,
}: UserProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    console.log(
      "UserProfileDropdown: Profile button clicked, navigating to /profile"
    );
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMouseEnter = (item: string) => {
    setIsHovered(item);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
      >
        {/* Profile Icon */}
        <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-[#00DBDC] flex items-center justify-center">
          <Image
            src="/images/profile.svg"
            alt="Profile"
            width={isMobile ? 32 : 40}
            height={isMobile ? 32 : 40}
            className="w-8 h-8 md:w-10 md:h-10"
          />
        </div>

        {/* User Name (Desktop only) */}
        {!isMobile && (
          <span className="text-white font-normal text-base leading-5 tracking-[-0.04em]">
            {user.name}
          </span>
        )}

        {/* Dropdown Arrow */}
        <Image
          src="/images/down-arrow.svg"
          alt="Dropdown"
          width={isMobile ? 16 : 20}
          height={isMobile ? 16 : 20}
          className={`transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-[220px] h-[112px] bg-[#1A1A1A] border-2 border-[#333333] rounded-2xl overflow-hidden z-50">
          {/* Your Profile Option */}
          <button
            onClick={handleProfileClick}
            onMouseEnter={() => handleMouseEnter("profile")}
            onMouseLeave={handleMouseLeave}
            className="w-full h-[56px] flex items-center gap-4 px-6 py-4 hover:bg-[#333333] transition-colors duration-200"
          >
            <Image
              src={
                isHovered === "profile"
                  ? "/images/user-profile-circle-hover.svg"
                  : "/images/user-profile-circle.svg"
              }
              alt="Profile"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                isHovered === "profile" ? "text-[#00DBDC]" : "text-white"
              }`}
            >
              Your Profile
            </span>
          </button>

          {/* Sign Out Option */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => handleMouseEnter("logout")}
            onMouseLeave={handleMouseLeave}
            className="w-full h-[56px] flex items-center gap-4 px-6 py-4 hover:bg-[#333333] transition-colors duration-200"
          >
            <Image
              src={
                isHovered === "logout"
                  ? "/images/log-out-hover.svg"
                  : "/images/log-out.svg"
              }
              alt="Sign Out"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                isHovered === "logout" ? "text-[#00DBDC]" : "text-white"
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
