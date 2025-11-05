"use client";

import AdminHeader from "@/components/AdminPortal/AdminHeader";
import FormSubmissionTable from "@/components/AdminPortal/FormSubmissionTable";
import { AdminUser } from "@/types/adminPortal";

// Mock user data - in real implementation, this would come from authentication
const mockUser: AdminUser = {
  name: "Admin",
  email: "admin@drivefitt.com",
};

export default function LeadSubmissionsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Form submission"
        user={mockUser}
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="px-10 pb-10">
        <div className="flex items-center justify-between py-4 px-10 border border-[#333333] rounded-t-2xl">
          <h2 className="text-white text-2xl font-medium">Lead Submissions</h2>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#0D0D0D] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC] transition-colors duration-200"
                style={{ width: "240px", height: "40px" }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A]"
              >
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Filter Button */}
            <button
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
              style={{ height: "40px" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14.6667 2H1.33333L6.66667 8.10667V12.6667L9.33333 14V8.10667L14.6667 2Z"
                  stroke="#BFBFBF"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#BFBFBF] text-sm font-normal">Filter</span>
            </button>

            {/* Download CSV Button */}
            <button
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
              style={{ height: "40px" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                  stroke="#BFBFBF"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.6665 6.66675L7.99984 10.0001L11.3332 6.66675"
                  stroke="#BFBFBF"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10V2"
                  stroke="#BFBFBF"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#BFBFBF] text-sm font-normal">
                Download CSV
              </span>
            </button>
          </div>
        </div>

        <FormSubmissionTable
          sectionType="lead-submissions"
          title="Lead Submissions"
          showHeader={false}
        />
      </div>
    </div>
  );
}
