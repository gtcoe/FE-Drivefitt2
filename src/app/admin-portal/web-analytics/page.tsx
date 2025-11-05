"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import { AdminUser } from "@/types/adminPortal";

// Mock user data - in real implementation, this would come from authentication
const mockUser: AdminUser = {
  name: "Admin",
  email: "admin@drivefitt.com",
};

export default function WebAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Web Analytics"
        user={mockUser}
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
