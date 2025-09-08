// Payment related types
export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  membership_type?: string;
  payment_id?: string;
  signature?: string;
  user_details?: {
    id: number;
    name: string;
    email: string;
    contact: string;
  };
  created_at: Date;
  completed_at?: Date;
}

export interface Membership {
  id?: number;
  user_email: string;
  order_id: string;
  payment_id: string;
  membership_type?: string;
  status: "active" | "expired" | "cancelled";
  created_at: Date;
  expires_at?: Date;
}

export enum PaymentStatus {
  CREATED = "created",
  COMPLETED = "completed",
  FAILED = "failed",
  PENDING = "pending",
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  membershipType: string;
  userDetails: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  membership_type: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  userDetails: {
    name: string;
    email: string;
    contact: string;
    membership_type: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentId: string;
  orderId: string;
}

export interface WebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        status: string;
      };
    };
    order?: {
      entity: {
        id: string;
        status: string;
      };
    };
  };
}

// Membership plan types
export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

// Payment method types
export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "emi";

export interface PaymentMethodConfig {
  method: PaymentMethod;
  enabled: boolean;
  displayName: string;
  icon?: string;
}
