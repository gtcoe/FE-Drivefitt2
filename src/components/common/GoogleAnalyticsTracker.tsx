"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/gtag";

function GoogleAnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTrackerInner />
    </Suspense>
  );
}
