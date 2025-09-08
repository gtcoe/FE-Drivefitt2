import { Metadata } from "next";
import { plansData } from "@/data/plans";
import StaticPage from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export const metadata: Metadata = {
  title: plansData.seoTitle,
  description: plansData.seoDescription,
};

export default function MembershipPage() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPage data={plansData} pageName="membership" isMobile={isMobile} />
    </main>
  );
}
