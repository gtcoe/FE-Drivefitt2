"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchProfile } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
    signature: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Get payment details from URL parameters
    const paymentId = searchParams.get("razorpay_payment_id");
    const orderId = searchParams.get("razorpay_order_id");
    const signature = searchParams.get("razorpay_signature");

    if (paymentId && orderId && signature) {
      setPaymentDetails({
        paymentId,
        orderId,
        signature,
      });

      // Verify payment on the server
      verifyPayment(paymentId, orderId, signature);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (
    paymentId: string,
    orderId: string,
    signature: string
  ) => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          userDetails: {
            id: 1, // Test user ID
            name: "User",
            email: "user@example.com",
            contact: "9876543210",
            membership_type: 1, // 1 = Individual Annual Plan
          },
        }),
      });

      const result = await response.json();
      console.log("Payment verification result:", result);

      if (result.success) {
        setVerificationComplete(true);

        // Fetch fresh user data including new membership information
        try {
          console.log(
            "🔄 Fetching fresh user data after successful payment verification..."
          );
          await fetchProfile();

          // Wait a moment for Redux state to update
          await new Promise((resolve) => setTimeout(resolve, 500));

          console.log(
            "✅ Fresh user data fetched, redirecting to profile page..."
          );

          // Redirect to profile page where updated membership data will be visible
          router.push("/profile");
        } catch (error) {
          console.error(
            "❌ Error fetching fresh user data after payment:",
            error
          );

          // Even if fetching fails, still redirect to profile page
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Payment verified! Redirecting to profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your payment. Your membership has been activated.
          </p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Payment Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Payment ID: {paymentDetails.paymentId}</p>
              <p>Order ID: {paymentDetails.orderId}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Profile
          </button>
          <button
            onClick={() => router.push("/membership")}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Membership
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
