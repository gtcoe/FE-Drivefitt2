"use client";

import Image from "next/image";
import Link from "next/link";

interface FeaturedBlogProps {
  blog: {
    id: string;
    title: string;
    description: string;
    slug: string;
    date: string;
    image: string;
    categoryHeading?: string;
  };
  isMobile: boolean;
}

const FeaturedBlog = ({ blog, isMobile }: FeaturedBlogProps) => {
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

  return (
    <div className={`relative w-full ${isMobile ? "" : "px-[120px]"}`}>
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="relative w-full overflow-hidden rounded-lg">
          <div
            className={`relative ${isMobile ? "h-[300px]" : "h-[600px] pt-20"}`}
          >
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0.8) 100%)",
              }}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end">
              {/* Title */}
              <h1
                className={`text-white font-bold ${
                  isMobile
                    ? "text-[28px] leading-[32px] tracking-[0px] px-6 pb-[8px] "
                    : "text-[68px] leading-[78px] tracking-[-2px] px-10 pb-[16px]"
                }`}
              >
                {blog.title}
              </h1>

              {/* Date and Reading Time */}
              <div
                className={`text-white font-normal ${
                  isMobile
                    ? "text-[14px] leading-[20px] tracking-[0%] px-6 pb-5"
                    : "text-[16px] leading-[20px] tracking-[0%] px-10 pb-10"
                }`}
              >
                {formattedDate} · {readingTime}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedBlog;
