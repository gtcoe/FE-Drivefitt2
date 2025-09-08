import {
  SendOTPRequest,
  VerifyOTPRequest,
  LoginWithOTPRequest,
  AuthResponse,
  OTPPurpose,
} from "@/types/auth";

const API_BASE = "/api/auth";

export const authAPI = {
  sendOTP: async (
    phone: string,
    purpose: OTPPurpose
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose } as SendOTPRequest),
    });
    return response.json();
  },

  verifyOTP: async (
    phone: string,
    otp: string,
    purpose: OTPPurpose
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, purpose } as VerifyOTPRequest),
    });
    return response.json();
  },

  loginWithOTP: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/login-with-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp } as LoginWithOTPRequest),
    });
    return response.json();
  },

  logout: async (): Promise<AuthResponse> => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
