import axios from "axios";

interface GupshupConfig {
  userid: string;
  password: string;
  baseURL: string;
}

class GupshupService {
  private config: GupshupConfig;

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
}

export const gupshupService = new GupshupService();
