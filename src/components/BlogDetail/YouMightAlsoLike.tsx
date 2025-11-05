"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogEntry } from "@/types/adminPortal";

interface YouMightAlsoLikeProps {
  blogs: BlogEntry[];
  isMobile: boolean;
}

const YouMightAlsoLike = ({ blogs, isMobile }: YouMightAlsoLikeProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.split("/").reverse().join("-"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Estimate reading time
  const estimateReadingTime = (text: string) => {
    const cleanText = text.replace(/<[^>]*>/g, "");
    const words = cleanText.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full bg-gradient-to-b from-[#1D1D1D] to-[#0D0D0D] ${
        isMobile ? "px-6 py-12" : "px-[120px] py-20"
      }`}
    >
      {/* Heading */}
      <h2
        className={`text-white font-semibold mb-10 ${
          isMobile
            ? "text-[32px] leading-[40px] tracking-[0%]"
            : "text-[48px] leading-[56px] tracking-[-2px]"
        }`}
      >
        You might also like
      </h2>

      {/* Blog Grid */}
      {isMobile ? (
        // Mobile: Single column with desktop-style cards
        <div className="space-y-10">
          {blogs.map((blog) => {
            const formattedDate = formatDate(blog.date);
            const readingTime = estimateReadingTime(
              blog.content || blog.description
            );

            return (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="block hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-full">
                  {/* Image */}
                  <div className="w-full h-[216px] rounded-[20px] overflow-hidden bg-[#333333] mb-4">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={373}
                      height={216}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-[20px] leading-[28px] tracking-[0%] line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Date and Reading Time */}
                    <p className="text-[#8A8A8A] font-normal text-[14px] leading-[20px] tracking-[0%]">
                      {formattedDate} · {readingTime}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // Desktop: Grid layout (2 rows, 3 columns)
        <div className="grid grid-cols-3 gap-10">
          {blogs.slice(0, 6).map((blog) => {
            const formattedDate = formatDate(blog.date);
            const readingTime = estimateReadingTime(
              blog.content || blog.description
            );

            return (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="block hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-full">
                  {/* Image */}
                  <div className="w-full h-[216px] rounded-[20px] overflow-hidden bg-[#333333] mb-4">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={373}
                      height={216}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-[20px] leading-[28px] tracking-[0%] line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Date and Reading Time */}
                    <p className="text-[#8A8A8A] font-normal text-[14px] leading-[20px] tracking-[0%]">
                      {formattedDate} · {readingTime}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YouMightAlsoLike;
