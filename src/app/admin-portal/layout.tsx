"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "@/components/AdminPortal/LeftSidebar";
import { AdminNavItem } from "@/types/adminPortal";

const adminNavItems: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/admin-portal/dashboard" },
  { id: "blogs", label: "Blogs", path: "/admin-portal/blogs" },
  {
    id: "career-management",
    label: "Career Management",
    path: "/admin-portal/career-management",
  },
  {
    id: "web-analytics",
    label: "Web Analytics",
    path: "/admin-portal/web-analytics",
  },
  {
    id: "form-submission",
    label: "Form Submission",
    path: "/admin-portal/form-submission/general-queries",
    subItems: [
      {
        id: "general-queries",
        label: "General Queries",
        path: "/admin-portal/form-submission/general-queries",
      },
      {
        id: "franchise-applications",
        label: "Franchise Applications",
        path: "/admin-portal/form-submission/franchise-applications",
      },
      {
        id: "lead-submissions",
        label: "Lead Submissions",
        path: "/admin-portal/form-submission/lead-submissions",
      },
    ],
  },
];

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("dashboard");

  // Extract selected option from pathname
  useEffect(() => {
    const pathSegments = pathname.split("/");

    // Handle form-submission sub-pages
    if (pathname.includes("/form-submission/")) {
      setSelectedOption("form-submission");
    } else {
      const currentOption = pathSegments[pathSegments.length - 1];

      if (
        currentOption &&
        adminNavItems.some((item) => item.id === currentOption)
      ) {
        setSelectedOption(currentOption);
      } else if (pathname === "/admin-portal") {
        // Redirect to dashboard if on base admin-portal path
        router.push("/admin-portal/dashboard");
      }
    }
  }, [pathname, router]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    // Check if it's a main nav item
    const navItem = adminNavItems.find((item) => item.id === option);
    if (navItem) {
      router.push(navItem.path);
      return;
    }

    // Check if it's a sub-item
    for (const mainItem of adminNavItems) {
      if (mainItem.subItems) {
        const subItem = mainItem.subItems.find((sub) => sub.id === option);
        if (subItem) {
          router.push(subItem.path);
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Left Sidebar */}
      <LeftSidebar
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        navItems={adminNavItems}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
