import { executeQuery } from "./database";

class RateLimitService {
  private readonly OTP_LIMIT_PER_HOUR = parseInt(
    process.env.RATE_LIMIT_OTP_PER_HOUR || "3"
  );
  private readonly VERIFY_LIMIT_PER_HOUR = parseInt(
    process.env.RATE_LIMIT_VERIFY_PER_HOUR || "5"
  );

  async canSendOTP(phone: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count 
      FROM otp_verification 
      WHERE phone = ? 
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `;

    const result = await executeQuery<{ count: number }[]>(query, [phone]);
    const count = result?.[0]?.count || 0;

    return count < this.OTP_LIMIT_PER_HOUR;
  }

  async canVerifyOTP(phone: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count 
      FROM otp_verification 
      WHERE phone = ? 
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
      AND attempts > 0
    `;

    const result = await executeQuery<{ count: number }[]>(query, [phone]);
    const count = result?.[0]?.count || 0;

    return count < this.VERIFY_LIMIT_PER_HOUR;
  }

  async getOTPCountLastHour(phone: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count 
      FROM otp_verification 
      WHERE phone = ? 
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `;

    const result = await executeQuery<{ count: number }[]>(query, [phone]);
    return result?.[0]?.count || 0;
  }

  async getVerifyCountLastHour(phone: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count 
      FROM otp_verification 
      WHERE phone = ? 
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
      AND attempts > 0
    `;

    const result = await executeQuery<{ count: number }[]>(query, [phone]);
    return result?.[0]?.count || 0;
  }
}

export const rateLimitService = new RateLimitService();
