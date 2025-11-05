/*
  Test script to simulate payment verification WhatsApp flow
  Run with: npm run test:payment-whatsapp
*/

import { whatsappService } from "../src/lib/whatsappService";

async function testPaymentWhatsApp() {
  console.log("🧪 Testing Payment WhatsApp flow...");

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
    console.log("📱 Sending WhatsApp message with payment data...");
    console.log("📋 Test data:", testData);

    const result = await whatsappService.sendInvoiceDocument(testData);

    if (result.success) {
      console.log("✅ Payment WhatsApp test sent successfully!");
      console.log("Response:", result.response);
    } else {
      console.error("❌ Payment WhatsApp test failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Payment WhatsApp test error:", error);
  }
}

testPaymentWhatsApp().catch(console.error);
