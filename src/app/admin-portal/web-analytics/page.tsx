"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function WebAnalyticsPage() {
  const { adminUser } = useAdminAuth();

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Web Analytics"
        user={adminUser}
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="p-10">
        <div className="bg-[#1D1D1D] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Web Analytics
          </h2>
          <p className="text-[#8A8A8A] text-lg">
            Web analytics dashboard will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
}
