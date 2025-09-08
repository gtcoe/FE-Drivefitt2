import { Metadata } from "next";
import { licensesData } from "@/data/licenses";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: licensesData.seoTitle || licensesData.title,
    description: licensesData.seoDescription,
  };
}

export default function LicensesPage() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={licensesData} pageName="licenses" isMobile={isMobile} />
    </main>
  );
} 