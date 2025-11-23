"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import PaymentModal from "./PaymentModal";
import PaymentResultModal, { PaymentResultType } from "./PaymentResultModal";
import PaymentLoader from "./PaymentLoader";
// import MembershipAlertModal from "./MembershipAlertModal"; // Removed - no longer blocking purchases
import PhoneNumberModal from "./Modal/PhoneNumberModal";
import UserInfoModal from "./Modal/UserInfoModal";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MembershipStatus } from "@/types/auth";

interface PricingPlan {
  title: string;
  subtitle?: string;
  discountedPrice: string;
  originalPrice: string;
  discountPercentage: string;
  buttonText: string;
  seatsLeft: string;
  limitedOfferCountText?: string;
}

interface PricingPlansProps {
  plans: PricingPlan[];
  className?: string;
  isMobile?: boolean;
}

const PricingPlans = ({ plans, className, isMobile }: PricingPlansProps) => {
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentResultModal, setShowPaymentResultModal] = useState(false);
  const [paymentResultType, setPaymentResultType] =
    useState<PaymentResultType>("success");
  const [paymentResultData, setPaymentResultData] = useState<{
    transactionId: string;
    planName?: string;
    discountAmount?: number;
  } | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string>("");
  const [waitingForUserData, setWaitingForUserData] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [userMembershipTypes, setUserMembershipTypes] = useState<number[]>([]);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { checkUserMembership, fetchProfile, updateUserData } = useAuth();
  const router = useRouter();

  // Check user's current membership on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchUserMembership = async () => {
        try {
          const membershipResult = await checkUserMembership(user.id);
          if (membershipResult.type === "auth/checkMembership/fulfilled") {
            const membershipData = membershipResult.payload as {
              hasMembership: boolean;
              memberships?: Array<{
                membershipType: number;
              }>;
              membershipInfo?: {
                membershipType: number;
              };
            };
            if (membershipData.hasMembership && membershipData.memberships) {
              // New API structure with multiple memberships
              const membershipTypes = membershipData.memberships.map(
                (m) => m.membershipType
              );
              setUserMembershipTypes(membershipTypes);
            } else if (
              membershipData.hasMembership &&
              membershipData.membershipInfo
            ) {
              // Fallback to old API structure for backward compatibility
              setUserMembershipTypes([
                membershipData.membershipInfo.membershipType,
              ]);
            } else {
              setUserMembershipTypes([]);
            }
          }
        } catch (error) {
          console.error("Error fetching user membership:", error);
          setUserMembershipTypes([]);
        }
      };

      fetchUserMembership();
    } else {
      setUserMembershipTypes([]);
    }
  }, [isAuthenticated, user?.id, checkUserMembership]);

  // Debug: Monitor showPhoneModal state changes
  // useEffect(() => {
  //   console.log(
  //     "PricingPlans: showPhoneModal state changed to:",
  //     showPhoneModal
  //   );
  // }, [showPhoneModal]);

  // Watch for user data changes and open payment modal when ready
  useEffect(() => {
    console.log("PricingPlans: useEffect triggered", {
      waitingForUserData,
      userExists: !!user,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      userPhone: user?.phone,
      userDateOfBirth: user?.dateOfBirth,
    });

    if (waitingForUserData && user) {
      console.log(
        "PricingPlans: waitingForUserData is true and user exists, checking profile completeness"
      );
      const hasCompleteProfile =
        user?.name && user?.email && user?.phone && user?.dateOfBirth;

      console.log(
        "PricingPlans: User data updated, checking profile completeness:",
        {
          hasCompleteProfile,
          hasName: !!user?.name,
          hasEmail: !!user?.email,
          hasPhone: !!user?.phone,
          hasDateOfBirth: !!user?.dateOfBirth,
          userData: user,
          userMemberships: user?.memberships,
          userMembershipsType: typeof user?.memberships,
          userMembershipsArray: Array.isArray(user?.memberships),
        }
      );

      if (hasCompleteProfile) {
        // Step 1: Check if user already has active membership of same type (before opening payment modal)
        console.log("🔍 USEEFFECT DEBUG - Checking duplicate membership:", {
          selectedPlan: selectedPlan?.title,
          userMemberships: user?.memberships,
          userMembershipsCount: user?.memberships?.length || 0,
          userMembershipsExists: !!user?.memberships,
          conditionMet: !!(selectedPlan && user?.memberships),
        });

        if (selectedPlan && user?.memberships) {
          const planMembershipType = getMembershipType(selectedPlan.title);
          const hasExistingActivePlan = hasActiveMembershipOfType(
            planMembershipType,
            user.memberships
          );

          console.log("🔍 USEEFFECT DUPLICATE CHECK:", {
            planMembershipType,
            hasExistingActivePlan,
            memberships: user.memberships.map((m) => ({
              type: m.membershipType,
              status: m.status,
              matches:
                m.membershipType === planMembershipType &&
                m.status === MembershipStatus.ACTIVE,
            })),
          });

          if (hasExistingActivePlan) {
            console.log(
              "🚫 PricingPlans: User already has active membership of type:",
              planMembershipType,
              "in useEffect. Staying on membership page."
            );
            // Clear selected plan and stay on membership page
            setWaitingForUserData(false);
            setSelectedPlan(null);
            return;
          }
        }

        console.log(
          "PricingPlans: Profile complete and no duplicate membership, opening payment modal"
        );
        setWaitingForUserData(false);
        setShowPaymentModal(true);
      } else {
        console.log(
          "PricingPlans: Profile incomplete, not opening payment modal"
        );
      }
    } else if (waitingForUserData && !user) {
      console.log(
        "PricingPlans: waitingForUserData is true but user is null/undefined"
      );
    } else if (!waitingForUserData) {
      console.log(
        "PricingPlans: waitingForUserData is false, not checking profile completeness"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingForUserData, user]);

  // Map plan titles to integers
  const getMembershipType = (title: string): number => {
    if (title.includes("Individual")) return 1;
    if (title.includes("Family")) return 2;
    return 1; // default to Individual
  };

  // Helper function to check if user has active membership of specific type
  const hasActiveMembershipOfType = (
    membershipType: number,
    userMemberships?: Array<{ membershipType: number; status: number }>
  ): boolean => {
    if (!userMemberships) return false;
    return userMemberships.some(
      (membership) =>
        membership.membershipType === membershipType &&
        membership.status === MembershipStatus.ACTIVE
    );
  };

  // Helper function to get button text and state for a plan
  const getButtonConfig = (plan: PricingPlan) => {
    const planMembershipType = getMembershipType(plan.title);
    const isUserCurrentPlan = userMembershipTypes.includes(planMembershipType);

    if (isUserCurrentPlan) {
      return {
        text: "Your Existing Plan",
        disabled: true,
        className:
          "w-full h-12 md:h-14 lg:h-[56px] rounded-lg bg-[#666666] px-4 md:px-[60px] lg:px-[60px] py-3 md:py-4 mb-3 md:mb-4 cursor-not-allowed",
      };
    }

    return {
      text: plan.buttonText,
      disabled: false,
      className:
        "w-full h-12 md:h-14 lg:h-[56px] rounded-lg bg-[#00DBDC] px-4 md:px-[60px] lg:px-[60px] py-3 md:py-4 mb-3 md:mb-4 hover:bg-[#00DBDC]/90 transition-colors",
    };
  };

  const handlePlanSwitch = (index: number) => {
    setActivePlanIndex(index);
  };

  const handlePaymentClick = async (plan: PricingPlan) => {
    console.log("PricingPlans: handlePaymentClick called for plan:", plan);
    console.log("PricingPlans: Current auth state:", {
      isAuthenticated,
      userExists: !!user,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      userPhone: user?.phone,
      userDateOfBirth: user?.dateOfBirth,
    });

    setSelectedPlan(plan);

    // Step 1: Check if user is authenticated
    if (!isAuthenticated) {
      console.log("PricingPlans: User not authenticated, opening phone modal");
      console.log(
        "PricingPlans: Before setShowPhoneModal(true), current state:",
        {
          showPhoneModal,
          showPaymentModal,
          showUserInfoModal,
          selectedPlan: !!selectedPlan,
        }
      );

      // Force a clean state before opening phone modal
      setShowPaymentModal(false);
      setShowUserInfoModal(false);

      // Use callback pattern to ensure state updates
      setShowPhoneModal((prev) => {
        console.log(
          "PricingPlans: setShowPhoneModal callback, prev:",
          prev,
          "setting to: true"
        );
        return true;
      });

      return;
    }

    // Step 2: Check if user already has active membership of same type
    if (isAuthenticated && user?.memberships) {
      const planMembershipType = getMembershipType(plan.title);
      const hasExistingActivePlan = hasActiveMembershipOfType(
        planMembershipType,
        user.memberships
      );

      if (hasExistingActivePlan) {
        console.log(
          "PricingPlans: User already has active membership of type:",
          planMembershipType,
          "Blocking payment"
        );
        // Don't proceed to payment - user already has this type of membership
        return;
      }
    }

    // Step 3: Check if user has complete profile (name, email, phone)
    const hasCompleteProfile = user?.name && user?.email && user?.phone;
    if (!hasCompleteProfile) {
      console.log(
        "PricingPlans: User profile incomplete, opening user info modal"
      );
      console.log("PricingPlans: Profile check details:", {
        hasName: !!user?.name,
        hasEmail: !!user?.email,
        hasPhone: !!user?.phone,
        userData: user,
      });
      setShowUserInfoModal(true);
      return;
    }

    // Step 3: All checks passed, proceed to payment
    console.log("PricingPlans: All checks passed, opening payment modal");
    console.log("PricingPlans: Final user data:", user);
    setShowPaymentModal(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handlePaymentSuccess = async (
    paymentId: string,
    membershipData?: {
      id: number;
      membershipType: number;
      status: number; // Using integer status
      startDate: string;
      expiresAt: string;
      invoiceNumber?: string;
      orderId: number;
      paymentId: number;
    } | null
  ) => {
    console.log(
      "Payment successful for plan:",
      selectedPlan?.title,
      "Payment ID:",
      paymentId,
      "Membership Data:",
      membershipData
    );

    // Show loader while processing
    setIsPaymentProcessing(true);
    setShowPaymentModal(false);

    try {
      if (membershipData) {
        // ✅ OPTIMIZATION: Update Redux state directly with membership data
        console.log("🔄 Updating Redux state with new membership data...");

        // Update user's membership status in Redux
        updateUserData({
          hasMembership: true,
          membershipInfo: membershipData,
        });

        console.log("✅ Redux state updated, showing success modal...");
      } else {
        // Fallback: Fetch fresh user data if membership data not available
        console.log(
          "🔄 Fallback: Fetching fresh user data after successful payment..."
        );
        await fetchProfile();
      }

      // Hide loader and show success modal
      setIsPaymentProcessing(false);
      setPaymentResultType("success");
      setPaymentResultData({
        transactionId: paymentId,
        planName: selectedPlan?.title,
        discountAmount: selectedPlan?.originalPrice
          ? parseInt(selectedPlan.originalPrice.replace(/[^\d]/g, ""))
          : undefined,
      });
      setShowPaymentResultModal(true);

      // Clear selected plan
      setSelectedPlan(null);
    } catch (error) {
      console.error("❌ Error handling payment success:", error);

      // Hide loader and still show success modal even if there's an error updating state
      setIsPaymentProcessing(false);
      setPaymentResultType("success");
      setPaymentResultData({
        transactionId: paymentId,
        planName: selectedPlan?.title,
        discountAmount: selectedPlan?.originalPrice
          ? parseInt(selectedPlan.originalPrice.replace(/[^\d]/g, ""))
          : undefined,
      });
      setShowPaymentResultModal(true);
      setSelectedPlan(null);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment failed:", error);

    // Hide loader and close payment modal
    setIsPaymentProcessing(false);
    setShowPaymentModal(false);

    // Show failure modal
    setPaymentResultType("failure");
    setPaymentResultData({
      transactionId: error.includes("cancelled")
        ? "Payment Cancelled"
        : "Payment Failed",
    });
    setShowPaymentResultModal(true);

    // Don't clear selectedPlan here - keep it for retry functionality
    // setSelectedPlan(null);
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
  };

  const handleUserInfoModalClose = () => {
    setShowUserInfoModal(false);
  };

  const handlePaymentResultModalClose = () => {
    setShowPaymentResultModal(false);
    setPaymentResultData(null);
    setSelectedPlan(null); // Clear selected plan when modal is closed
  };

  const handleRetryPayment = () => {
    console.log("Retry payment clicked, selectedPlan:", selectedPlan);
    setShowPaymentResultModal(false);
    setPaymentResultData(null);
    // Reopen payment modal for retry
    if (selectedPlan) {
      console.log("Reopening payment modal for retry");
      setShowPaymentModal(true);
    } else {
      console.error("No selected plan available for retry");
    }
  };

  const handleGoHome = () => {
    setShowPaymentResultModal(false);
    setPaymentResultData(null);
    setSelectedPlan(null); // Clear selected plan when going home
    router.push("/");
  };

  const handlePhoneModalSuccess = (
    phoneNumber: string,
    userData?: {
      id?: number;
      name?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      memberships?: Array<{ membershipType: number; status: number }>;
    }
  ) => {
    setTempPhoneNumber(phoneNumber);
    setShowPhoneModal(false);

    // Use user data from callback instead of Redux state to avoid timing issues
    const userToCheck = userData || user;

    // Step 1: Check if user already has active membership of same type
    if (selectedPlan && userToCheck?.memberships) {
      const planMembershipType = getMembershipType(selectedPlan.title);

      console.log("🔍 DUPLICATE VALIDATION DEBUG:", {
        selectedPlan: selectedPlan.title,
        planMembershipType,
        userMemberships: userToCheck.memberships,
        userMembershipsCount: userToCheck.memberships.length,
      });

      const hasExistingActivePlan = hasActiveMembershipOfType(
        planMembershipType,
        userToCheck.memberships
      );

      console.log("🔍 DUPLICATE CHECK RESULT:", {
        hasExistingActivePlan,
        planMembershipType,
        memberships: userToCheck.memberships.map((m) => ({
          type: m.membershipType,
          status: m.status,
          matches:
            m.membershipType === planMembershipType &&
            m.status === MembershipStatus.ACTIVE,
        })),
      });

      if (hasExistingActivePlan) {
        console.log(
          "🚫 PricingPlans: User already has active membership of type:",
          planMembershipType,
          "after OTP verification. Staying on membership page."
        );
        // Clear selected plan and stay on membership page
        setSelectedPlan(null);
        return;
      }
    }

    // Step 2: Check profile completeness
    // Align profile completeness check with desktop flow: only name, email, phone are mandatory
    const hasCompleteProfile =
      userToCheck?.name && userToCheck?.email && userToCheck?.phone;

    console.log("PricingPlans: Profile completeness check with user data:", {
      userData: userData,
      reduxUser: user,
      hasCompleteProfile,
    });

    if (!hasCompleteProfile) {
      console.log(
        "PricingPlans: User profile incomplete, opening user info modal"
      );
      setShowUserInfoModal(true);
    } else {
      console.log(
        "PricingPlans: User has complete profile, proceeding to payment"
      );
      // User is authenticated and has complete profile, proceed to payment
      setShowPaymentModal(true);
    }
  };

  const handleUserInfoModalSuccess = () => {
    console.log("PricingPlans: handleUserInfoModalSuccess called");
    setShowUserInfoModal(false);
    // After successful profile completion, wait for Redux state to update
    console.log(
      "PricingPlans: Profile completion successful, waiting for user data update"
    );
    setWaitingForUserData(true);
    console.log("PricingPlans: waitingForUserData set to true");

    // Also check if we can proceed immediately
    setTimeout(() => {
      console.log(
        "PricingPlans: Checking if we can proceed immediately after UserInfoModal success"
      );

      if (user && user.name && user.email && user.phone) {
        // Step 1: Check if user already has active membership of same type (before opening payment modal)
        if (selectedPlan && user?.memberships) {
          const planMembershipType = getMembershipType(selectedPlan.title);
          const hasExistingActivePlan = hasActiveMembershipOfType(
            planMembershipType,
            user.memberships
          );

          if (hasExistingActivePlan) {
            console.log(
              "🚫 PricingPlans: User already has active membership of type:",
              planMembershipType,
              "after profile completion. Staying on membership page."
            );
            // Clear selected plan and stay on membership page
            setWaitingForUserData(false);
            setSelectedPlan(null);
            return;
          }
        }

        console.log(
          "PricingPlans: User data complete and no duplicate membership, opening payment modal"
        );
        setWaitingForUserData(false);
        setShowPaymentModal(true);
      } else {
        console.log(
          "PricingPlans: User data not yet complete, waiting for Redux update"
        );
      }
    }, 100);
  };

  if (isMobile) {
    return (
      <section className={`px-6 ${className}`}>
        <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto">
          <ScrollAnimation delay={0.2} direction="up">
            {/* Active Plan Card */}
            <div className="w-full">
              <div
                className="w-full rounded-[20px] p-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
                }}
              >
                <div
                  className="w-full rounded-[20px] flex flex-col items-center justify-center p-6"
                  style={{
                    background:
                      "linear-gradient(180deg, #111111 36.81%, #001011 94.04%)",
                  }}
                >
                  {/* Plan Selection Tabs - Inside the card */}
                  <ScrollAnimation delay={0.1} direction="up" distance={15}>
                    <div className="flex w-full mb-6">
                      <div className="flex w-full bg-[#111111] rounded-[12px] border border-[#00DBDC] overflow-hidden">
                        {plans.map((plan, index) => (
                          <button
                            key={index}
                            onClick={() => handlePlanSwitch(index)}
                            className={`flex-1 py-3 px-4 transition-all duration-200 font-medium text-base leading-5 tracking-[0px] text-center ${
                              activePlanIndex === index
                                ? "bg-[#00DBDC] text-[#111111]"
                                : "bg-transparent text-[#00DBDC] hover:bg-[#00DBDC]/10"
                            }`}
                          >
                            {plan.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </ScrollAnimation>

                  <div className="flex flex-col items-center text-center w-full">
                    {/* Discounted Price */}
                    <ScrollAnimation
                      key={`price-${activePlanIndex}`}
                      delay={0.1}
                      direction="up"
                      distance={15}
                    >
                      <div className="text-[40px] font-semibold leading-[100%] tracking-[0px] text-center text-[#00DBDC] mb-1">
                        {plans[activePlanIndex].discountedPrice}
                      </div>
                      {/* Exclusive of taxes - mobile */}
                      <div className="text-[12px] font-normal leading-4 tracking-[0px] text-center text-[#6A6A6A] mb-4 md:mt-[2px]">
                        Exclusive of taxes
                      </div>
                    </ScrollAnimation>

                    {/* Original Price Line */}
                    <ScrollAnimation
                      key={`original-${activePlanIndex}`}
                      delay={0.2}
                      direction="up"
                      distance={15}
                    >
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-base font-normal leading-[100%] tracking-[0px] text-center text-[#6A6A6A]">
                          <span className="line-through">
                            {plans[activePlanIndex].originalPrice}
                          </span>
                        </span>
                        <Image
                          src="/images/plans/discount-tag.svg"
                          alt="Discount"
                          width={104}
                          height={36}
                          className="w-16 h-6"
                        />
                      </div>
                    </ScrollAnimation>

                    {/* Divider Line */}
                    <div className="w-full border-t border-[#333333] mb-[33px]" />

                    {/* Limited Period Text */}
                    <ScrollAnimation
                      key={`limited-offer-${activePlanIndex}`}
                      delay={0.3}
                      direction="up"
                      distance={15}
                    >
                      <p className="text-sm font-light leading-5 tracking-[0px] text-center text-white mb-4">
                        Limited period offer for first{" "}
                        <span className="font-bold text-sm leading-5 tracking-[0px] text-center text-white">
                          {plans[activePlanIndex].limitedOfferCountText ||
                            "100 members"}
                        </span>
                      </p>
                    </ScrollAnimation>

                    {/* Button */}
                    <ScrollAnimation
                      key={`button-${activePlanIndex}`}
                      delay={0.4}
                      direction="up"
                      distance={15}
                      className="w-full mx-6"
                    >
                      <button
                        className={getButtonConfig(
                          plans[activePlanIndex]
                        ).className.replace("md:h-14 lg:h-[56px]", "h-12")}
                        onClick={() =>
                          getButtonConfig(plans[activePlanIndex]).disabled
                            ? undefined
                            : handlePaymentClick(plans[activePlanIndex])
                        }
                        disabled={
                          getButtonConfig(plans[activePlanIndex]).disabled
                        }
                      >
                        <span
                          className={`text-base font-medium leading-[100%] tracking-[-5%] ${
                            getButtonConfig(plans[activePlanIndex]).disabled
                              ? "text-[#CCCCCC]"
                              : "text-[#0D0D0D]"
                          }`}
                        >
                          {getButtonConfig(plans[activePlanIndex]).text}
                        </span>
                      </button>
                    </ScrollAnimation>

                    {/* Terms & conditions - mobile */}
                    <div className="text-[12px] font-normal leading-4 tracking-[0px] text-center underline text-[#6A6A6A] mt-[8px]">
                      <a href="/api/download/terms" rel="noopener noreferrer">
                        *Terms & conditions apply
                      </a>
                    </div>

                    {/* Seats Left */}
                    {plans[activePlanIndex].seatsLeft && (
                      <ScrollAnimation
                        key={`seats-${activePlanIndex}`}
                        delay={0.5}
                        direction="up"
                        distance={15}
                      >
                        <div className="flex items-center gap-2 mb-[16px]">
                          <Image
                            src="/images/plans/clock.svg"
                            alt="Clock"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-light leading-5 tracking-[0px] text-center text-[#0BFFB6]">
                            {plans[activePlanIndex].seatsLeft}
                          </span>
                        </div>
                      </ScrollAnimation>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Payment Modal */}
        {selectedPlan && showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={handlePaymentClose}
            membershipType={getMembershipType(selectedPlan.title)}
            amount={999} // Lock-in price for pre-booking advance
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        <PhoneNumberModal
          key={`mobile-phone-modal-${showPhoneModal}`}
          isOpen={showPhoneModal}
          onClose={handlePhoneModalClose}
          isMobile={true}
          onSuccess={handlePhoneModalSuccess}
        />
      </section>
    );
  }

  // Desktop/Tablet Layout (existing code)
  return (
    <section
      className={`flex flex-col items-center gap-6 md:gap-10 lg:gap-[40px] px-4 md:px-6 lg:px-8 md:-mt-[95px] ${className}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-[40px] w-full max-w-[1200px]">
        {plans.map((plan, index) => (
          <ScrollAnimation key={index} delay={0.2 + index * 0.1} direction="up">
            <div
              className="w-full lg:w-[580px] h-auto min-h-[400px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] p-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
              }}
            >
              <div
                className="w-full h-full rounded-[20px] md:rounded-[30px] lg:rounded-[40px] flex flex-col items-center justify-center p-4 md:p-6 lg:p-10"
                style={{
                  background:
                    "linear-gradient(180deg, #111111 36.81%, #001011 94.04%)",
                }}
              >
                <div className="flex flex-col items-center text-center w-full">
                  <h3
                    className={`text-lg md:text-xl lg:text-2xl font-light leading-[100%] tracking-[0px] text-white mb-2 md:mb-3 ${
                      plan.subtitle ? "lg:mb-3" : "lg:mb-[65px]"
                    }`}
                  >
                    {plan.title}
                  </h3>

                  {plan.subtitle && (
                    <div className="bg-[#1E1E1E] rounded px-2 md:px-3 py-1 mb-4 md:mb-6">
                      <span className="text-xs md:text-sm font-normal leading-4 md:leading-5 tracking-[0px] text-center text-white">
                        {plan.subtitle}
                      </span>
                    </div>
                  )}

                  <div className="text-3xl md:text-4xl lg:text-[60px] font-semibold leading-[100%] tracking-[0px] text-center text-[#00DBDC] mb-1 md:mb-[2px]">
                    {plan.discountedPrice}
                  </div>
                  {/* Exclusive of taxes - desktop */}
                  <div className="text-xs md:text-sm lg:text-base font-normal md:font-normal leading-4 md:leading-5 lg:leading-5 tracking-[0px] text-center text-[#6A6A6A] mb-4 md:mb-6 lg:mb-6 mt-[12px]">
                    Exclusive of taxes
                  </div>

                  <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-[24px]">
                    <span className="text-lg md:text-xl lg:text-2xl font-normal leading-[100%] tracking-[0px] text-center text-[#6A6A6A]">
                      <span className="line-through">{plan.originalPrice}</span>
                    </span>
                    <Image
                      src="/images/plans/discount-tag.svg"
                      alt="Discount"
                      width={104}
                      height={36}
                      className="w-16 md:w-20 lg:w-[104px] h-6 md:h-7 lg:h-[36px]"
                    />
                  </div>

                  <div className="w-full border-t border-[#333333] mb-6 md:mb-8 lg:mb-10" />

                  <ScrollAnimation
                    key={`limited-offer-desktop-${index}`}
                    delay={0.2 + index * 0.1}
                    direction="up"
                    distance={15}
                  >
                    <p className="text-sm md:text-base font-light leading-4 md:leading-5 tracking-[0px] text-center text-white mb-3 md:mb-4 px-2">
                      Limited period offer for first{" "}
                      <span className="font-bold text-sm md:text-base leading-4 md:leading-5 tracking-[0px] text-center text-white">
                        {plan.limitedOfferCountText || "100 members"}
                      </span>
                    </p>
                  </ScrollAnimation>

                  <button
                    className={getButtonConfig(plan).className}
                    onClick={() =>
                      getButtonConfig(plan).disabled
                        ? undefined
                        : handlePaymentClick(plan)
                    }
                    disabled={getButtonConfig(plan).disabled}
                  >
                    <span
                      className={`text-sm md:text-lg lg:text-xl font-medium leading-[100%] tracking-[-5%] ${
                        getButtonConfig(plan).disabled
                          ? "text-[#CCCCCC]"
                          : "text-[#0D0D0D]"
                      }`}
                    >
                      {getButtonConfig(plan).text}
                    </span>
                  </button>

                  {/* Terms & conditions - desktop */}
                  <div className="text-xs md:text-sm lg:text-base font-normal leading-4 md:leading-5 lg:leading-5 tracking-[0px] text-center text-[#6A6A6A] underline mt-6 md:mt-[26px] lg:mt-[26px]">
                    <a href="/api/download/terms" rel="noopener noreferrer">
                      *Terms & conditions apply
                    </a>
                  </div>

                  {plan.seatsLeft && (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/plans/clock.svg"
                        alt="Clock"
                        width={20}
                        height={20}
                        className="w-4 md:w-5 h-4 md:h-5"
                      />
                      <span className="text-sm md:text-base font-light leading-4 md:leading-5 tracking-[0px] text-center text-[#0BFFB6]">
                        {plan.seatsLeft}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedPlan && showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentClose}
          membershipType={getMembershipType(selectedPlan.title)}
          amount={999} // Lock-in price for pre-booking advance
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      <PhoneNumberModal
        key={`phone-modal-${showPhoneModal}`}
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        isMobile={isMobile}
        onSuccess={handlePhoneModalSuccess}
      />

      {/* User Info Modal */}
      <UserInfoModal
        isOpen={showUserInfoModal}
        onClose={handleUserInfoModalClose}
        isMobile={isMobile}
        phoneNumber={tempPhoneNumber}
        onParentClose={handleUserInfoModalClose}
        onSuccess={handleUserInfoModalSuccess}
      />

      {/* Payment Result Modal */}
      {paymentResultData && (
        <PaymentResultModal
          isOpen={showPaymentResultModal}
          onClose={handlePaymentResultModalClose}
          type={paymentResultType}
          transactionId={paymentResultData.transactionId}
          planName={paymentResultData.planName}
          discountAmount={paymentResultData.discountAmount}
          onRetryPayment={handleRetryPayment}
          onGoHome={handleGoHome}
        />
      )}

      <PaymentLoader
        isVisible={isPaymentProcessing}
        message="Processing your payment..."
      />

      {/* Membership Alert Modal - Removed: Users can now purchase multiple plans */}
    </section>
  );
};

export default PricingPlans;
