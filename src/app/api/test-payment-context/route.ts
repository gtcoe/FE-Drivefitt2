import { NextResponse } from "next/server";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

export async function GET() {
  try {
    console.log(
      "🧪 Testing payment verification context - simulating exact flow..."
    );

    const results: {
      timestamp: string;
      environment: string;
      testResults: {
        environmentCheck: Record<string, string>;
        paymentContextTest: {
          status: string;
          message?: string;
          error?: string;
          details?: Record<string, unknown>;
        };
      };
    } = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      testResults: {
        environmentCheck: {
          BREVO_API_KEY: process.env.BREVO_API_KEY ? "✓ Set" : "✗ Not Set",
          SENDER_EMAIL: process.env.SENDER_EMAIL ? "✓ Set" : "✗ Not Set",
          NODE_ENV: process.env.NODE_ENV || "Not Set",
        },
        paymentContextTest: { status: "" },
      },
    };

    // Test 1: Environment Variables
    console.log("🔍 Checking environment variables...");

    if (!process.env.BREVO_API_KEY) {
      results.testResults.paymentContextTest = {
        status: "✗ Failed",
        error: "BREVO_API_KEY not set",
        details: { missing: "BREVO_API_KEY" },
      };
      return NextResponse.json({ success: false, results });
    }

    // Test 2: Simulate EXACT payment verification context
    console.log("📧 Testing email sending in payment verification context...");

    try {
      const startTime = Date.now();
      const startTimestamp = new Date().toISOString();
      console.log("⏱️ Starting payment context test at:", startTimestamp);

      // Simulate the exact flow from payment verification
      console.log("📄 Simulating invoice generation...");
      const invoiceBuffer = Buffer.from(
        "Simulated invoice content for payment context testing"
      );
      console.log(
        "✅ Invoice buffer created, size:",
        invoiceBuffer.length,
        "bytes"
      );

      // Simulate the exact membership data structure
      const membershipData = {
        id: 999,
        membershipType: 1,
        status: "TEST",
        startDate: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        invoiceNumber: "TEST-PAYMENT-CTX-001",
        orderId: 999,
        paymentId: 999,
      };

      console.log("📋 Membership data prepared:", membershipData);

      // Simulate the exact user data structure
      const userData = {
        name: "Test User - Payment Context",
        email: process.env.NOTIFICATION_EMAIL || "test@example.com",
        phone: "1234567890",
      };

      console.log("👤 User data prepared:", userData);

      // NOW TEST THE EXACT EMAIL FUNCTION CALL
      console.log(
        "🚀 Calling sendMembershipSuccessEmail in payment context..."
      );
      await sendMembershipSuccessEmail(userData, membershipData, invoiceBuffer);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const endTimestamp = new Date().toISOString();

      console.log("✅ Payment context test completed successfully");
      console.log("⏱️ Total duration:", duration, "ms");
      console.log("📅 Success timestamp:", endTimestamp);

      results.testResults.paymentContextTest = {
        status: "✓ Success",
        message: "Payment context test passed - email sent successfully",
        details: {
          duration: `${duration}ms`,
          startTime: startTimestamp,
          endTime: endTimestamp,
          response: "Email sent successfully",
          testType: "payment_context",
          invoiceSize: invoiceBuffer.length,
          membershipData,
          userData,
        },
      };
    } catch (apiError) {
      console.error("❌ Payment context test failed:", apiError);

      const errorMessage =
        apiError instanceof Error ? apiError.message : String(apiError);
      const isTimeout = errorMessage.includes("timeout");
      const isNetworkError =
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ENOTFOUND");

      results.testResults.paymentContextTest = {
        status: "✗ Failed",
        error: errorMessage,
        details: {
          errorType: isTimeout ? "timeout" : isNetworkError ? "network" : "api",
          isTimeout,
          isNetworkError,
          timestamp: new Date().toISOString(),
          testType: "payment_context",
        },
      };
    }

    console.log("✅ Payment context test completed");
    console.log("📊 Test results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Payment context test completed",
      results,
    });
  } catch (error) {
    console.error("❌ Payment context test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Payment context test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
