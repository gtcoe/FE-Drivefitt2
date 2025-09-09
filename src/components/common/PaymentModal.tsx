"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PaymentService } from "@/lib/paymentService";
import { RootState } from "@/store";
import PaymentLoader from "./PaymentLoader";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipType: number;
  amount: number;
  onSuccess?: (
    paymentId: string,
    membershipData?: {
      id: number;
      membershipType: number;
      status: "active" | "expired" | "cancelled" | "suspended";
      startDate: string;
      expiresAt: string;
      invoiceNumber?: string;
      orderId: number;
      paymentId: number;
    } | null
  ) => void;
  onError?: (error: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  membershipType,
  amount,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  // Since user is already authenticated and has complete profile (verified in PricingPlans),
  // we can directly use the user data from Redux
  const userDetails = {
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.phone || "",
  };

  // Automatically start payment when modal opens (user is already authenticated and has complete profile)
  useEffect(() => {
    console.log("PaymentModal: useEffect triggered", {
      isOpen,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      userPhone: user?.phone,
      userDateOfBirth: user?.dateOfBirth,
      userDetailsName: userDetails.name,
      userDetailsEmail: userDetails.email,
      userDetailsContact: userDetails.contact,
    });

    const hasCompleteProfile = user?.name && user?.email && user?.phone;

    console.log("PaymentModal: Profile completeness check", {
      hasCompleteProfile,
      hasUserDetails:
        userDetails.name && userDetails.email && userDetails.contact,
    });

    if (
      isOpen &&
      user?.id &&
      hasCompleteProfile &&
      userDetails.name &&
      userDetails.email &&
      userDetails.contact
    ) {
      console.log(
        "PaymentModal: Auto-starting payment for authenticated user with complete profile"
      );
      handlePayment();
    } else {
      console.log("PaymentModal: Not starting payment - conditions not met", {
        isOpen,
        hasUserId: !!user?.id,
        hasCompleteProfile,
        hasUserDetails:
          userDetails.name && userDetails.email && userDetails.contact,
      });
    }
  }, [
    isOpen,
    user?.id,
    user?.name,
    user?.email,
    user?.phone,
    user?.dateOfBirth,
    userDetails.name,
    userDetails.email,
    userDetails.contact,
  ]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await PaymentService.processPayment({
        amount,
        membershipType,
        userDetails: {
          ...userDetails,
          id: user.id,
        },
      });

      if (result.success) {
        onSuccess?.(result.paymentId!, result.membershipData); // ✅ Pass membership data
        onClose();
      } else {
        onError?.(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      onError?.(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <PaymentLoader
        isVisible={isProcessing}
        message="Processing your payment..."
      />
    </>
  );
}
