"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavbarProps, LoginModalType } from "@/types/staticPages";
import { PhoneNumberModal, EmailModal } from "./Modal";
import UserProfileDropdown from "./UserProfileDropdown";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  data: NavbarProps;
  isMobile?: boolean;
}

export default function Navbar({ data, isMobile }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { logo, navLinks, loginModalType } = data;
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  // Debug: Log authentication state changes
  useEffect(() => {
    console.log("Navbar: isAuthenticated changed to:", isAuthenticated);
    console.log("Navbar: Current user:", user);
    console.log(
      "Navbar: Session storage - token:",
      !!sessionStorage.getItem("auth_token")
    );
    console.log(
      "Navbar: Session storage - userData:",
      !!sessionStorage.getItem("user_data")
    );
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href;
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <nav
          className={`sticky top-0 z-50 flex justify-between items-center py-5 px-6 md:py-6 md:px-4 w-full transition-all duration-300 ${
            isScrolled ? "bg-[#0D0D0D]/95 backdrop-blur-sm" : "bg-transparent"
          }`}
        >
          <button
            className="relative z-20"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <Image
              src="https://da8nru77lsio9.cloudfront.net/images/hamburger.svg"
              alt="menu"
              width={24}
              height={24}
            />
          </button>
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              width={141}
              height={24}
              className="ml-[25px]"
            />
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <UserProfileDropdown isMobile={isMobile} />
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#00DBDC] border border-transparent rounded-[4px] md:rounded-lg px-3 md:px-6 py-2 text-[#0D0D0D] font-medium text-xs md:text-sm transition-all duration-200"
              >
                Sign in
              </button>
            )}
          </div>

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
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-[#0D0D0D]/95 backdrop-blur-sm z-[9999] transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            className={`fixed inset-0 bg-[#1A1A1A] transform transition-transform duration-300 ease-in-out flex flex-col ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center py-5 px-6 border-b border-[#333333] flex-shrink-0">
              <Link href="/" onClick={handleLinkClick}>
                <Image src={logo} alt="logo" width={141} height={24} />
              </Link>
              <button
                onClick={handleMenuToggle}
                className="p-2 hover:bg-[#333333] rounded-lg transition-colors duration-200"
                aria-label="Close menu"
              >
                <Image
                  src="https://da8nru77lsio9.cloudfront.net/images/otp-modal-close-icon.svg"
                  alt="close"
                  width={32}
                  height={32}
                />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Navigation Links */}
              <div className="flex flex-col py-8 px-6 space-y-2">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                      isActiveLink(link.href)
                        ? "text-[#00DBDC] bg-[#00DBDC]/10 border-l-4 border-[#00DBDC]"
                        : "text-white hover:text-[#00DBDC] hover:bg-[#333333]/50"
                    }`}
                    onClick={handleLinkClick}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>

              {/* User Actions in Menu */}
              <div className="px-6 mt-2 pb-8">
                {isAuthenticated ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        console.log(
                          "Navbar: Profile button clicked, navigating to /profile"
                        );
                        setIsMenuOpen(false);
                        router.push("/profile");
                      }}
                      className="flex-1 bg-[#00DBDC] border border-transparent rounded-lg py-3 text-[#0D0D0D] font-medium text-sm transition-all duration-200"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={async () => {
                        setIsMenuOpen(false);
                        try {
                          await logout();
                          router.push("/");
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      className="flex-1 bg-transparent border border-[#00DBDC] rounded-lg py-3 text-[#00DBDC] font-medium text-sm transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-[#00DBDC] border border-transparent rounded-lg py-4 text-[#0D0D0D] font-medium text-lg transition-all duration-200"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop view - filter out Home link
  const desktopNavLinks = navLinks.filter((link) => link.title !== "Home");

  return (
    <nav
      className={`sticky top-0 z-50 flex justify-between items-center py-8 pr-[100px] pl-[120px] gap-4 transition-all duration-300 ${
        isScrolled ? "bg-[#0D0D0D]/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <Link href="/">
        <Image src={logo} alt="logo" width={212} height={36} />
      </Link>
      <div className="flex gap-10 px-2">
        {desktopNavLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className={`transition-colors ${
              isActiveLink(link.href)
                ? "text-[#00DBDC]"
                : "text-white hover:text-[#00DBDC]"
            }`}
          >
            {link.title}
          </Link>
        ))}
      </div>
      {isAuthenticated ? (
        <UserProfileDropdown isMobile={isMobile} />
      ) : (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-[#00DBDC] border border-transparent rounded-lg px-10 md:px-[48px] md:h-[50px] text-[#0D0D0D] font-medium text-base hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200"
        >
          Sign in
        </button>
      )}

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
    </nav>
  );
}
