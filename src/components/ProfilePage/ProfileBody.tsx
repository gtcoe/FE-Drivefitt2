"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProfilePageData } from "@/types/staticPages";
import { ProfileEditState } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import EditableField from "@/components/common/EditableField";
import { validateField } from "@/utils/profileValidation";
import { formatDateForInput } from "@/utils/dateUtils";

interface ProfileBodyProps {
  data: ProfilePageData;
  isMobile?: boolean;
}

const ProfileBody = ({ data, isMobile }: ProfileBodyProps) => {
  const { userInfo, actions } = data;
  const { user, updateUserProfile, updateUserData, fetchProfile } = useAuth();
  const router = useRouter();

  // Helper function to get plan name from membership type
  const getPlanName = (membershipType: number): string => {
    switch (membershipType) {
      case 1:
        return "Individual Annual Plan";
      case 2:
        return "Family Annual Plan";
      default:
        return "Unknown Plan";
    }
  };

  // Initialize edit state
  const [editState, setEditState] = useState<ProfileEditState>({
    editingField: null,
    fieldValues: {
      name: user?.name || userInfo.name,
      email: user?.email || userInfo.email,
      dateOfBirth: user?.dateOfBirth || userInfo.dateOfBirth,
    },
    validation: {
      name: { isValid: true, message: "" },
      email: { isValid: true, message: "" },
      dateOfBirth: { isValid: true, message: "" },
    },
    errors: {
      name: "",
      email: "",
      dateOfBirth: "",
    },
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user?.id) {
      // Always fetch profile to ensure we have the latest membership data
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  // Debug: Log user data to see what we're getting
  useEffect(() => {
    console.log("ProfileBody: User data:", {
      hasMembership: user?.hasMembership,
      membershipInfo: user?.membershipInfo,
      memberships: user?.memberships,
      membershipsLength: user?.memberships?.length,
    });
  }, [user]);

  // Update field values when user data changes
  useEffect(() => {
    if (user) {
      setEditState((prev) => ({
        ...prev,
        fieldValues: {
          name: user.name || userInfo.name,
          email: user.email || userInfo.email,
          dateOfBirth: user.dateOfBirth || userInfo.dateOfBirth,
        },
      }));
    }
  }, [user, userInfo]);

  const handleStartEdit = (field: string) => {
    setEditState((prev) => ({
      ...prev,
      editingField: field,
      errors: {
        ...prev.errors,
        [field]: "",
      },
    }));
  };

  const handleSave = async (field: string, value: string) => {
    // Convert date format if needed before saving
    let valueToSave = value;
    if (field === "dateOfBirth") {
      valueToSave = formatDateForInput(value);
    }

    // Optimistically update the UI immediately
    setEditState((prev) => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: "",
      },
    }));

    // Update Redux store optimistically
    updateUserData({
      [field === "dateOfBirth" ? "dateOfBirth" : field]: value,
    });

    // Save asynchronously in background
    try {
      const result = await updateUserProfile({
        field: field as "name" | "email" | "dateOfBirth",
        value: valueToSave, // Use converted value for API call
      });

      if (result.type === "auth/updateProfile/rejected") {
        // Error - revert the optimistic update and show error
        setEditState((prev) => ({
          ...prev,
          fieldValues: {
            ...prev.fieldValues,
            [field]: user?.[field as keyof typeof user] || value, // Revert to original value
          },
          errors: {
            ...prev.errors,
            [field]: (result.payload as string) || "Failed to update profile",
          },
        }));
      }
    } catch {
      // Error - revert the optimistic update and show error
      setEditState((prev) => ({
        ...prev,
        fieldValues: {
          ...prev.fieldValues,
          [field]: user?.[field as keyof typeof user] || value, // Revert to original value
        },
        errors: {
          ...prev.errors,
          [field]: "Failed to update profile",
        },
      }));
    }
  };

  const handleCancel = (field: string) => {
    setEditState((prev) => ({
      ...prev,
      editingField: null,
      errors: {
        ...prev.errors,
        [field]: "",
      },
    }));
  };

  const handleAction = (actionType: string) => {
    if (actionType === "viewPlan") {
      // Redirect to membership page
      router.push("/membership");
    }
  };

  const renderActionButton = (
    action: {
      isButton?: boolean;
      text: string;
      enabled?: boolean;
    },
    actionType: string
  ) => {
    if (action.isButton) {
      return (
        <button
          onClick={() => handleAction(actionType)}
          className="bg-[#00DBDC] text-black font-normal text-sm leading-5 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 self-start md:mt-[15px]"
        >
          {action.text}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleAction(actionType)}
        className={`font-normal text-sm leading-5 transition-colors duration-200 self-start ${
          action.enabled
            ? "text-[#00DBDC] hover:text-[#00DBDC]/80"
            : "text-[#8A8A8A] cursor-not-allowed"
        }`}
        disabled={!action.enabled}
      >
        {action.text}
      </button>
    );
  };

  const renderMobileActionButton = (
    action: {
      isButton?: boolean;
      text: string;
      enabled?: boolean;
    },
    actionType: string
  ) => {
    if (action.isButton) {
      return (
        <button
          onClick={() => handleAction(actionType)}
          className="bg-[#00DBDC] text-black font-normal text-xs leading-5 px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 self-start mt-[15px]"
        >
          {action.text}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleAction(actionType)}
        className={`font-normal text-xs leading-5 transition-colors duration-200 self-start ${
          action.enabled
            ? "text-[#00DBDC] hover:text-[#00DBDC]/80"
            : "text-[#8A8A8A] cursor-not-allowed"
        }`}
        disabled={!action.enabled}
      >
        {action.text}
      </button>
    );
  };

  if (isMobile) {
    return (
      <div className="mx-[24px] mt-[48px] mb-[60px]">
        <div
          className="py-[40px] px-[24px] rounded-[20px]"
          style={{
            background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
            border: "2px solid #333333",
          }}
        >
          <div className="flex flex-col">
            <div className="flex justify-center mb-[32px]">
              <Image
                src="/images/profile.svg"
                alt="Profile"
                width={96}
                height={96}
                className="w-[96px] h-[96px]"
              />
            </div>

            <div className="w-full space-y-[24px]">
              <EditableField
                field="name"
                label="Name"
                value={editState.fieldValues.name}
                isEditing={editState.editingField === "name"}
                error={editState.errors.name}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("name")}
                onSave={(value) => handleSave("name", value)}
                onCancel={() => handleCancel("name")}
                onValidate={(value) => validateField("name", value)}
              />

              <EditableField
                field="email"
                label="Email"
                value={editState.fieldValues.email}
                isEditing={editState.editingField === "email"}
                error={editState.errors.email}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("email")}
                onSave={(value) => handleSave("email", value)}
                onCancel={() => handleCancel("email")}
                onValidate={(value) => validateField("email", value)}
              />

              <div className="flex flex-col">
                <span className="font-light text-xs leading-4 mb-1 text-[#8A8A8A]">
                  Phone number
                </span>
                <span className="font-normal text-xl leading-7 mb-2 text-white">
                  {user?.phone || userInfo.phone}
                </span>
              </div>

              <EditableField
                field="dateOfBirth"
                label="Date of birth"
                value={editState.fieldValues.dateOfBirth}
                isEditing={editState.editingField === "dateOfBirth"}
                error={editState.errors.dateOfBirth}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("dateOfBirth")}
                onSave={(value) => handleSave("dateOfBirth", value)}
                onCancel={() => handleCancel("dateOfBirth")}
                onValidate={(value) => validateField("dateOfBirth", value)}
              />

              <div className="flex flex-col md:mt-[50px]">
                <span className="font-light text-xs leading-4 mb-1 text-[#8A8A8A]">
                  {user?.memberships && user.memberships.length > 1
                    ? "Plans expire"
                    : "Plan expires"}
                </span>
                <div className="flex flex-col gap-1">
                  {user?.memberships && user.memberships.length > 0 ? (
                    user.memberships.map((membership) => (
                      <div key={membership.id} className="flex flex-col">
                        <span className="font-normal text-sm leading-5 text-[#CCCCCC]">
                          {getPlanName(membership.membershipType)}
                        </span>
                        <span className="font-normal text-xl leading-7 text-white">
                          {new Date(membership.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : user?.membershipInfo?.expiresAt ? (
                    <span className="font-normal text-xl leading-7 text-white">
                      {new Date(
                        user.membershipInfo.expiresAt
                      ).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="font-normal text-xl leading-7 text-white">
                      No active plan
                    </span>
                  )}
                </div>
                {/* Renew plan functionality removed - not available in actions */}
              </div>

              <div className="flex flex-col">
                <span className="font-light text-xs leading-4 mb-1 text-[#8A8A8A]">
                  {user?.memberships && user.memberships.length > 1
                    ? "Active plans"
                    : "Active plan"}
                </span>
                <div className="flex flex-col gap-1">
                  {user?.memberships && user.memberships.length > 0 ? (
                    user.memberships.map((membership) => (
                      <span
                        key={membership.id}
                        className="font-normal text-xl leading-7 text-white"
                      >
                        {getPlanName(membership.membershipType)}
                      </span>
                    ))
                  ) : user?.membershipInfo?.membershipType ? (
                    <span className="font-normal text-xl leading-7 text-white">
                      {getPlanName(user.membershipInfo.membershipType)}
                    </span>
                  ) : (
                    <span className="font-normal text-xl leading-7 text-white">
                      No active plan
                    </span>
                  )}
                </div>
                {renderMobileActionButton(actions.viewPlan, "viewPlan")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-[120px] mt-[40px] mb-[140px]">
      <div
        className="pt-[80px] pl-[80px] pb-[80px] pr-[167px] rounded-[40px]"
        style={{
          background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
          border: "2px solid #333333",
        }}
      >
        <div className="flex gap-[84px]">
          <div className="flex-shrink-0">
            <Image
              src="/images/profile.svg"
              alt="Profile"
              width={150}
              height={150}
              className="w-[150px] h-[150px]"
            />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-[84px]">
            <div className="space-y-[68px]">
              <EditableField
                field="name"
                label="Name"
                value={editState.fieldValues.name}
                isEditing={editState.editingField === "name"}
                error={editState.errors.name}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("name")}
                onSave={(value) => handleSave("name", value)}
                onCancel={() => handleCancel("name")}
                onValidate={(value) => validateField("name", value)}
              />

              <div className="flex flex-col">
                <span className="font-light text-base leading-5 mb-2 text-[#8A8A8A]">
                  Phone number
                </span>
                <span className="font-normal text-2xl leading-7 mb-5 text-white">
                  {user?.phone || userInfo.phone}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-light text-base leading-5 mb-2 text-[#8A8A8A]">
                  {user?.memberships && user.memberships.length > 1
                    ? "Active plans"
                    : "Active plan"}
                </span>
                <div className="flex flex-col gap-2">
                  {user?.memberships && user.memberships.length > 0 ? (
                    user.memberships.map((membership) => (
                      <span
                        key={membership.id}
                        className="font-normal text-2xl leading-7 text-white"
                      >
                        {getPlanName(membership.membershipType)}
                      </span>
                    ))
                  ) : user?.membershipInfo?.membershipType ? (
                    <span className="font-normal text-2xl leading-7 text-white">
                      {getPlanName(user.membershipInfo.membershipType)}
                    </span>
                  ) : (
                    <span className="font-normal text-2xl leading-7 text-white">
                      No active plan
                    </span>
                  )}
                </div>
                {renderActionButton(actions.viewPlan, "viewPlan")}
              </div>
            </div>

            <div className="space-y-[68px]">
              <EditableField
                field="email"
                label="Email"
                value={editState.fieldValues.email}
                isEditing={editState.editingField === "email"}
                error={editState.errors.email}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("email")}
                onSave={(value) => handleSave("email", value)}
                onCancel={() => handleCancel("email")}
                onValidate={(value) => validateField("email", value)}
              />

              <EditableField
                field="dateOfBirth"
                label="Date of birth"
                value={editState.fieldValues.dateOfBirth}
                isEditing={editState.editingField === "dateOfBirth"}
                error={editState.errors.dateOfBirth}
                isMobile={isMobile}
                onStartEdit={() => handleStartEdit("dateOfBirth")}
                onSave={(value) => handleSave("dateOfBirth", value)}
                onCancel={() => handleCancel("dateOfBirth")}
                onValidate={(value) => validateField("dateOfBirth", value)}
              />

              <div className="flex flex-col md:!mt-[50px]">
                <span className="font-light text-base leading-5 mb-2 text-[#8A8A8A]">
                  {user?.memberships && user.memberships.length > 1
                    ? "Plans expire"
                    : "Plan expires"}
                </span>
                <div className="flex flex-col gap-3">
                  {user?.memberships && user.memberships.length > 0 ? (
                    user.memberships.map((membership) => (
                      <div key={membership.id} className="flex flex-col">
                        <span className="font-normal text-base leading-5 text-[#CCCCCC]">
                          {getPlanName(membership.membershipType)}
                        </span>
                        <span className="font-normal text-2xl leading-7 text-white">
                          {new Date(membership.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : user?.membershipInfo?.expiresAt ? (
                    <span className="font-normal text-2xl leading-7 text-white">
                      {new Date(
                        user.membershipInfo.expiresAt
                      ).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="font-normal text-2xl leading-7 text-white">
                      No active plan
                    </span>
                  )}
                </div>
                {/* Renew plan functionality removed - not available in actions */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBody;
