"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FormSubmissionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to general-queries as default
    router.push("/admin-portal/form-submission/general-queries");
  }, [router]);

  return null;
}
