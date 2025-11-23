"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "@/components/AdminPortal/LeftSidebar";
import AdminLogin from "@/components/AdminPortal/AdminLogin";
import { AdminNavItem } from "@/types/adminPortal";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";

const adminNavItems: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/admin-portal/dashboard" },
  { id: "blogs", label: "Blogs", path: "/admin-portal/blogs" },
  { id: "users", label: "Users", path: "/admin-portal/users" },
  { id: "payments", label: "Payments", path: "/admin-portal/payments" },
  {
    id: "career-management",
    label: "Career Management",
    path: "/admin-portal/career-management",
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

function AdminPortalContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const { isAuthenticated, isLoading } = useAdminAuth();

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
      }
    }
  }, [pathname]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin-portal") {
      router.push("/admin-portal");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show admin portal layout for authenticated users
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

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminPortalContent>{children}</AdminPortalContent>
    </AdminAuthProvider>
  );
}
