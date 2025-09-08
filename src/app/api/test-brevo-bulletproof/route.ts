import { NextResponse } from "next/server";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

export async function GET() {
  try {
    console.log(
      "🧪 BULLETPROOF Brevo API test - will definitely show the issue..."
    );

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

    // Test 2: BULLETPROOF test with multiple timeout mechanisms
    console.log("📧 BULLETPROOF Brevo API test with multiple timeouts...");

    // MULTIPLE TIMEOUT MECHANISMS - declare outside try block
    let primaryTimeoutId: NodeJS.Timeout | undefined;
    let secondaryTimeoutId: NodeJS.Timeout | undefined;
    let nuclearTimeoutId: NodeJS.Timeout | undefined;
    let heartbeatId: NodeJS.Timeout | undefined;

    try {
      const startTime = Date.now();
      const startTimestamp = new Date().toISOString();
      console.log("⏱️ Starting bulletproof test at:", startTimestamp);

      // Create a test email buffer
      const testEmailBuffer = Buffer.from(
        "Test invoice content for bulletproof testing"
      );

      // Primary timeout (25 seconds)
      const primaryTimeout = new Promise<never>((_, reject) => {
        primaryTimeoutId = setTimeout(() => {
          const timeoutTimestamp = new Date().toISOString();
          const elapsed = Date.now() - startTime;
          console.log(
            "⏰ PRIMARY TIMEOUT at:",
            timeoutTimestamp,
            "- Elapsed:",
            elapsed,
            "ms"
          );
          reject(new Error("Primary timeout after 25 seconds"));
        }, 25000);
      });

      // Secondary timeout (30 seconds) - backup
      const secondaryTimeout = new Promise<never>((_, reject) => {
        secondaryTimeoutId = setTimeout(() => {
          const timeoutTimestamp = new Date().toISOString();
          const elapsed = Date.now() - startTime;
          console.log(
            "⏰ SECONDARY TIMEOUT at:",
            timeoutTimestamp,
            "- Elapsed:",
            elapsed,
            "ms"
          );
          reject(new Error("Secondary timeout after 30 seconds"));
        }, 30000);
      });

      // Nuclear timeout (40 seconds) - will definitely fire
      const nuclearTimeout = new Promise<never>((_, reject) => {
        nuclearTimeoutId = setTimeout(() => {
          const timeoutTimestamp = new Date().toISOString();
          const elapsed = Date.now() - startTime;
          console.log(
            "☢️ NUCLEAR TIMEOUT at:",
            timeoutTimestamp,
            "- Elapsed:",
            elapsed,
            "ms"
          );
          console.log("☢️ This means ALL timeout mechanisms failed!");
          reject(new Error("Nuclear timeout after 40 seconds"));
        }, 40000);
      });

      // Heartbeat every 2 seconds
      heartbeatId = setInterval(() => {
        const now = new Date().toISOString();
        const elapsed = Date.now() - startTime;
        console.log("💓 Heartbeat at:", now, "- Elapsed:", elapsed, "ms");
      }, 2000);

      // Test the email function
      const emailPromise = sendMembershipSuccessEmail(
        {
          name: "Test User - Bulletproof",
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
          invoiceNumber: "TEST-BULLETPROOF-001",
          orderId: 999,
          paymentId: 999,
        },
        testEmailBuffer
      );

      // RACE ALL THE TIMEOUTS
      console.log("🏁 Starting race between email and ALL timeouts...");
      await Promise.race([
        emailPromise,
        primaryTimeout,
        secondaryTimeout,
        nuclearTimeout,
      ]);

      // Cleanup all timeouts and heartbeat
      clearTimeout(primaryTimeoutId);
      clearTimeout(secondaryTimeoutId);
      clearTimeout(nuclearTimeoutId);
      clearInterval(heartbeatId);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const endTimestamp = new Date().toISOString();

      console.log("✅ BULLETPROOF test completed successfully");
      console.log("⏱️ Total duration:", duration, "ms");
      console.log("📅 Success timestamp:", endTimestamp);

      results.testResults.apiTest = {
        status: "✓ Success",
        message: "Bulletproof test passed - email sent successfully",
        details: {
          duration: `${duration}ms`,
          startTime: startTimestamp,
          endTime: endTimestamp,
          response: "Email sent successfully",
          testType: "bulletproof",
          timeoutsUsed: "none",
        },
      };
    } catch (apiError) {
      console.error("❌ BULLETPROOF test failed:", apiError);

      const errorMessage =
        apiError instanceof Error ? apiError.message : String(apiError);
      const isPrimaryTimeout = errorMessage.includes("Primary timeout");
      const isSecondaryTimeout = errorMessage.includes("Secondary timeout");
      const isNuclearTimeout = errorMessage.includes("Nuclear timeout");
      const isNetworkError =
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ENOTFOUND");

      // Cleanup any remaining timeouts
      if (typeof primaryTimeoutId !== "undefined")
        clearTimeout(primaryTimeoutId);
      if (typeof secondaryTimeoutId !== "undefined")
        clearTimeout(secondaryTimeoutId);
      if (typeof nuclearTimeoutId !== "undefined")
        clearTimeout(nuclearTimeoutId);
      if (typeof heartbeatId !== "undefined") clearInterval(heartbeatId);

      results.testResults.apiTest = {
        status: "✗ Failed",
        error: errorMessage,
        details: {
          errorType: isPrimaryTimeout
            ? "primary_timeout"
            : isSecondaryTimeout
            ? "secondary_timeout"
            : isNuclearTimeout
            ? "nuclear_timeout"
            : isNetworkError
            ? "network"
            : "api",
          isPrimaryTimeout,
          isSecondaryTimeout,
          isNuclearTimeout,
          isNetworkError,
          timestamp: new Date().toISOString(),
          testType: "bulletproof",
        },
      };
    }

    console.log("✅ BULLETPROOF test completed");
    console.log("📊 Test results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Bulletproof Brevo test completed",
      results,
    });
  } catch (error) {
    console.error("❌ BULLETPROOF test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Bulletproof test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
