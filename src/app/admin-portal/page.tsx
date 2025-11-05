"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.push("/admin-portal/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-white">Redirecting to dashboard...</div>
    </div>
  );
}
