import { NextRequest, NextResponse } from "next/server";
import { easySocialService } from "@/lib/easySocialService";
import { gupshupService } from "@/lib/gupshupService";

/**
 * POST /api/test/invoice
 * Test endpoint for invoice WhatsApp delivery
 *
 * Body:
 * {
 *   "phone": "9876543210",
 *   "customerName": "John Doe",
 *   "invoiceUrl": "https://example.com/invoice.pdf",
 *   "service": "easysocial" | "gupshup" (optional, defaults to "easysocial")
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      phone,
      customerName,
      invoiceUrl,
      service = "easysocial",
    } = body;

    // Validate required fields
    if (!phone || !customerName || !invoiceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: phone, customerName, invoiceUrl",
        },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone number. Must be 10 digits.",
        },
        { status: 400 }
      );
    }

    // Validate invoice URL
    if (!invoiceUrl.startsWith("http")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid invoice URL. Must start with http/https.",
        },
        { status: 400 }
      );
    }

    console.log(
      `🧪 Testing invoice delivery via ${service} for ${customerName} (${phone})`
    );

    const invoiceData = {
      customerName,
      customerPhone: phone,
      invoiceUrl,
    };

    let result;

    // Send via selected service
    if (service === "gupshup") {
      result = await gupshupService.sendInvoice(invoiceData);
    } else {
      result = await easySocialService.sendInvoice(invoiceData);
    }

    console.log(`📊 Invoice delivery result:`, result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Invoice sent successfully via ${service}`,
        data: {
          service,
          phone,
          customerName,
          invoiceUrl,
          messageId: result.messageId,
        },
        response: result.response,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to send invoice via ${service}`,
          details: result.response,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Test invoice API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/test/invoice
 * Get test endpoint information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/test/invoice",
    method: "POST",
    description: "Test invoice WhatsApp delivery",
    body: {
      phone: "10-digit phone number",
      customerName: "Customer full name",
      invoiceUrl: "Full URL to invoice PDF",
      service: "easysocial or gupshup (optional, defaults to easysocial)",
    },
    example: {
      phone: "9876543210",
      customerName: "John Doe",
      invoiceUrl:
        "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice.pdf",
      service: "easysocial",
    },
    curlExamples: {
      easysocial: `curl -X POST http://localhost:3000/api/test/invoice \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "9876543210",
    "customerName": "John Doe",
    "invoiceUrl": "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice.pdf",
    "service": "easysocial"
  }'`,
      gupshup: `curl -X POST http://localhost:3000/api/test/invoice \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "9876543210",
    "customerName": "John Doe",
    "invoiceUrl": "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice.pdf",
    "service": "gupshup"
  }'`,
    },
  });
}
