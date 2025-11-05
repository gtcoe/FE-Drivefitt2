/*
  Test script to simulate complete payment flow with WhatsApp
  Run with: npm run test:complete-payment
*/

import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { generateInvoiceBuffer } from "../src/utils/invoiceGenerator";
import { s3Service } from "../src/lib/s3Service";
import { whatsappService } from "../src/lib/whatsappService";

async function testCompletePaymentFlow() {
  console.log("🧪 Testing Complete Payment Flow with WhatsApp...");

  try {
    // Step 1: Generate invoice (simulating payment verification)
    console.log("📄 Step 1: Generating invoice...");
    const invoiceData = {
      invoiceNumber: `PAYMENT-TEST-${Date.now()}`,
      invoiceDate: new Date().toLocaleDateString("en-IN"),
      customerName: "Test User",
      customerEmail: "test@example.com",
      customerPhone: "8882311619",
      amount: 999.0,
      membershipType: "Individual Annual Plan",
      paymentId: "pay_TEST123",
      orderId: "order_TEST123",
    };

    const invoiceBuffer = generateInvoiceBuffer(invoiceData);
    console.log("✅ Invoice generated, size:", invoiceBuffer.length, "bytes");

    // Step 2: Upload to S3
    console.log("☁️ Step 2: Uploading invoice to S3...");
    const s3Result = await s3Service.uploadInvoice(
      invoiceBuffer,
      invoiceData.invoiceNumber
    );

    let invoiceUrl: string | undefined;
    if (s3Result.success && s3Result.url) {
      invoiceUrl = s3Result.url;
      console.log("✅ Invoice uploaded to S3 successfully:", invoiceUrl);
    } else {
      console.error("❌ S3 upload failed:", s3Result.error);
      console.log("🔄 Using fallback URL...");
      invoiceUrl =
        "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf";
    }

    // Step 3: Send WhatsApp notification
    console.log("📱 Step 3: Sending WhatsApp notification...");
    const whatsappResult = await whatsappService.sendInvoiceDocument({
      customerName: invoiceData.customerName,
      customerPhone: invoiceData.customerPhone,
      invoiceUrl: invoiceUrl,
      receiptNumber: invoiceData.invoiceNumber,
      membershipType: invoiceData.membershipType,
      balancePaymentDate: "29th Dec 2025",
    });

    if (whatsappResult.success) {
      console.log("✅ WhatsApp notification sent successfully!");
      console.log("📱 Response:", whatsappResult.response);
      console.log("🎉 Complete payment flow test PASSED!");
    } else {
      console.error("❌ WhatsApp notification failed:", whatsappResult.error);
      console.log("💥 Complete payment flow test FAILED!");
    }
  } catch (error) {
    console.error("❌ Complete payment flow test error:", error);
  }
}

testCompletePaymentFlow().catch(console.error);




