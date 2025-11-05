"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BlogBanner from "./BlogBanner";
import BlogContent from "./BlogContent";
import SocialShare from "./SocialShare";
import MoreForYou from "./MoreForYou";
import YouMightAlsoLike from "./YouMightAlsoLike";
import { BlogEntry } from "@/types/adminPortal";
import { LoginModalType } from "@/types/staticPages";

interface BlogDetailProps {
  blog: any; // Raw blog data from API
  isMobile: boolean;
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
    "Experience Gurugram's Premier Sports Club - Cricket, Fitness, Recovery & more.",
  sections: [
    {
      title: "Quick Links",
      links: [
        {
          title: "About Us",
          link: "/about-us",
        },
        {
          title: "Blogs",
          link: "/coming-soon",
        },
        {
          title: "Career",
          link: "/coming-soon",
        },
        {
          title: "Partner With Us",
          link: "/franchise",
        },
      ],
    },
    {
      title: "Services",
      links: [
        {
          title: "Cricket",
          link: "/cricket",
        },
        {
          title: "Fitness",
          link: "/fitness",
        },
        {
          title: "Recovery",
          link: "/recovery",
        },
        {
          title: "Running",
          link: "/running",
        },
        {
          title: "Group Classes",
          link: "/group-classes",
        },
        {
          title: "Pilates",
          link: "/pilates",
        },
        {
          title: "Personal Training",
          link: "/personal-training",
        },
      ],
    },
    {
      title: "Support",
      links: [
        {
          title: "Account",
          link: "/coming-soon",
        },
        {
          title: "Help",
          link: "/coming-soon",
        },
        {
          title: "Contact Us",
          link: "/contact-us",
        },
      ],
    },
    {
      title: "Legals",
      links: [
        {
          title: "Terms & Conditions",
          link: "/terms",
        },
        {
          title: "Privacy & Policy",
          link: "/privacy",
        },
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
  copyright:
    "© 2025 Drive FITT by 24-7 Cricket Group India Private Limited. All rights reserved.",
};

const BlogDetailContent = ({ blog: rawBlog, isMobile }: BlogDetailProps) => {
  const [relatedBlogs, setRelatedBlogs] = useState<BlogEntry[]>([]);
  const [otherBlogs, setOtherBlogs] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform raw blog data to BlogEntry format
  const blog: BlogEntry = {
    id: rawBlog.id,
    title: rawBlog.title,
    description: rawBlog.description,
    slug: rawBlog.slug,
    date: rawBlog.date,
    image: rawBlog.image,
    content: rawBlog.html,
    categoryId: rawBlog.category_id,
    categoryHeading: rawBlog.category_heading,
    status: rawBlog.status,
    isFeatured: rawBlog.is_featured === 1,
    created: rawBlog.created_at,
    edited: rawBlog.updated_at,
  };

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);

        // Fetch related blogs from same category
        if (blog.categoryId && blog.categoryId > 0) {
          const relatedResponse = await fetch(
            `/api/blogs/related/${blog.categoryId}?exclude=${blog.id}&limit=5`
          );
          if (relatedResponse.ok) {
            const { data } = await relatedResponse.json();
            const transformedRelated = data.map((b: any) => ({
              id: b.id,
              title: b.title,
              description: b.description,
              slug: b.slug,
              date: b.date,
              image: b.image,
              content: b.html,
              categoryId: b.category_id,
              categoryHeading: b.category_heading,
              status: b.status,
              isFeatured: b.is_featured === 1,
              created: b.created_at,
              edited: b.updated_at,
            }));
            setRelatedBlogs(transformedRelated);
          }
        }

        // Fetch blogs from other categories
        const otherResponse = await fetch(
          `/api/blogs/other-categories/${blog.categoryId || 0}?exclude=${
            blog.id
          }&limit=6`
        );
        if (otherResponse.ok) {
          const { data } = await otherResponse.json();
          const transformedOther = data.map((b: any) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            slug: b.slug,
            date: b.date,
            image: b.image,
            content: b.html,
            categoryId: b.category_id,
            categoryHeading: b.category_heading,
            status: b.status,
            isFeatured: b.is_featured === 1,
            created: b.created_at,
            edited: b.updated_at,
          }));
          setOtherBlogs(transformedOther);
        }
      } catch (error) {
        console.error("Failed to fetch related blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog.id, blog.categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar data={navbarData} isMobile={isMobile} />

      <BlogBanner blog={blog} isMobile={isMobile} />

      {isMobile ? (
        // Mobile Layout
        <>
          <BlogContent blog={blog} isMobile={isMobile} />
          <SocialShare isMobile={isMobile} />
          <YouMightAlsoLike blogs={otherBlogs} isMobile={isMobile} />
        </>
      ) : (
        // Desktop Layout
        <>
          <div className="px-[120px] mt-[68px] flex gap-[60px]">
            {/* Left Section (70%) */}
            <div className="flex-[7]">
              <BlogContent blog={blog} isMobile={isMobile} />
              <div className="pb-20">
                <SocialShare isMobile={isMobile} />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-[#333333] flex-shrink-0 mb-20"></div>

            {/* Right Section (30%) */}
            <div className="flex-[3]">
              <MoreForYou
                blogs={relatedBlogs}
                categoryHeading={blog.categoryHeading}
                isMobile={isMobile}
              />
            </div>
          </div>

          <YouMightAlsoLike blogs={otherBlogs} isMobile={isMobile} />
        </>
      )}

      <Footer data={footerData} isMobile={isMobile} />
    </div>
  );
};

export default BlogDetailContent;
