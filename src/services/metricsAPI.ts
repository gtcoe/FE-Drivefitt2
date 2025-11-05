interface CareerMetrics {
  openPositions: number;
  totalApplications: number;
  todayApplications: number;
  shortlistedCandidates: number;
}

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server-side: use full URL
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }
  // Client-side: use relative URL
  return "";
};

export const metricsAPI = {
  async getCareerMetrics(): Promise<CareerMetrics> {
    const res = await fetch(`${getBaseUrl()}/api/career-metrics`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json?.status) {
      throw new Error(json?.error || "Failed to fetch metrics");
    }
    return json.data as CareerMetrics;
  },
};
