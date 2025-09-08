import { Metadata } from "next";
import { contactUsData } from "@/data/contactUs";
import { ContactUsPageData } from "@/types/staticPages";
import ContactUsPage from "@/components/ContactUsPage";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

const pageData: ContactUsPageData = contactUsData;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageData.seoTitle || pageData.title,
    description: pageData.seoDescription,
  };
}

export default function ContactUs() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <ContactUsPage
        data={contactUsData}
        pageName="contact-us"
        isMobile={isMobile}
      />
    </main>
  );
}
