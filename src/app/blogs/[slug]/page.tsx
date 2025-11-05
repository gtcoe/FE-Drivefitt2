import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailContent from "@/components/BlogDetail";
import { headers } from "next/headers";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  try {
    // Fetch blog data for metadata
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/blogs/slug/${params.slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "Blog Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const { data: blog } = await response.json();

    return {
      title: blog.title,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        images: [blog.image],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description,
        images: [blog.image],
      },
    };
  } catch {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  try {
    // Fetch blog data
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/blogs/slug/${params.slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      notFound();
    }

    const { data: blog } = await response.json();

    return <BlogDetailContent blog={blog} isMobile={isMobile} />;
  } catch {
    notFound();
  }
}
