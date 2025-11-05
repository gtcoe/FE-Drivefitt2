import { Metadata } from "next";
import { careersData } from "@/data/careers";
import StaticPages from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: careersData.seoTitle || careersData.title,
    description: careersData.seoDescription,
  };
}

export default function CareersPage() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={careersData} pageName="about-us" isMobile={isMobile} />
    </main>
  );
}
