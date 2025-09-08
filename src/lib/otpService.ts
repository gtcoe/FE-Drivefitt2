import crypto from "crypto";
import { executeQuery } from "./database";
import { gupshupService } from "./gupshupService";
import { OTPVerification, OTPPurpose } from "@/types/auth";

class OTPService {
  private readonly OTP_EXPIRY_MINUTES = parseInt(
    process.env.OTP_EXPIRY_MINUTES || "5"
  );
  private readonly MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "3");

  generateOTP(): string {
    return crypto.randomInt(1000, 9999).toString();
  }

  async sendOTP(phone: string, purpose: OTPPurpose): Promise<boolean> {
    const otp = this.generateOTP();
    const expiresAt = new Date(
      Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000
    );

    try {
      // Store OTP in database first (without vendor response)
      const otpId = await this.storeOTP(phone, otp, purpose, expiresAt);

      // Send via Gupshup asynchronously
      this.sendOTPAsync(phone, otp, otpId);

      // Return success immediately (optimistic response)
      console.log(`OTP request initiated for ${phone} for purpose ${purpose}`);
      return true;
    } catch (error) {
      console.error("Error in sendOTP:", error);
      return false;
    }
  }

  async generateAndStoreOTP(
    phone: string,
    purpose: OTPPurpose
  ): Promise<{ success: boolean; otpId?: number; otp?: string }> {
    const otp = this.generateOTP();
    const expiresAt = new Date(
      Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000
    );

    try {
      // Store OTP in database first (without vendor response)
      const otpId = await this.storeOTP(phone, otp, purpose, expiresAt);
      return { success: true, otpId, otp };
    } catch (error) {
      console.error("Error in generateAndStoreOTP:", error);
      return { success: false };
    }
  }

  private async sendOTPAsync(
    phone: string,
    otp: string,
    otpId: number
  ): Promise<void> {
    try {
      // Send via Gupshup
      const result = await gupshupService.sendOTP(phone, otp);

      // Update vendor response in database
      await this.updateVendorResponse(otpId, result);

      if (result.success) {
        console.log(`OTP sent successfully to ${phone}`);
      } else {
        console.error(`Failed to send OTP to ${phone}: ${result.response}`);
      }
    } catch (error) {
      console.error("Error in sendOTPAsync:", error);
      // Update vendor response with error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await this.updateVendorResponse(otpId, {
        success: false,
        response: errorMessage,
      });
    }
  }

  async verifyOTP(
    phone: string,
    otp: string,
    purpose: OTPPurpose
  ): Promise<boolean> {
    try {
      const otpRecord = await this.getOTPRecord(phone, purpose);

      if (
        !otpRecord ||
        otpRecord.is_verified ||
        otpRecord.expires_at < new Date()
      ) {
        return false;
      }

      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        return false;
      }

      // Increment attempts
      await this.incrementAttempts(phone, purpose);

      if (otpRecord.otp === otp) {
        await this.markAsVerified(phone, purpose);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error in verifyOTP:", error);
      return false;
    }
  }

  private async storeOTP(
    phone: string,
    otp: string,
    purpose: OTPPurpose,
    expiresAt: Date
  ): Promise<number> {
    const query = `
      INSERT INTO otp_verification (phone, otp, purpose, expires_at) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      otp = VALUES(otp), 
      attempts = 0, 
      is_verified = FALSE, 
      expires_at = VALUES(expires_at)
    `;

    const result = await executeQuery(query, [phone, otp, purpose, expiresAt]);
    const typedResult = result as { insertId?: number; affectedRows?: number };
    return typedResult.insertId || typedResult.affectedRows || 0;
  }

  async updateVendorResponse(
    otpId: number,
    result: { success: boolean; response: string }
  ): Promise<void> {
    const query = `
      UPDATE otp_verification 
      SET vendor_response = ? 
      WHERE id = ?
    `;

    const responseData = JSON.stringify(result);
    await executeQuery(query, [responseData, otpId]);
  }

  async getOTPRecord(
    phone: string,
    purpose: OTPPurpose
  ): Promise<OTPVerification | null> {
    const query = `
      SELECT * FROM otp_verification 
      WHERE phone = ? AND purpose = ? 
      ORDER BY created_at DESC LIMIT 1
    `;

    const result = await executeQuery<OTPVerification[]>(query, [
      phone,
      purpose,
    ]);
    return result?.[0] || null;
  }

  private async incrementAttempts(
    phone: string,
    purpose: OTPPurpose
  ): Promise<void> {
    const query = `
      UPDATE otp_verification 
      SET attempts = attempts + 1 
      WHERE phone = ? AND purpose = ? 
      ORDER BY created_at DESC LIMIT 1
    `;

    await executeQuery(query, [phone, purpose]);
  }

  private async markAsVerified(
    phone: string,
    purpose: OTPPurpose
  ): Promise<void> {
    const query = `
      UPDATE otp_verification 
      SET is_verified = TRUE, verified_at = NOW() 
      WHERE phone = ? AND purpose = ? 
      ORDER BY created_at DESC LIMIT 1
    `;

    await executeQuery(query, [phone, purpose]);
  }
}

export const otpService = new OTPService();
