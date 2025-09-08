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
    if (user?.id && (!user.membershipInfo || !user.hasMembership)) {
      fetchProfile();
    }
  }, [user?.id, user?.membershipInfo, user?.hasMembership, fetchProfile]);

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
          className="bg-[#00DBDC] text-black font-normal text-sm leading-5 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 self-start"
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
          className="bg-[#00DBDC] text-black font-normal text-xs leading-5 px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 self-start"
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
                  Plan expires
                </span>
                <span className="font-normal text-xl leading-7 mb-2 text-white">
                  {user?.membershipInfo?.expiresAt
                    ? new Date(
                        user.membershipInfo.expiresAt
                      ).toLocaleDateString()
                    : "No active plan"}
                </span>
                {/* Renew plan functionality removed - not available in actions */}
              </div>

              <div className="flex flex-col">
                <span className="font-light text-xs leading-4 mb-1 text-[#8A8A8A]">
                  Active plan
                </span>
                <span className="font-normal text-xl leading-7 mb-2 text-white">
                  {user?.membershipInfo?.membershipType
                    ? user.membershipInfo.membershipType === 1
                      ? "Individual Annual Plan"
                      : user.membershipInfo.membershipType === 2
                      ? "Family Annual Plan"
                      : "Unknown Plan"
                    : "No active plan"}
                </span>
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
                  Active plan
                </span>
                <span className="font-normal text-2xl leading-7 mb-5 text-white">
                  {user?.membershipInfo?.membershipType
                    ? user.membershipInfo.membershipType === 1
                      ? "Individual Annual Plan"
                      : user.membershipInfo.membershipType === 2
                      ? "Family Annual Plan"
                      : "Unknown Plan"
                    : "No active plan"}
                </span>
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
                  Plan expires
                </span>
                <span className="font-normal text-2xl leading-7 mb-5 text-white">
                  {user?.membershipInfo?.expiresAt
                    ? new Date(
                        user.membershipInfo.expiresAt
                      ).toLocaleDateString()
                    : "No active plan"}
                </span>
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
