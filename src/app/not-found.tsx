import { Metadata } from "next";
import { error404Data } from "@/data/error404";
import { StaticPageData } from "@/types/staticPages";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

const pageData: StaticPageData = error404Data;

export const metadata: Metadata = {
  title: pageData.seoTitle || pageData.title,
  description: pageData.seoDescription,
};

export default function NotFound() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={error404Data} pageName="error-404" isMobile={isMobile} />
    </main>
  );
} 