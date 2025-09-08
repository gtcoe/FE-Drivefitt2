import { MembershipPlan } from "@/types/payment";

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

// Generate receipt ID
export const generateReceiptId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `receipt_${timestamp}_${random}`;
};

// Calculate membership expiry date
export const calculateExpiryDate = (duration: string): Date => {
  const now = new Date();

  switch (duration.toLowerCase()) {
    case "1 month":
    case "monthly":
      return new Date(now.setMonth(now.getMonth() + 1));
    case "3 months":
    case "quarterly":
      return new Date(now.setMonth(now.getMonth() + 3));
    case "6 months":
    case "half-yearly":
      return new Date(now.setMonth(now.getMonth() + 6));
    case "1 year":
    case "yearly":
    case "annual":
      return new Date(now.setFullYear(now.getFullYear() + 1));
    default:
      return new Date(now.setMonth(now.getMonth() + 1)); // Default to 1 month
  }
};

// Check if membership is active
export const isMembershipActive = (expiryDate: Date): boolean => {
  return new Date() < expiryDate;
};

// Get membership status
export const getMembershipStatus = (
  expiryDate: Date
): "active" | "expired" | "expiring_soon" => {
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    return "expired";
  } else if (daysUntilExpiry <= 7) {
    return "expiring_soon";
  } else {
    return "active";
  }
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Get membership plan by ID
export const getMembershipPlan = (
  plans: MembershipPlan[],
  planId: string
): MembershipPlan | undefined => {
  return plans.find((plan) => plan.id === planId);
};

// Validate payment amount
export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 10 lakhs
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

// Generate order notes
export const generateOrderNotes = (
  membershipType: string,
  userDetails: {
    name: string;
    email: string;
    contact: string;
  }
): Record<string, string> => {
  return {
    membership_type: membershipType,
    user_name: userDetails.name,
    user_email: userDetails.email,
    user_contact: userDetails.contact,
    created_at: new Date().toISOString(),
    source: "website",
  };
};

// Error message mapping
export const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    INVALID_AMOUNT: "Invalid payment amount",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_PHONE: "Please enter a valid phone number",
    PAYMENT_FAILED: "Payment processing failed. Please try again.",
    ORDER_CREATION_FAILED: "Unable to create order. Please try again.",
    VERIFICATION_FAILED: "Payment verification failed. Please contact support.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    USER_CANCELLED: "Payment was cancelled by user",
    INSUFFICIENT_FUNDS: "Insufficient funds in your account",
    CARD_DECLINED: "Your card was declined. Please try a different card.",
    BANK_DECLINED: "Your bank declined the transaction. Please try again.",
    UPI_ERROR: "UPI payment failed. Please try again.",
    WALLET_ERROR: "Wallet payment failed. Please try again.",
    EMI_ERROR: "EMI payment failed. Please try again.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};

// Payment method display names
export const getPaymentMethodDisplayName = (method: string): string => {
  const displayNames: Record<string, string> = {
    card: "Credit/Debit Card",
    upi: "UPI",
    netbanking: "Net Banking",
    wallet: "Digital Wallet",
    emi: "EMI",
  };

  return displayNames[method] || method;
};

// Check if payment method is supported
export const isPaymentMethodSupported = (method: string): boolean => {
  const supportedMethods = ["card", "upi", "netbanking", "wallet", "emi"];
  return supportedMethods.includes(method);
};
