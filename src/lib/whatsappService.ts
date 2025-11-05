interface WhatsAppConfig {
  userid: string;
  password: string;
  baseURL: string;
}

interface WhatsAppMessageData {
  customerName: string;
  customerPhone: string;
  invoiceUrl: string;
  receiptNumber: string;
  membershipType: string;
  balancePaymentDate: string;
}

class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      userid: "2000259058", // Use the working credentials
      password: "mC71NVlB9", // Use the working credentials
      baseURL: "https://mediaapi.smsgupshup.com/GatewayAPI/rest",
    };
  }

  private formatMessage(data: WhatsAppMessageData): string {
    const { customerName } = data;

    // Create the message with proper formatting
    const message = `Hi+${customerName}%2C%0AThank+you+for+joining+the+Drive+FITT+family%21+%F0%9F%8F%8F%F0%9F%92%AA%0A%0APlease+find+your+receipt+voucher+attached+for+the+pre-booking+advance.+%F0%9F%8E%89%0AYour+membership+price+is+now+locked+in+at+the+discounted+rate+%E2%80%94+just+complete+the+balance+payment+by+29th+Dec+2025+to+keep+it+active.%0A%0AWe%E2%80%99re+excited+to+have+you+onboard+at+Drive+FITT+%F0%9F%9A%80%0A%0A%E2%80%94+Team+Drive+FITT`;

    // Properly URL encode the entire message
    return message;
  }

  async sendInvoiceDocument(
    data: WhatsAppMessageData
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log(
        "📱 Sending WhatsApp invoice document to:",
        data.customerPhone
      );

      const message = this.formatMessage(data);
      const url = `${this.config.baseURL}?userid=${
        this.config.userid
      }&password=${this.config.password}&send_to=${
        data.customerPhone
      }&v=1.1&format=json&msg_type=DOCUMENT&method=SENDMEDIAMESSAGE&caption=${message}&media_url=${encodeURIComponent(
        data.invoiceUrl
      )}`;

      console.log("📱 WhatsApp API URL:", url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📱 WhatsApp response:", result);

      // Handle different response formats
      if (
        typeof result === "object" &&
        result.response &&
        result.response.status === "success"
      ) {
        return {
          success: true,
          response: JSON.stringify(result),
        };
      } else if (typeof result === "object" && result.status === "success") {
        return {
          success: true,
          response: JSON.stringify(result),
        };
      } else if (typeof result === "string" && result.startsWith("success")) {
        return {
          success: true,
          response: result,
        };
      } else {
        return {
          success: false,
          error: `WhatsApp API error: ${JSON.stringify(result)}`,
        };
      }
    } catch (error) {
      console.error("❌ WhatsApp service error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown WhatsApp error",
      };
    }
  }

  async sendTestMessage(
    phone: string
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    const testData: WhatsAppMessageData = {
      customerName: "Test User",
      customerPhone: phone,
      invoiceUrl:
        "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf",
      receiptNumber: "TEST-12345",
      membershipType: "Individual Annual Plan",
      balancePaymentDate: "29th Dec 2025",
    };

    return this.sendInvoiceDocument(testData);
  }
}

export const whatsappService = new WhatsAppService();
