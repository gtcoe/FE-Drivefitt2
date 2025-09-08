import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "/coming-soon"],
    },
    sitemap: "https://drivefitt.club/sitemap.xml",
  };
}
