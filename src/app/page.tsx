import { Metadata } from "next";
import { homeData } from "@/data/home";
import { StaticPageData } from "@/types/staticPages";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

const pageData: StaticPageData = homeData;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageData.seoTitle || pageData.title,
    description: pageData.seoDescription,
  };
}

export default function Home() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={homeData} pageName="home" isMobile={isMobile} />
    </main>
  );
}
