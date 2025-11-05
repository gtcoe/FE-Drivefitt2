"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogEntry } from "@/types/adminPortal";

interface BlogCardProps {
  blog: BlogEntry;
  isMobile: boolean;
}

const BlogCard = ({ blog, isMobile }: BlogCardProps) => {
  // Format date to "Apr 15, 2020" format
  const formatDate = (dateStr: string) => {
    try {
      // Handle DD/MM/YYYY format
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      // Fallback for other formats
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Estimate reading time (assuming 200 words per minute)
  const estimateReadingTime = (text: string) => {
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const formattedDate = formatDate(blog.date);
  const readingTime = estimateReadingTime(blog.description);

  if (isMobile) {
    // Mobile: Horizontal card layout
    return (
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="flex gap-4 pb-4 border-b border-[#333333] last:border-b-0">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative w-[120px] h-[72px] rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-white font-medium text-[14px] leading-[20px] tracking-[0%] mb-2 line-clamp-2">
              {blog.title}
            </h3>

            {/* Date and Reading Time */}
            <div className="text-[#8A8A8A] font-medium text-[14px] leading-[20px] tracking-[0%]">
              {formattedDate} · {readingTime}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Desktop: Vertical card layout
  return (
    <Link href={`/blogs/${blog.slug}`} className="block group">
      <div className="w-full">
        {/* Image */}
        <div className="relative w-full h-[216px] rounded-[20px] overflow-hidden mb-4">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div>
          {/* Title */}
          <h3 className="text-white font-semibold text-[20px] leading-[28px] tracking-[0%] mb-4 line-clamp-2">
            {blog.title}
          </h3>

          {/* Date and Reading Time */}
          <div className="text-[#8A8A8A] font-normal text-[14px] leading-[20px] tracking-[0%]">
            {formattedDate} · {readingTime}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
