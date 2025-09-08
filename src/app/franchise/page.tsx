import { Metadata } from "next";
import { franchiseData } from "@/data/franchise";
import FranchisePage from "@/components/FranchisePage";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: franchiseData.seoTitle || franchiseData.title,
    description: franchiseData.seoDescription,
  };
}

export default function Franchise() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <FranchisePage
        data={franchiseData}
        pageName="franchise"
        isMobile={isMobile}
      />
    </main>
  );
}
