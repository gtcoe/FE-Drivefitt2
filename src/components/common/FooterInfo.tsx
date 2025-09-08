import { FooterInfoProps } from "@/types/staticPages";
import ChatWithUs from "@/components/common/ChatWithUs";
import ContactForm from "@/components/common/ContactForm";

const FooterInfo = ({
  data,
  isMobile,
}: {
  data: FooterInfoProps;
  isMobile?: boolean;
}) => {
  const { footerInfoList, socialLinkList, contactFormSection } = data;

  return (
    <div
      className="flex flex-col md:flex-row gap-6 md:gap-10 px-6 md:px-[120px] md:mb-[-40px] md:pt-[140px] w-full"
      style={{
        background: `${
          isMobile
            ? "#0D0D0D"
            : "linear-gradient(180deg, #1D1D1D 0%, #0D0D0D 100%)"
        }`,
      }}
    >
      <div className="w-full md:w-2/5 flex">
        <ChatWithUs
          footerInfoList={footerInfoList}
          socialLinkList={socialLinkList}
        />
      </div>
      <div className="w-full md:w-3/5 flex">
        <ContactForm data={contactFormSection} />
      </div>
    </div>
  );
};

export default FooterInfo;
