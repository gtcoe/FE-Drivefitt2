import { BlogCategory } from "@/types/adminPortal";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  return "";
};

export const blogCategoryAPI = {
  async list(): Promise<BlogCategory[]> {
    const res = await fetch(`${getBaseUrl()}/api/blog-categories`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to fetch blog categories");
    }
    return (json.data || json) as BlogCategory[];
  },

  async create(payload: {
    heading: string;
    status?: string;
  }): Promise<BlogCategory> {
    const res = await fetch(`${getBaseUrl()}/api/blog-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: payload.heading,
        status: payload.status ?? "active",
      }),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to create blog category");
    }
    return (json.data || json) as BlogCategory;
  },
};
