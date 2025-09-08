"use client";

interface PaymentErrorProps {
  error: string;
  onClose: () => void;
  onRetry?: () => void;
}

export default function PaymentError({
  error,
  onClose,
  onRetry,
}: PaymentErrorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t process your payment. Please try again.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">Error Details:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          If the problem persists, please contact our support team.
        </div>
      </div>
    </div>
  );
}
