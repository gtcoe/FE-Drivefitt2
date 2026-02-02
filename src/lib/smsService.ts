/**
 * SMS/WhatsApp Service
 * Wrapper for EasySocial WhatsApp OTP delivery
 */
import { easySocialService } from "./easySocialService";

interface SendOTPResponse {
  success: boolean;
  response: string;
  messageId?: string;
}

class SMSService {
  /**
   * Send OTP via WhatsApp
   * @param phone - Mobile number (10 digits)
   * @param otp - 4-digit OTP code
   * @returns Promise with success status and response details
   */
  async sendOTP(
    phone: string,
    otp: string
  ): Promise<SendOTPResponse> {
    // Delegate to EasySocial WhatsApp service
    return easySocialService.sendOTP(phone, otp);
  }
}

export const smsService = new SMSService();
