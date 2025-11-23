"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import UsersTable from "@/components/AdminPortal/UsersTable";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function UsersPage() {
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
        title="Users"
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="px-10 pb-10">
        <UsersTable title="" />
      </div>
    </div>
  );
}
