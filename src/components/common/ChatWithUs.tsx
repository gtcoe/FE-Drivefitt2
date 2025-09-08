import { FooterInfoItem, SocialLinks } from "@/types/staticPages";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

interface ChatWithUsProps {
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLinks[];
  isMobile?: boolean;
}

const ChatWithUs = ({
  footerInfoList,
  socialLinkList,
  isMobile,
}: ChatWithUsProps) => {
  const getContactLink = (item: FooterInfoItem) => {
    if (item.title === "Call Us") {
      return `tel:${item.email.replace(/[^0-9+]/g, "")}`;
    }
    if (item.title === "Write To Us") {
      return `mailto:${item.email}`;
    }
    return undefined;
  };

  return (
    <div
      className="rounded-[20px] md:rounded-[40px] p-[2px] h-full"
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
    >
      <div className="rounded-[20px] md:rounded-[40px] w-full h-full p-8 md:p-12 flex flex-col bg-[#0D0D0D]">
        <div className="flex flex-col gap-6 md:gap-10">
          {footerInfoList.map((item, index) => {
            const contactLink = getContactLink(item);
            return (
              <ScrollAnimation
                key={index}
                delay={0.2 + index * 0.1}
                direction="left"
              >
                <div className="flex items-start gap-[14px] md:gap-8">
                  <div>
                    <div className="w-10 h-10 relative">
                      <div
                        className="absolute inset-0 rounded-full w-10 h-10"
                        style={{
                          boxShadow: "0px 7.2px 14.4px 0px #00DBDC33",
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-[#00DBDC] rounded-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={15}
                            height={15}
                            className="max-w-[15px] max-h-[15px] w-auto h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm leading-4 md:text-base md:leading-5 font-medium mb-2 md:mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm font-normal text-[#8A8A8A] mb-2 md:mb-3">
                      {item.description}
                    </p>
                    {contactLink ? (
                      <a
                        href={contactLink}
                        className={`text-sm tracking-[0px] leading-5 w-[110%] md:w-full font-normal ${
                          isMobile ? "" : "hover:text-[#00DBDC]"
                        } transition-colors`}
                      >
                        {item.email}
                      </a>
                    ) : (
                      <p className="text-sm tracking-[0px] leading-5 w-[110%] md:w-full font-normal">
                        {item.email}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        <ScrollAnimation
          delay={0.5}
          direction="left"
          className={`mt-6 md:mt-10`}
        >
          <div className="flex gap-6 pt-6 md:pt-10 border-t border-[#333333]">
            {socialLinkList.map((link) => (
              <a
                key={link.link}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isMobile ? "" : "hover:opacity-80"
                } transition-opacity`}
              >
                <Image src={link.image} alt="sociall" width={24} height={24} />
              </a>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default ChatWithUs;
