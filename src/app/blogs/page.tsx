import { Metadata } from "next";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";
import BlogsPage from "@/components/BlogsPage";

export const metadata: Metadata = {
  title: "Blogs | Drive FITT Premium Club",
  description:
    "Read the latest fitness, cricket, and wellness blogs from Drive FITT experts. Stay updated with tips, training guides, and health insights.",
};

export default async function BlogsPageRoute() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return <BlogsPage isMobile={isMobile} />;
}
