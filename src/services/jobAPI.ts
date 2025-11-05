import { JobPosting } from "@/types/database";

// Get the base URL for API requests
// In server-side rendering, we need an absolute URL
// In client-side, we can use relative URLs
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server-side: use absolute URL
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  // Client-side: use relative URL
  return "";
};

export const jobAPI = {
  async list(params?: {
    status?: number;
    is_visible?: boolean;
    department_id?: number;
    location_id?: number;
    admin?: boolean;
  }): Promise<JobPosting[]> {
    const qs = new URLSearchParams();
    if (params?.status !== undefined) qs.set("status", String(params.status));
    if (params?.is_visible !== undefined)
      qs.set("is_visible", params.is_visible ? "true" : "false");
    if (params?.department_id !== undefined)
      qs.set("department_id", String(params.department_id));
    if (params?.location_id !== undefined)
      qs.set("location_id", String(params.location_id));
    if (params?.admin !== undefined)
      qs.set("admin", params.admin ? "true" : "false");
    const res = await fetch(
      `${getBaseUrl()}/api/job-postings?${qs.toString()}`,
      {
        cache: "no-store",
      }
    );
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Fetch failed");
    return json.data as JobPosting[];
  },

  async getById(id: number): Promise<JobPosting> {
    const res = await fetch(`${getBaseUrl()}/api/job-postings/${id}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Fetch failed");
    return json.data as JobPosting;
  },

  async create(payload: Partial<JobPosting>) {
    const res = await fetch(`${getBaseUrl()}/api/job-postings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Create failed");
    return json.data;
  },

  async update(id: number, payload: Partial<JobPosting>) {
    const res = await fetch(`${getBaseUrl()}/api/job-postings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Update failed");
    return json.data;
  },

  async setStatus(id: number, status: number) {
    const res = await fetch(`${getBaseUrl()}/api/job-postings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Status failed");
    return json.data;
  },

  async setVisibility(id: number, is_visible: boolean) {
    const res = await fetch(
      `${getBaseUrl()}/api/job-postings/${id}/visibility`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible }),
      }
    );
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Visibility failed");
    return json.data;
  },

  async getDepartmentsLocations(): Promise<{
    departments: any[];
    locations: any[];
  }> {
    const res = await fetch(`${getBaseUrl()}/api/departments-locations`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Fetch failed");
    return json.data as { departments: any[]; locations: any[] };
  },

  async delete(id: number) {
    const res = await fetch(`${getBaseUrl()}/api/job-postings/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Delete failed");
    return json.data;
  },
};
