"use client";

import { BlogEntry } from "@/types/adminPortal";

interface BlogContentProps {
  blog: BlogEntry;
  isMobile: boolean;
}

const BlogContent = ({ blog, isMobile }: BlogContentProps) => {
  return (
    <div className={`${isMobile ? "px-6 pt-6" : ""}`}>
      {/* Blog Content */}
      <div
        className={`text-white prose prose-invert max-w-none ${
          isMobile ? "pb-8" : "pb-[60px]"
        }`}
        style={{
          // Custom prose styles for blog content
          fontSize: isMobile ? "16px" : "18px",
          lineHeight: isMobile ? "24px" : "28px",
        }}
      >
        {/* Render HTML content */}
        <div
          dangerouslySetInnerHTML={{ __html: blog.content || blog.description }}
          className="blog-content"
        />
      </div>

      <style jsx>{`
        .blog-content h1 {
          font-size: ${isMobile ? "24px" : "32px"};
          font-weight: 700;
          margin-bottom: ${isMobile ? "16px" : "24px"};
          color: white;
        }

        .blog-content h2 {
          font-size: ${isMobile ? "20px" : "28px"};
          font-weight: 600;
          margin-bottom: ${isMobile ? "12px" : "20px"};
          margin-top: ${isMobile ? "24px" : "32px"};
          color: white;
        }

        .blog-content h3 {
          font-size: ${isMobile ? "18px" : "24px"};
          font-weight: 600;
          margin-bottom: ${isMobile ? "10px" : "16px"};
          margin-top: ${isMobile ? "20px" : "28px"};
          color: white;
        }

        .blog-content p {
          margin-bottom: ${isMobile ? "16px" : "20px"};
          color: #e5e5e5;
          line-height: ${isMobile ? "24px" : "28px"};
        }

        .blog-content ul,
        .blog-content ol {
          margin-bottom: ${isMobile ? "16px" : "20px"};
          padding-left: ${isMobile ? "20px" : "24px"};
        }

        .blog-content li {
          margin-bottom: ${isMobile ? "8px" : "12px"};
          color: #e5e5e5;
          line-height: ${isMobile ? "22px" : "26px"};
        }

        .blog-content blockquote {
          border-left: 4px solid #00dbdc;
          padding-left: ${isMobile ? "16px" : "20px"};
          margin: ${isMobile ? "20px 0" : "24px 0"};
          font-style: italic;
          color: #b3b3b3;
        }

        .blog-content code {
          background-color: #1d1d1d;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Courier New", monospace;
          color: #00dbdc;
        }

        .blog-content pre {
          background-color: #1d1d1d;
          padding: ${isMobile ? "16px" : "20px"};
          border-radius: 8px;
          overflow-x: auto;
          margin: ${isMobile ? "16px 0" : "20px 0"};
        }

        .blog-content a {
          color: #00dbdc;
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: #00b8bb;
        }

        .blog-content strong {
          font-weight: 600;
          color: white;
        }

        .blog-content em {
          font-style: italic;
          color: #e5e5e5;
        }
      `}</style>
    </div>
  );
};

export default BlogContent;
