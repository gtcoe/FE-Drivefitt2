"use client";
import { useEffect } from "react";

interface PaymentSuccessProps {
  paymentId: string;
  membershipType: string;
  amount: number;
  onClose: () => void;
}

export default function PaymentSuccess({
  paymentId,
  membershipType,
  amount,
  onClose,
}: PaymentSuccessProps) {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl text-center">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Your membership has been activated successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Membership Type:</span>
              <span className="font-semibold">{membershipType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono text-xs">{paymentId}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print Receipt
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          A confirmation email has been sent to your registered email address.
        </div>
      </div>
    </div>
  );
}
