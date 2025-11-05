"use client";

import Image from "next/image";
import { BlogEntry } from "@/types/adminPortal";

interface BlogBannerProps {
  blog: BlogEntry;
  isMobile: boolean;
}

const BlogBanner = ({ blog, isMobile }: BlogBannerProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.split("/").reverse().join("-")); // Convert DD/MM/YYYY to YYYY-MM-DD
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Estimate reading time (assuming 200 words per minute)
  const estimateReadingTime = (text: string) => {
    const cleanText = text.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const words = cleanText.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const formattedDate = formatDate(blog.date);
  const readingTime = estimateReadingTime(blog.content || blog.description);

  return (
    <div className="relative w-full">
      {/* Blog Image */}
      <div
        className={`relative ${
          isMobile ? "h-[300px]" : "h-[500px]"
        } w-full overflow-hidden`}
      >
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,13,13,0.8)] to-transparent" />

        {/* Text Content */}
        <div
          className={`absolute bottom-0 left-0 right-0 text-white ${
            isMobile ? "px-6 pb-6 gap-4" : "px-[120px] pb-10 gap-7"
          } flex flex-col`}
        >
          {/* Title */}
          <h1
            className={`font-bold text-white ${
              isMobile
                ? "text-[28px] leading-[32px] tracking-[0px] capitalize"
                : "text-[68px] leading-[78px] tracking-[-2px]"
            }`}
          >
            {blog.title}
          </h1>

          {/* Date and Reading Time */}
          <p
            className={`font-normal text-white ${
              isMobile
                ? "text-[14px] leading-[20px] tracking-[0%]"
                : "text-[16px] leading-[20px] tracking-[0%]"
            }`}
          >
            {formattedDate} · {readingTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;
