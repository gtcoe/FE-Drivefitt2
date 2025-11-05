"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogEntry } from "@/types/adminPortal";

interface MoreForYouProps {
  blogs: BlogEntry[];
  categoryHeading?: string;
  isMobile: boolean;
}

const MoreForYou = ({ blogs }: MoreForYouProps) => {
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
    <div className="w-full">
      {/* Heading */}
      <h2 className="text-white font-bold text-[32px] leading-[40px] tracking-[0%] pb-[31px]">
        More for you
      </h2>

      {/* Divider */}
      <div className="w-full h-[3px] bg-[#333333] mb-8"></div>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.map((blog) => {
          const formattedDate = formatDate(blog.date);
          const readingTime = estimateReadingTime(
            blog.content || blog.description
          );

          return (
            <Link key={blog.id} href={`/blogs/${blog.slug}`} className="block">
              <div className="w-full h-[88px] flex gap-4 pb-4 border-b border-[#333333] hover:opacity-80 transition-opacity duration-200">
                {/* Image */}
                <div className="w-[120px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-[#333333]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={120}
                    height={72}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Title */}
                  <h3 className="text-white font-medium text-[14px] leading-[20px] tracking-[0%] line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Date and Reading Time */}
                  <p className="text-[#8A8A8A] font-medium text-[14px] leading-[20px] tracking-[0%]">
                    {formattedDate} · {readingTime}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MoreForYou;
