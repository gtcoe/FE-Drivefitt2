"use client";

import BlogCard from "./BlogCard";
import { BlogCategory, BlogEntry } from "@/types/adminPortal";

interface BlogCategorySectionProps {
  category: BlogCategory;
  blogs: BlogEntry[];
  isMobile: boolean;
  isFirst: boolean;
}

const BlogCategorySection = ({
  category,
  blogs,
  isMobile,
  isFirst,
}: BlogCategorySectionProps) => {
  return (
    <div
      className={`w-full px-6 md:px-[120px] ${
        isFirst ? "" : isMobile ? "mt-6" : "mt-20"
      }`}
    >
      {/* Category Title */}
      <h2
        className={`text-white font-semibold ${
          isMobile
            ? "text-[24px] leading-[28px] tracking-[0px]"
            : "text-[48px] leading-[56px] tracking-[-2px]"
        }`}
      >
        {category.heading}
      </h2>

      {/* Blog Grid */}
      <div className={`${isMobile ? "mt-6" : "mt-10"}`}>
        {isMobile ? (
          // Mobile: Vertical list layout
          <div className="space-y-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} isMobile={isMobile} />
            ))}
          </div>
        ) : (
          // Desktop: Grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategorySection;
