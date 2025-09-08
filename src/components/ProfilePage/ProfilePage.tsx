import Navbar from "@/components/common/Navbar";
import { navbarData } from "@/data/navbar";
import { ProfilePageData } from "@/types/staticPages";

import FooterInfo from "@/components/common/FooterInfo";
import Footer from "@/components/common/Footer";
import ProfileBody from "./ProfileBody";

interface ProfilePageProps {
  data: ProfilePageData;
  pageName: string;
  isMobile?: boolean;
}

const ProfilePage = ({ data, isMobile }: ProfilePageProps) => {
  return (
    <div className="bg-[#0D0D0D] w-full">
      <Navbar data={navbarData} isMobile={isMobile} />
      <ProfileBody data={data} isMobile={isMobile} />
      {data.footerInfoSection && (
        <FooterInfo data={data.footerInfoSection} isMobile={isMobile} />
      )}
      {data.footerSection && (
        <Footer data={data.footerSection} isMobile={isMobile} />
      )}
    </div>
  );
};

export default ProfilePage;
