/*
  Test script to simulate complete payment verification flow
  Run with: npm run test:payment-verification
*/

import { whatsappService } from "../src/lib/whatsappService";

async function testPaymentVerification() {
  console.log("🧪 Testing Payment Verification WhatsApp flow...");

  // Simulate the exact data structure from payment verification
  const testData = {
    customerName: "Test User",
    customerPhone: "8882311619", // 10-digit format as stored in database
    invoiceUrl:
      "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf",
    receiptNumber: "TEST-12345",
    membershipType: "Individual Annual Plan",
    balancePaymentDate: "29th Dec 2025",
  };

  try {
    console.log("📱 Simulating payment verification WhatsApp flow...");
    console.log("📋 Test data:", testData);

    // This simulates the exact flow from payment verification
    console.log("📱 Sending WhatsApp invoice document...");

    const whatsappResult = await whatsappService.sendInvoiceDocument(testData);

    if (whatsappResult.success) {
      console.log("✅ WhatsApp invoice document sent successfully");
      console.log("Response:", whatsappResult.response);
    } else {
      console.error("❌ WhatsApp sending failed:", whatsappResult.error);
    }
  } catch (whatsappError) {
    console.error("❌ WhatsApp service error:", whatsappError);
  }
}

testPaymentVerification().catch(console.error);
