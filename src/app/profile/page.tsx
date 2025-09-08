import { Metadata } from "next";
import { profileData } from "@/data/profile";
import { ProfilePageData } from "@/types/staticPages";
import ProfilePageWrapper from "@/components/ProfilePage/ProfilePageWrapper";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";

const pageData: ProfilePageData = profileData;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageData.seoTitle || pageData.title,
    description: pageData.seoDescription,
  };
}

export default function Profile() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <ProfilePageWrapper
        data={profileData}
        pageName="profile"
        isMobile={isMobile}
      />
    </main>
  );
}
