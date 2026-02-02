/**
 * EasySocial WhatsApp Service
 * Handles WhatsApp OTP delivery via EasySocial API
 */

interface EasySocialConfig {
  apiKey: string;
  baseURL: string;
  templatePath: string;
  timeout: number;
}

interface SendOTPResponse {
  success: boolean;
  response: string;
  messageId?: string;
}

class EasySocialService {
  private config?: EasySocialConfig;

  private getConfig(): EasySocialConfig {
    if (!this.config) {
      this.config = {
        apiKey: process.env.EASYSOCIAL_API_KEY || "",
        baseURL: "https://api.easysocial.in",
        templatePath: "/api/v1/wa-templates/send/cmkxk2e2b5mzddixph7xiajy6/16318/3661/API",
        timeout: 15000, // 15 seconds
      };

      if (!this.config.apiKey) {
        console.warn(
          "⚠️ EASYSOCIAL_API_KEY not configured. WhatsApp OTP delivery will fail."
        );
      }
    }
    return this.config;
  }

  /**
   * Send OTP via WhatsApp
   * @param phone - Mobile number (10 digits)
   * @param otp - 4-digit OTP code
   * @returns Promise with success status and response details
   */
  async sendOTP(phone: string, otp: string): Promise<SendOTPResponse> {
    try {
      const config = this.getConfig();
      
      // Validate inputs
      if (!phone || !/^\d{10}$/.test(phone)) {
        return {
          success: false,
          response: "Invalid phone number format. Expected 10 digits.",
        };
      }

      if (!otp || !/^\d{4}$/.test(otp)) {
        return {
          success: false,
          response: "Invalid OTP format. Expected 4 digits.",
        };
      }

      console.log(`📱 Sending WhatsApp OTP to ${phone}`);

      // Construct API URL with parameters
      const url = `${config.baseURL}${config.templatePath}/${phone}?body1=${otp}&button1=${otp}`;

      // Setup request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        config.timeout
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      let result: any;

      // Try to parse JSON response
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { raw: responseText };
      }

      console.log("📨 EasySocial API response:", {
        status: response.status,
        statusText: response.statusText,
        data: result,
      });

      // Handle successful response
      if (response.ok) {
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
      console.error("❌ EasySocial WhatsApp error:", error);

      // Handle timeout
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          response: "Request timeout: EasySocial API did not respond in time",
        };
      }

      // Handle other errors
      return {
        success: false,
        response: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Validate API configuration
   * @returns boolean indicating if service is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.getConfig().apiKey);
  }

  /**
   * Get service health status
   * @returns object with configuration status
   */
  getStatus() {
    const config = this.getConfig();
    return {
      configured: this.isConfigured(),
      baseURL: config.baseURL,
      timeout: config.timeout,
    };
  }
}

// Export singleton instance
export const easySocialService = new EasySocialService();
