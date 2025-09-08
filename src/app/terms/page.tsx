import { Metadata } from "next";
import { termsData } from "@/data/terms";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: termsData.seoTitle || termsData.title,
    description: termsData.seoDescription,
  };
}

export default function TermsPage() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={termsData} pageName="terms" isMobile={isMobile} />
    </main>
  );
} 