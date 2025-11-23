"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import PaymentsTable from "@/components/AdminPortal/PaymentsTable";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function PaymentsPage() {
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
        title="Payments"
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="px-10 pb-10">
        <PaymentsTable title="" />
      </div>
    </div>
  );
}
