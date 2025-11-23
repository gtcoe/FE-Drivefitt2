"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import FormSubmissionTable from "@/components/AdminPortal/FormSubmissionTable";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function LeadSubmissionsPage() {
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
        title="Form submission"
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="px-10 pb-10">
        <FormSubmissionTable
          sectionType="lead-submissions"
          title="Lead Submissions"
          showHeader={true}
        />
      </div>
    </div>
  );
}
