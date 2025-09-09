import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

interface ServiceResults {
  environmentVariables: Record<string, string>;
  database: {
    status: string;
    testQuery?: unknown;
    error?: string;
  };
  brevo: {
    status: string;
    message?: string;
    reason?: string;
    error?: string;
  };
  pdfGeneration: {
    status: string;
    bufferSize?: number;
    testData?: unknown;
    error?: string;
  };
}

export async function GET() {
  try {
    console.log("🧪 Testing services endpoint called");

    const results: {
      timestamp: string;
      environment: string;
      services: ServiceResults;
    } = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      services: {
        environmentVariables: {},
        database: { status: "" },
        brevo: { status: "" },
        pdfGeneration: { status: "" },
      },
    };

    // Test 1: Environment Variables
    console.log("🔍 Checking environment variables...");
    results.services.environmentVariables = {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? "✓ Set" : "✗ Not Set",
      SENDER_EMAIL: process.env.SENDER_EMAIL ? "✓ Set" : "✗ Not Set",
      DB_HOST: process.env.DB_HOST ? "✓ Set" : "✗ Not Set",
      DB_USER: process.env.DB_USER ? "✓ Set" : "✗ Not Set",
      DB_NAME: process.env.DB_NAME ? "✓ Set" : "✗ Not Set",
      NODE_ENV: process.env.NODE_ENV || "Not Set",
    };

    // Test 2: Database Connection
    console.log("🗄️ Testing database connection...");
    try {
      const dbTest = await executeQuery("SELECT 1 as test");
      results.services.database = {
        status: "✓ Connected",
        testQuery: dbTest,
      };
    } catch (dbError) {
      results.services.database = {
        status: "✗ Connection Failed",
        error: dbError instanceof Error ? dbError.message : String(dbError),
      };
    }

    // Test 3: Brevo API (if API key is set)
    console.log("📧 Testing Brevo API...");
    if (process.env.BREVO_API_KEY) {
      try {
        // Send a test email to verify API works
        const testEmailBuffer = Buffer.from("Test invoice content");
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
            invoiceNumber: "TEST-INV-001",
            orderId: 999,
            paymentId: 999,
          },
          testEmailBuffer
        );

        results.services.brevo = {
          status: "✓ API Working",
          message: "Test email sent successfully",
        };
      } catch (brevoError) {
        results.services.brevo = {
          status: "✗ API Failed",
          error:
            brevoError instanceof Error
              ? brevoError.message
              : String(brevoError),
        };
      }
    } else {
      results.services.brevo = {
        status: "⚠️ Skipped",
        reason: "BREVO_API_KEY not set",
      };
    }

    // Test 4: PDF Generation
    console.log("📄 Testing PDF generation...");
    try {
      const { generateInvoiceBuffer } = await import(
        "@/utils/invoiceGenerator"
      );
      const testInvoiceData = {
        invoiceNumber: "TEST-INV-001",
        invoiceDate: new Date().toLocaleDateString("en-IN"),
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "9876543210",
        amount: 999.0,
        membershipType: "Individual Annual Plan",
        paymentId: "test_payment_123",
        orderId: "test_order_123",
      };

      const pdfBuffer = generateInvoiceBuffer(testInvoiceData);
      results.services.pdfGeneration = {
        status: "✓ Working",
        bufferSize: pdfBuffer.length,
        testData: testInvoiceData,
      };
    } catch (pdfError) {
      results.services.pdfGeneration = {
        status: "✗ Failed",
        error: pdfError instanceof Error ? pdfError.message : String(pdfError),
      };
    }

    console.log("✅ All service tests completed");
    console.log("📊 Test results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Service tests completed",
      results,
    });
  } catch (error) {
    console.error("❌ Service test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Service test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
