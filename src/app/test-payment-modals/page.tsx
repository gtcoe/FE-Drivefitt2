"use client";
import { useState } from "react";
import PaymentResultModal from "@/components/common/PaymentResultModal";

export default function TestPaymentModalsPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const handleRetryPayment = () => {
    console.log("Retry payment clicked");
    setShowFailureModal(false);
  };

  const handleGoHome = () => {
    console.log("Go home clicked");
    setShowSuccessModal(false);
    setShowFailureModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Payment Modal Test Page
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => setShowSuccessModal(true)}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Test Success Modal
          </button>

          <button
            onClick={() => setShowFailureModal(true)}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Test Failure Modal
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Test Data:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Transaction ID: 6574578578</li>
            <li>• Plan: Individual Annual Plan</li>
            <li>• Discount Amount: ₹47,116</li>
          </ul>
        </div>
      </div>

      {/* Success Modal */}
      <PaymentResultModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        transactionId="6574578578"
        planName="Individual Annual Plan"
        discountAmount={47116}
        onGoHome={handleGoHome}
      />

      {/* Failure Modal */}
      <PaymentResultModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        type="failure"
        transactionId="6574578578"
        onRetryPayment={handleRetryPayment}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
