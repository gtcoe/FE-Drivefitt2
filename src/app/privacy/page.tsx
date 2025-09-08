import { Metadata } from "next";
import { privacyData } from "@/data/privacy";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: privacyData.seoTitle || privacyData.title,
    description: privacyData.seoDescription,
  };
}

export default function PrivacyPage() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={privacyData} pageName="privacy" isMobile={isMobile} />
    </main>
  );
} 