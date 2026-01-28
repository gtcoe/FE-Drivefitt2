import axios from "axios";

interface GupshupConfig {
  userid: string;
  password: string;
  baseURL: string;
  easySocialBaseURL: string;
  easySocialInvoiceTemplate: string;
}

interface SendInvoiceData {
  customerName: string;
  customerPhone: string;
  invoiceUrl: string;
}

interface SendInvoiceResponse {
  success: boolean;
  response: string;
  messageId?: string;
}

class GupshupService {
  private config: GupshupConfig;

  constructor() {
    this.config = {
      userid: process.env.GUPSHUP_USERID!,
      password: process.env.GUPSHUP_PASSWORD!,
      baseURL: "https://mediaapi.smsgupshup.com/GatewayAPI/rest",
      easySocialBaseURL: "https://api.easysocial.in",
      easySocialInvoiceTemplate:
        "/api/v1/wa-templates/send/cmkxu9v3o0878dwxpa24e2qe1/16325/3661/API",
    };
  }

  async sendOTP(
    phone: string,
    otp: string
  ): Promise<{ success: boolean; response: string }> {
    try {
      console.log("Sending OTP to", phone);

      // const params = new URLSearchParams({
      //   userid: this.config.userid,
      //   password: this.config.password,
      //   send_to: phone,
      //   v: "1.1",
      //   format: "json",
      //   msg_type: "TEXT",
      //   method: "SENDMESSAGE",
      //   msg: message,
      //   isTemplate: "true",
      // });

      // const response = await axios.get(
      //   `${this.config.baseURL}?${params.toString()}`,
      //   {
      //     timeout: 10000,
      //   }
      // );

      const response = await axios.get(
        `https://mediaapi.smsgupshup.com/GatewayAPI/rest?userid=${this.config.userid}&password=${this.config.password}&send_to=${phone}&v=1.1&format=json&msg_type=TEXT&method=SENDMESSAGE&msg=%2A${otp}%2A+is+your+verification+code.+For+your+security%2C+do+not+share+this+code.&isTemplate=true`,
          {
            timeout: 10000,
          }
      );

      const result = response.data;
      console.log("Gupshup response:", result);

      // Handle nested response format
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
          response: JSON.stringify(result),
        };
      }
    } catch (error) {
      console.error("Gupshup SMS error:", error);
      return {
        success: false,
        response: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getBalance(): Promise<number> {
    try {
      const params = new URLSearchParams({
        method: "GetBalance",
        userid: this.config.userid,
        password: this.config.password,
        v: "1.1",
        format: "json",
      });

      const response = await axios.get(
        `${this.config.baseURL}?${params.toString()}`
      );
      const result = response.data;

      // Handle nested response format for balance
      if (
        typeof result === "object" &&
        result.response &&
        result.response.status === "success"
      ) {
        return parseFloat(result.response.balance || result.balance || "0");
      } else if (typeof result === "object" && result.status === "success") {
        return parseFloat(result.balance || "0");
      } else if (typeof result === "string" && result.startsWith("success")) {
        const balance = result.split("|")[1];
        return parseFloat(balance);
      }

      return 0;
    } catch (error) {
      console.error("Gupshup balance check error:", error);
      return 0;
    }
  }

  /**
   * Send Invoice via WhatsApp using EasySocial API
   * @param data - Invoice data containing customer info and PDF URL
   * @returns Promise with success status and response details
   */
  async sendInvoice(data: SendInvoiceData): Promise<SendInvoiceResponse> {
    try {
      // Validate inputs
      if (!data.customerPhone || !/^\d{10}$/.test(data.customerPhone)) {
        return {
          success: false,
          response: "Invalid phone number format. Expected 10 digits.",
        };
      }

      if (!data.customerName || data.customerName.trim() === "") {
        return {
          success: false,
          response: "Customer name is required.",
        };
      }

      if (!data.invoiceUrl || !data.invoiceUrl.startsWith("http")) {
        return {
          success: false,
          response: "Invalid invoice URL.",
        };
      }

      console.log(
        `📱 [Gupshup] Sending WhatsApp invoice to ${data.customerPhone} for ${data.customerName}`
      );

      // Construct API URL with parameters
      // body1 = first name, header1 = invoice PDF URL (complete URL, no encoding needed)
      const firstName = data.customerName.split(" ")[0];
      const url = `${this.config.easySocialBaseURL}${this.config.easySocialInvoiceTemplate}/${data.customerPhone}?body1=${encodeURIComponent(firstName)}&header1=${data.invoiceUrl}`;

      console.log("📱 [Gupshup] Invoice API URL:", url);

      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;
      console.log("📨 [Gupshup] Invoice API response:", result);

      // Handle successful response
      if (response.status === 200) {
        return {
          success: true,
          response: JSON.stringify(result),
          messageId: result?.messageId || result?.id || undefined,
        };
      }

      // Handle error response
      return {
        success: false,
        response: JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          error: result,
        }),
      };
    } catch (error) {
      console.error("❌ [Gupshup] WhatsApp Invoice error:", error);

      return {
        success: false,
        response:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const gupshupService = new GupshupService();
