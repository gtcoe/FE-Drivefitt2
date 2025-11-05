import { Application, ApplicationStatus } from "@/types/database";

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

export const applicationAPI = {
  async list(params?: {
    status?: number;
    job_id?: number;
  }): Promise<Application[]> {
    const qs = new URLSearchParams();
    if (params?.status !== undefined) qs.set("status", String(params.status));
    if (params?.job_id !== undefined) qs.set("job_id", String(params.job_id));
    const res = await fetch(
      `${getBaseUrl()}/api/applications?${qs.toString()}`,
      {
        cache: "no-store",
      }
    );
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Fetch failed");
    return json.data.applications as Application[];
  },

  async create(form: {
    candidate_name: string;
    email: string;
    phone?: string;
    job_id: number;
    current_location?: string;
    work_exprience?: string;
    expected_salary?: string;
    resume?: string; // cdn url
  }) {
    const fd = new FormData();
    fd.set("candidate_name", form.candidate_name);
    fd.set("email", form.email);
    if (form.phone) fd.set("phone", form.phone);
    fd.set("job_id", String(form.job_id));
    if (form.current_location)
      fd.set("current_location", form.current_location);
    if (form.work_exprience) fd.set("work_exprience", form.work_exprience);
    if (form.expected_salary) fd.set("expected_salary", form.expected_salary);
    if (form.resume) fd.set("resume", form.resume);

    const res = await fetch(`${getBaseUrl()}/api/applications`, {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Create failed");
    return json.data;
  },

  async setStatus(id: number, status: ApplicationStatus) {
    const res = await fetch(`${getBaseUrl()}/api/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Status failed");
    return json.data;
  },
};
