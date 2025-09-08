import { Metadata } from "next";
import { comingSoonData } from "@/data/comingSoon";
import { StaticPageData } from "@/types/staticPages";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

const pageData: StaticPageData = comingSoonData;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageData.seoTitle || pageData.title,
    description: pageData.seoDescription,
  };
}

export default function ComingSoon() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={comingSoonData} pageName="coming-soon" isMobile={isMobile} />
    </main>
  );
} 