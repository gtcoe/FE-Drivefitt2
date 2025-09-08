export enum OTPPurpose {
  LOGIN = "login",
  REGISTRATION = "registration",
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  hasMembership: boolean;
  membershipInfo?: {
    id: number;
    membershipType: number; // 1 = Individual Annual Plan, 2 = Family Annual Plan
    status: "active" | "expired" | "cancelled" | "suspended";
    startDate: string;
    expiresAt: string;
    invoiceNumber?: string;
    orderId: number;
    paymentId: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface SendOTPRequest {
  phone: string;
  purpose: OTPPurpose;
}

export interface LoginWithOTPRequest {
  phone: string;
  otp: string;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
}

export interface MembershipInfo {
  id: number;
  userId: number;
  orderId: number; // Now auto increment ID
  paymentId: number; // Now auto increment ID
  membershipType: number; // 1 = Individual Annual Plan, 2 = Family Annual Plan
  status: "active" | "expired" | "cancelled" | "suspended";
  startDate: string;
  expiresAt: string;
  invoiceNumber?: string;
}

export interface OTPVerification {
  id: number;
  phone: string;
  otp: string;
  purpose: OTPPurpose;
  attempts: number;
  is_verified: boolean;
  expires_at: Date;
  created_at: Date;
  verified_at?: Date;
  vendor_response?: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
  purpose: OTPPurpose;
}

// Profile editing types
export interface ProfileEditState {
  editingField: string | null;
  fieldValues: {
    name: string;
    email: string;
    dateOfBirth: string;
  };
  validation: {
    name: { isValid: boolean; message: string };
    email: { isValid: boolean; message: string };
    dateOfBirth: { isValid: boolean; message: string };
  };
  errors: {
    name: string;
    email: string;
    dateOfBirth: string;
  };
}

export interface ProfileUpdateRequest {
  field: "name" | "email" | "dateOfBirth";
  value: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export interface FieldValidation {
  isValid: boolean;
  message: string;
}
