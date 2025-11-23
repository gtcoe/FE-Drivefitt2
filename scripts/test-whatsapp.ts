/*
  Test script to verify WhatsApp service functionality
  Run with: npm run test:whatsapp
*/

import { whatsappService } from "../src/lib/whatsappService";

async function testWhatsApp() {
  console.log("🧪 Testing WhatsApp service...");

  const testPhone = "8882311619";

  try {
    console.log(`📱 Sending test message to ${testPhone}...`);

    const result = await whatsappService.sendTestMessage(testPhone);

    if (result.success) {
      console.log("✅ WhatsApp test message sent successfully!");
      console.log("Response:", result.response);
    } else {
      console.error("❌ WhatsApp test failed:", result.error);
    }
  } catch (error) {
    console.error("❌ WhatsApp test error:", error);
  }
}

testWhatsApp().catch(console.error);








