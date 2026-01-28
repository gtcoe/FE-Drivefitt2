"use client";

import { useState } from "react";

export default function TestInvoicePage() {
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState(
    "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf"
  );
  const [service, setService] = useState<"easysocial" | "gupshup">(
    "easysocial"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          customerName,
          invoiceUrl,
          service,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test Invoice WhatsApp Delivery
          </h1>

          <div className="space-y-4">
            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number (10 digits)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                maxLength={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* Customer Name Input */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* Invoice URL Input */}
            <div>
              <label
                htmlFor="invoiceUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice PDF URL
              </label>
              <input
                type="url"
                id="invoiceUrl"
                value={invoiceUrl}
                onChange={(e) => setInvoiceUrl(e.target.value)}
                placeholder="https://example.com/invoice.pdf"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Service
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="easysocial"
                    checked={service === "easysocial"}
                    onChange={(e) =>
                      setService(e.target.value as "easysocial" | "gupshup")
                    }
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">EasySocial</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="gupshup"
                    checked={service === "gupshup"}
                    onChange={(e) =>
                      setService(e.target.value as "easysocial" | "gupshup")
                    }
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Gupshup</span>
                </label>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={
                loading || !phone || !customerName || !invoiceUrl
              }
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Send Test Invoice"}
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Result:
              </h2>
              <div
                className={`p-4 rounded-md ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {result.success ? (
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 w-full">
                    <h3
                      className={`text-sm font-medium ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.success ? "Success!" : "Failed"}
                    </h3>
                    <div
                      className={`mt-2 text-sm ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900">
              Instructions:
            </h3>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Enter a valid 10-digit phone number</li>
              <li>Enter the customer&apos;s full name</li>
              <li>
                Provide a valid invoice PDF URL (must be publicly accessible)
              </li>
              <li>Select the WhatsApp service (EasySocial or Gupshup)</li>
              <li>Click &quot;Send Test Invoice&quot; to test the delivery</li>
              <li>
                Check your WhatsApp for the invoice message with the PDF
                attachment
              </li>
            </ul>
          </div>

          {/* API Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">API Endpoint:</h3>
            <p className="mt-1 text-sm text-gray-600">
              <code className="bg-gray-100 px-2 py-1 rounded">
                POST /api/test/invoice
              </code>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              You can also test directly via curl or Postman using the endpoint
              above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
