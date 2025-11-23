"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FeaturedBlog from "./FeaturedBlog";
import BlogCategorySection from "./BlogCategorySection";
import SocialLinksSection from "./SocialLinksSection";
import { blogAPI } from "@/services/blogAPI";
import { blogCategoryAPI } from "@/services/blogCategoryAPI";
import { BlogEntry, BlogCategory } from "@/types/adminPortal";
import { LoginModalType } from "@/types/staticPages";

interface BlogsPageProps {
  isMobile: boolean;
}

interface BlogWithCategory extends BlogEntry {
  categoryHeading?: string;
}

interface CategoryWithBlogs {
  category: BlogCategory;
  blogs: BlogWithCategory[];
}

const navbarData = {
  logo: "https://da8nru77lsio9.cloudfront.net/images/logo.svg",
  navLinks: [
    { title: "Home", href: "/" },
    { title: "Cricket", href: "/cricket" },
    { title: "Fitness", href: "/fitness" },
    { title: "Recovery", href: "/recovery" },
    { title: "Running", href: "/running" },
    { title: "Personal Training", href: "/personal-training" },
    { title: "Membership", href: "/membership" },
  ],
  signInButton: {
    text: "Sign In",
  },
  loginModalType: LoginModalType.PHONE,
};

const footerData = {
  logo: "https://da8nru77lsio9.cloudfront.net/images/logo.svg",
  description:
    "Experience Gurugram's Premier Fitness & Sports Club - Gym, Cricket, Recovery & more.",
  sections: [
    {
      title: "Quick links",
      links: [
        { title: "About us", link: "/about-us" },
        { title: "Our services", link: "/services" },
        { title: "Blogs", link: "/blogs" },
        { title: "Career", link: "/careers" },
        { title: "Partner with us", link: "/franchise" },
      ],
    },
    {
      title: "Services",
      links: [
        { title: "Cricket", link: "/cricket" },
        { title: "Fitness", link: "/fitness" },
        { title: "Recovery", link: "/recovery" },
        { title: "Running", link: "/running" },
        { title: "Group Classes", link: "/group-classes" },
        { title: "Pilates", link: "/pilates" },
        { title: "Personal Training", link: "/personal-training" },
      ],
    },
    {
      title: "Support",
      links: [
        { title: "Account", link: "/account" },
        { title: "Help", link: "/help" },
        { title: "Contact us", link: "/contact-us" },
        { title: "Customer Support", link: "/support" },
      ],
    },
    {
      title: "Legals",
      links: [
        { title: "Terms & Conditions", link: "/terms" },
        { title: "Privacy & Policy", link: "/privacy" },
        { title: "Licenses", link: "/licenses" },
      ],
    },
  ],
  socialLinks: [
    {
      image: "https://da8nru77lsio9.cloudfront.net/images/x-social.svg",
      link: "https://x.com/Drive_Fitt",
    },
    {
      image: "https://da8nru77lsio9.cloudfront.net/images/instagram-social.svg",
      link: "https://www.instagram.com/drive_fitt/",
    },
    {
      image: "https://da8nru77lsio9.cloudfront.net/images/linkedin-social.svg",
      link: "https://www.linkedin.com/company/drivefitt/",
    },
    {
      image: "https://da8nru77lsio9.cloudfront.net/images/facebook-social.svg",
      link: "https://www.facebook.com/profile.php?id=61561476262978",
    },
  ],
  copyright: "©2025 Drivefitt. All rights reserved.",
};

const BlogsPage = ({ isMobile }: BlogsPageProps) => {
  const [featuredBlog, setFeaturedBlog] = useState<BlogWithCategory | null>(
    null
  );
  const [categoriesWithBlogs, setCategoriesWithBlogs] = useState<
    CategoryWithBlogs[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsData = async () => {
      try {
        const [blogs, categories] = await Promise.all([
          blogAPI.list(),
          blogCategoryAPI.list(),
        ]);

        // Find featured blog (assuming first published blog or one marked as featured)
        const featured =
          blogs.find((blog: any) => blog.is_featured) || blogs[0];
        if (featured) {
          const featuredCategory = categories.find(
            (cat: BlogCategory) => cat.id === featured.categoryId
          );
          setFeaturedBlog({
            ...featured,
            categoryHeading: featuredCategory?.heading,
          });
        }

        // Group blogs by category
        const categorizedBlogs: CategoryWithBlogs[] = [];

        categories.forEach((category: BlogCategory) => {
          const categoryBlogs = blogs
            .filter((blog: any) => blog.categoryId === category.id)
            .map((blog: any) => ({
              ...blog,
              categoryHeading: category.heading,
            }));

          if (categoryBlogs.length > 0) {
            categorizedBlogs.push({
              category,
              blogs: categoryBlogs,
            });
          }
        });

        // Add uncategorized blogs if any
        const uncategorizedBlogs = blogs
          .filter((blog: any) => !blog.categoryId || blog.categoryId === 0)
          .map((blog: any) => ({
            ...blog,
            categoryHeading: "Trending topics",
          }));

        if (uncategorizedBlogs.length > 0) {
          categorizedBlogs.unshift({
            category: { id: 0, heading: "Trending topics", status: "active" },
            blogs: uncategorizedBlogs,
          });
        }

        setCategoriesWithBlogs(categorizedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar data={navbarData} isMobile={isMobile} />

      {featuredBlog && <FeaturedBlog blog={featuredBlog} isMobile={isMobile} />}

      <div className={`${isMobile ? "mt-6" : "mt-20"}`}>
        {categoriesWithBlogs.map((categoryData, index) => (
          <BlogCategorySection
            key={categoryData.category.id}
            category={categoryData.category}
            blogs={categoryData.blogs}
            isMobile={isMobile}
            isFirst={index === 0}
          />
        ))}
      </div>

      <SocialLinksSection
        isMobile={isMobile}
        socialLinks={footerData.socialLinks}
      />

      <Footer data={footerData} isMobile={isMobile} />
    </div>
  );
};

export default BlogsPage;
