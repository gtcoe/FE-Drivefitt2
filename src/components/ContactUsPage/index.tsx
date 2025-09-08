import Navbar from "@/components/common/Navbar";
import { navbarData } from "@/data/navbar";
import {
  ContactUsPageData,
  Hero,
  AppDownloadProps,
  ContactUsFooterInfoProps,
  FooterProps,
} from "@/types/staticPages";
import AppDownload from "@/components/common/AppDownload";
import Footer from "@/components/common/Footer";
import ChatWithUs from "@/components/common/ChatWithUs";
import ContactUsContactForm from "@/components/ContactUsPage/ContactUsContactForm";

interface StaticPageProps {
  data: ContactUsPageData;
  pageName: string;
  isMobile?: boolean;
}

const ContactUsPage = ({ data, isMobile }: StaticPageProps) => {
  const { hero, appDownloadSection, footerInfoSection, footerSection } = data;
  const { titleWords, description, mobileImage, desktopImage } = hero as Hero;
  const { footerInfoList, socialLinkList, contactFormSection } =
    footerInfoSection as ContactUsFooterInfoProps;

  return (
    <div className="bg-[#0D0D0D] flex flex-col w-full relative">
      <Navbar data={navbarData} isMobile={isMobile} />
      <div
        className="w-full bg-center bg-no-repeat h-auto -mt-[109px] md:-mt-[108px]"
        style={{
          background: `url(${isMobile ? mobileImage : desktopImage})`,
          backgroundPosition: "top center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="pt-[109px] md:pt-[108px]">
          <div className="flex flex-col gap-3 md:gap-[18px] ">
            <h1 className="md:px-[120px] px-6 text-[40px] md:text-[68px] text-center md:text-left font-bold text-white tracking-[-2px] leading-[44px] md:leading-[72px]">
              {titleWords.map((word, index) => (
                <span
                  key={index}
                  style={{ color: word.color }}
                  className={word.isItalic ? "italic" : ""}
                >
                  {word.text}
                </span>
              ))}
            </h1>
            <p className="md:px-[120px] px-6 text-sm leading-5 md:text-xl text-center md:text-left tracking-[2%] text-white font-light mb-5 md:mb-[45px]">
              {description}
            </p>
            <div className="flex flex-col md:gap-[120px] gap-[40px]">
              <div className="md:px-[120px] mb-5 md:mb-0 px-6 flex flex-col md:flex-row gap-4 md:gap-10 justify-start md:justify-between h-fit w-full">
                <div className="w-full md:w-2/5 max-h-full order-2 md:order-1">
                  <ChatWithUs
                    footerInfoList={footerInfoList}
                    socialLinkList={socialLinkList}
                    isMobile={isMobile}
                  />
                </div>
                <div className="w-full md:w-3/5 h-full order-1 md:order-2">
                  <ContactUsContactForm
                    data={contactFormSection}
                    isMobile={isMobile}
                  />
                </div>
              </div>
              <AppDownload data={appDownloadSection as AppDownloadProps} />
              <Footer data={footerSection as FooterProps} isMobile={isMobile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
