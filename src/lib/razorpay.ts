import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Verify payment signature
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

// Verify webhook signature
export const verifyWebhookSignature = (
  body: string,
  signature: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
};

// New enums for the updated table structure
export enum OrderStatus {
  CREATED = "created",
  ATTEMPTED = "attempted",
  PAID = "paid",
  FAILED = "failed",
}

export enum PaymentStatus {
  CREATED = "created",
  AUTHORIZED = "authorized",
  CAPTURED = "captured",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  EMI = "emi",
}

export enum MembershipStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SUSPENDED = "suspended",
}

export enum RefundStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

// Legacy PaymentStatus enum for backward compatibility (deprecated)
export enum PaymentStatusLegacy {
  CREATED = "created",
  COMPLETED = "completed",
  FAILED = "failed",
  PENDING = "pending",
}
