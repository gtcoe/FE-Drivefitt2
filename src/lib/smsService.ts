interface SMSConfig {
  userid: string;
  password: string;
  baseURL: string;
}

class SMSService {
  private config: SMSConfig;

  constructor() {
    this.config = {
      userid: process.env.GUPSHUP_USERID!,
      password: process.env.GUPSHUP_PASSWORD!,
      baseURL: "https://mediaapi.smsgupshup.com/GatewayAPI/rest",
    };
  }

  async sendOTP(
    phone: string,
    otp: string
  ): Promise<{ success: boolean; response: string }> {
    try {
      console.log("Sending OTP to", phone);

      const url = `${this.config.baseURL}?userid=${this.config.userid}&password=${this.config.password}&send_to=${phone}&v=1.1&format=json&msg_type=TEXT&method=SENDMESSAGE&msg=%2A${otp}%2A+is+your+verification+code.+For+your+security%2C+do+not+share+this+code.&isTemplate=true`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
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
}

export const smsService = new SMSService();
