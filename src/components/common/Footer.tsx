import Image from "next/image";
import Link from "next/link";
import { FooterProps } from "@/types/staticPages";

const Footer = ({
  data,
  isMobile,
}: {
  data: FooterProps;
  isMobile?: boolean;
}) => {
  const { logo, description, sections, socialLinks, copyright } = data;

  const renderCopyright = (text: string, className: string) => {
    if (text.includes("TechKatalyst")) {
      const parts = text.split("TechKatalyst");
      return (
        <p className={className}>
          {parts[0]}
          <Link
            href="http://techkatalyst.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[#00DBDC] ${
              isMobile ? "" : "hover:text-[#00c5c6]"
            } transition-colors underline`}
          >
            TechKatalyst
          </Link>
          {parts[1]}
        </p>
      );
    }
    return <p className={className}>{text}</p>;
  };

  return (
    <footer className="bg-[#1A1A1A] text-white w-full">
      <div className="w-full px-6 md:px-[120px] md:pt-[60px] md:pb-[47px] pb-6 pt-12">
        <div className="flex md:flex-row flex-col md:gap-[106px] gap-12">
          <div className="w-full md:w-[290px] h-auto">
            <Image
              src={logo}
              alt="DriveFITT"
              width={212}
              height={36}
              className="md:w-[212px] md:h-9 w-[188px] h-8 mb-6 md:mb-[26px]"
            />
            <p className="text-[#FFFFFF] md:text-[#EAECF0] max-w-md text-base tracking-[0%] font-normal md:text-base md:leading-5">
              {description}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:mb-10 mb-8 w-full">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-base font-normal leading-5 mb-4 text-[#9A9A9A]">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.link}
                        className={`text-white ${
                          isMobile ? "" : "hover:text-[#00DBDC]"
                        } cursor-pointer text-base leading-6 md:leading-10 font-medium tracking-[0%] md:tracking-[-2%] transition-colors`}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:pt-[41px] pt-6 border-t border-[#333333]">
          {isMobile
            ? null
            : renderCopyright(copyright, "text-[#8A8A8A] mb-0 md:text-base")}
          <div className="flex space-x-6 md:space-x-8 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.link}
                target="_blank"
                className={`${
                  isMobile ? "" : "hover:opacity-80"
                } transition-opacity`}
              >
                <Image
                  src={social.image}
                  alt="social"
                  width={24}
                  height={24}
                  className="size-5 md:size-6"
                />
              </Link>
            ))}
          </div>
          {isMobile
            ? renderCopyright(copyright, "text-[#8A8A8A] mb-4 text-xs")
            : null}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
