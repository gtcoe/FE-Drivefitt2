import { NextResponse } from "next/server";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

export async function GET() {
  try {
    console.log("🧪 AGGRESSIVE Brevo API test - simulating payment flow...");

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

    // Test 2: Simulate exact payment verification flow
    console.log("📧 Testing Brevo API with payment verification simulation...");

    try {
      const startTime = Date.now();
      console.log(
        "⏱️ Starting aggressive API test at:",
        new Date(startTime).toISOString()
      );

      // Create a test email buffer (similar to invoice generation)
      const testEmailBuffer = Buffer.from(
        "Test invoice content for aggressive testing - simulating real payment flow"
      );

      // Test with the EXACT same parameters as payment verification
      const testPromise = sendMembershipSuccessEmail(
        {
          name: "Test User - Aggressive",
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
          invoiceNumber: "TEST-AGGRESSIVE-001",
          orderId: 999,
          paymentId: 999,
        },
        testEmailBuffer
      );

      // Add our own timeout wrapper to see what happens
      const aggressiveTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.log(
            "🚨 AGGRESSIVE TIMEOUT: Our custom timeout triggered after 35 seconds"
          );
          reject(new Error("Aggressive timeout after 35 seconds"));
        }, 35000);
      });

      // Race between our timeout and the email function
      await Promise.race([testPromise, aggressiveTimeout]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log("✅ Aggressive Brevo API test completed successfully");
      console.log("⏱️ Total duration:", duration, "ms");

      results.testResults.apiTest = {
        status: "✓ Success",
        message: "Aggressive Brevo API test passed",
        details: {
          duration: `${duration}ms`,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          response: "Email sent successfully",
          testType: "aggressive",
        },
      };
    } catch (apiError) {
      console.error("❌ Aggressive Brevo API test failed:", apiError);

      const errorMessage =
        apiError instanceof Error ? apiError.message : String(apiError);
      const isTimeout = errorMessage.includes("timeout");
      const isNetworkError =
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ENOTFOUND");
      const isAggressiveTimeout = errorMessage.includes("Aggressive timeout");

      results.testResults.apiTest = {
        status: "✗ Failed",
        error: errorMessage,
        details: {
          errorType: isTimeout
            ? "timeout"
            : isNetworkError
            ? "network"
            : isAggressiveTimeout
            ? "aggressive_timeout"
            : "api",
          isTimeout,
          isNetworkError,
          isAggressiveTimeout,
          timestamp: new Date().toISOString(),
        },
      };
    }

    console.log("✅ Aggressive Brevo connectivity test completed");
    console.log("📊 Test results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Aggressive Brevo connectivity test completed",
      results,
    });
  } catch (error) {
    console.error("❌ Aggressive Brevo connectivity test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Aggressive Brevo connectivity test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
