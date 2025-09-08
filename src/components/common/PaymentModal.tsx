"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { PaymentService } from "@/lib/paymentService";
import { RootState } from "@/store";

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
  // const [isLoading, setIsLoading] = useState(false);

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

    const hasCompleteProfile =
      user?.name && user?.email && user?.phone;

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
    // Skip form validation since user is already authenticated and validated
    // setIsLoading(true);

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
      // setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // return (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //     <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-xl font-bold text-gray-800">
  //           {membershipType} Membership
  //         </h2>
  //         <button
  //           onClick={onClose}
  //           className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
  //           disabled={isLoading}
  //         >
  //           ×
  //         </button>
  //       </div>

  //       <div className="mb-6 p-4 bg-blue-50 rounded-lg">
  //         <p className="text-lg font-semibold text-blue-800">
  //           Amount: ₹{amount.toLocaleString()}
  //         </p>
  //         <p className="text-sm text-blue-600">
  //           Complete your payment to activate membership
  //         </p>
  //       </div>

  //       <div className="text-center py-8">
  //         <div className="flex flex-col items-center space-y-4">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //           <div>
  //             <h3 className="text-lg font-semibold text-gray-800 mb-2">
  //               Opening Payment Gateway...
  //             </h3>
  //             <p className="text-sm text-gray-600">
  //               Please wait while we redirect you to complete your payment
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="flex justify-center mt-6">
  //         <button
  //           onClick={onClose}
  //           className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
  //           disabled={isLoading}
  //         >
  //           Cancel
  //         </button>
  //       </div>

  //       <div className="mt-4 text-xs text-gray-500 text-center">
  //         Your payment is secured by Razorpay. We never store your payment
  //         details.
  //       </div>
  //     </div>
  //   </div>
  // );
  return null;
}
