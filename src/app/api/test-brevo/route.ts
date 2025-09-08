import { NextResponse } from "next/server";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

export async function GET() {
  try {
    console.log("🧪 Testing Brevo API connectivity...");

    const results: {
      timestamp: string;
      environment: string;
      testResults: {
        environmentCheck: Record<string, string>;
        apiTest: {
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
        apiTest: { status: "" },
      },
    };

    // Test 1: Environment Variables
    console.log("🔍 Checking environment variables...");

    if (!process.env.BREVO_API_KEY) {
      results.testResults.apiTest = {
        status: "✗ Failed",
        error: "BREVO_API_KEY not set",
        details: { missing: "BREVO_API_KEY" },
      };
      return NextResponse.json({ success: false, results });
    }

    if (!process.env.SENDER_EMAIL) {
      results.testResults.apiTest = {
        status: "⚠️ Partial",
        error: "SENDER_EMAIL not set, using default",
        details: { missing: "SENDER_EMAIL" },
      };
    }

    // Test 2: Brevo API Connectivity
    console.log("📧 Testing Brevo API connectivity...");

    try {
      const startTime = Date.now();
      console.log(
        "⏱️ Starting API test at:",
        new Date(startTime).toISOString()
      );

      // Create a test email buffer
      const testEmailBuffer = Buffer.from(
        "Test invoice content for connectivity testing"
      );

      // Test the actual email sending function
      await sendMembershipSuccessEmail(
        {
          name: "Test User",
          email: process.env.NOTIFICATION_EMAIL || "test@example.com",
          phone: "1234567890",
        },
        {
          id: 999,
          membershipType: 1,
          status: "TEST",
          startDate: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          invoiceNumber: "TEST-CONN-001",
          orderId: 999,
          paymentId: 999,
        },
        testEmailBuffer
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log("✅ Brevo API test completed successfully");
      console.log("⏱️ Total duration:", duration, "ms");

      results.testResults.apiTest = {
        status: "✓ Success",
        message: "Brevo API connectivity test passed",
        details: {
          duration: `${duration}ms`,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          response: "Email sent successfully",
        },
      };
    } catch (apiError) {
      console.error("❌ Brevo API test failed:", apiError);

      const errorMessage =
        apiError instanceof Error ? apiError.message : String(apiError);
      const isTimeout = errorMessage.includes("timeout");
      const isNetworkError =
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ENOTFOUND");

      results.testResults.apiTest = {
        status: "✗ Failed",
        error: errorMessage,
        details: {
          errorType: isTimeout ? "timeout" : isNetworkError ? "network" : "api",
          isTimeout,
          isNetworkError,
          timestamp: new Date().toISOString(),
        },
      };
    }

    console.log("✅ Brevo connectivity test completed");
    console.log("📊 Test results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Brevo connectivity test completed",
      results,
    });
  } catch (error) {
    console.error("❌ Brevo connectivity test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Brevo connectivity test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
