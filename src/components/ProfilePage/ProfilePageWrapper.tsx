"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProfilePage from "./ProfilePage";
import { ProfilePageData } from "@/types/staticPages";

interface ProfilePageWrapperProps {
  data: ProfilePageData;
  pageName: string;
  isMobile?: boolean;
}

export default function ProfilePageWrapper({
  data,
  pageName,
  isMobile,
}: ProfilePageWrapperProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Mark that we've completed the initial auth check
    setHasCheckedAuth(true);
  }, []);

  useEffect(() => {
    console.log(
      "ProfilePageWrapper: Authentication check - isAuthenticated:",
      isAuthenticated,
      "hasCheckedAuth:",
      hasCheckedAuth
    );

    // Only redirect if we've completed the initial auth check and user is not authenticated
    if (hasCheckedAuth && !isAuthenticated) {
      console.log(
        "ProfilePageWrapper: Not authenticated after initial check, redirecting to home"
      );
      router.push("/");
    }
  }, [isAuthenticated, hasCheckedAuth, router]);

  // If not authenticated after initial check, don't render the profile page
  if (hasCheckedAuth && !isAuthenticated) {
    return null;
  }

  // Update the data with actual user information from Redux
  const updatedData: ProfilePageData = {
    ...data,
    userInfo: {
      name: user?.name || data.userInfo.name,
      email: user?.email || data.userInfo.email,
      phone: user?.phone || data.userInfo.phone,
      dateOfBirth: user?.dateOfBirth || data.userInfo.dateOfBirth,
      activePlan:
        user?.membershipInfo?.membershipType?.toString() ||
        data.userInfo.activePlan,
      planExpires: user?.membershipInfo?.expiresAt || data.userInfo.planExpires,
    },
  };

  console.log("ProfilePageWrapper: Rendering profile page with user:", user);
  return (
    <ProfilePage data={updatedData} pageName={pageName} isMobile={isMobile} />
  );
}
