"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminPortal/AdminHeader";
import CareerSection from "@/components/AdminPortal/CareerSection";
import JobPostApplicationSection from "@/components/AdminPortal/JobPostApplicationSection";
import { metricsAPI } from "@/services/metricsAPI";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface CareerMetrics {
  openPositions: number;
  totalApplications: number;
  todayApplications: number;
  shortlistedCandidates: number;
}

export default function CareerManagementPage() {
  const [metrics, setMetrics] = useState<CareerMetrics>({
    openPositions: 0,
    totalApplications: 0,
    todayApplications: 0,
    shortlistedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const { adminUser } = useAdminAuth();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsAPI.getCareerMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const CareerApplicationList = [
    {
      title: "Open Position (Visible)",
      quantity: metrics.openPositions,
    },
    {
      title: "Application received",
      quantity: metrics.totalApplications,
    },
    {
      title: "Today's application",
      quantity: metrics.todayApplications,
    },
    {
      title: "Shortlisted candidates",
      quantity: metrics.shortlistedCandidates,
    },
  ];
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Career management"
        user={adminUser}
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="px-10 pb-10">
        {/* Career Application List Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {CareerApplicationList.map((item, index) => (
            <CareerSection
              key={index}
              title={item.title}
              quantity={item.quantity}
              loading={loading}
            />
          ))}
        </div>

        {/* Job Post Application Section */}
        <JobPostApplicationSection onDataChange={fetchMetrics} />
      </div>
    </div>
  );
}
