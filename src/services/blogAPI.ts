import { BlogEntry, BlogFormData } from "@/types/adminPortal";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  return "";
};

export const blogAPI = {
  async list(): Promise<BlogEntry[]> {
    const res = await fetch(`${getBaseUrl()}/api/blogs`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to fetch blogs");
    }
    const blogs = (json.data || json) as BlogServer[];
    // Transform snake_case to camelCase
    return blogs.map((blog: BlogServer) => ({
      ...blog,
      id: String(blog.id ?? ""),
      title: blog.title ?? "",
      description: blog.description ?? "",
      slug: blog.slug ?? "",
      date: blog.date ?? "",
      categoryId: blog.category_id ?? 0,
      categoryHeading: blog.category_heading ?? "",
      content: blog.html ?? "",
      status: blog.status ?? 0,
      isFeatured: (blog.is_featured ?? 0) === 1,
      image: blog.image_url || blog.image || "",
      created: blog.created_at ?? "",
      edited: blog.updated_at ?? "",
    }));
  },

  async create(payload: BlogFormData): Promise<BlogEntry> {
    const res = await fetch(`${getBaseUrl()}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to create blog");
    }
    const blog = (json.data || json) as BlogServer;
    return {
      ...blog,
      id: String(blog.id ?? ""),
      title: blog.title ?? "",
      description: blog.description ?? "",
      slug: blog.slug ?? "",
      date: blog.date ?? "",
      categoryId: blog.category_id ?? 0,
      categoryHeading: blog.category_heading ?? "",
      content: blog.html ?? "",
      status: blog.status ?? 0,
      isFeatured: (blog.is_featured ?? 0) === 1,
      image: blog.image_url || blog.image || "",
      created: blog.created_at ?? "",
      edited: blog.updated_at ?? "",
    };
  },

  async update(
    id: number | string,
    payload: Partial<BlogFormData>
  ): Promise<BlogEntry> {
    const res = await fetch(`${getBaseUrl()}/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to update blog");
    }
    const blog = (json.data || json) as BlogServer;
    return {
      ...blog,
      id: String(blog.id ?? ""),
      title: blog.title ?? "",
      description: blog.description ?? "",
      slug: blog.slug ?? "",
      date: blog.date ?? "",
      categoryId: blog.category_id ?? 0,
      categoryHeading: blog.category_heading ?? "",
      content: blog.html ?? "",
      status: blog.status ?? 0,
      isFeatured: (blog.is_featured ?? 0) === 1,
      image: blog.image_url || blog.image || "",
      created: blog.created_at ?? "",
      edited: blog.updated_at ?? "",
    };
  },

  async remove(id: number | string): Promise<{ success: boolean }> {
    const res = await fetch(`${getBaseUrl()}/api/blogs/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to delete blog");
    }
    return { success: true };
  },

  async toggleFeatured(id: number | string): Promise<BlogEntry> {
    const res = await fetch(`${getBaseUrl()}/api/blogs/${id}/featured`, {
      method: "PATCH",
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.error || "Failed to toggle featured status");
    }
    const blog = json.data || json;
    return {
      ...blog,
      categoryId: blog.category_id,
      categoryHeading: blog.category_heading,
      content: blog.html,
      status: blog.status,
      isFeatured: blog.is_featured === 1,
      image: blog.image_url || blog.image,
      created: blog.created_at,
      edited: blog.updated_at,
    };
  },
};

type BlogServer = {
  id?: number | string;
  title?: string;
  description?: string;
  slug?: string;
  date?: string;
  image_url?: string;
  image?: string;
  html?: string;
  category_id?: number;
  category_heading?: string;
  status?: number;
  is_featured?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};
