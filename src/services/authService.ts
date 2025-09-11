import {
  LoginResponse,
  User,
  UserRegistrationData,
  MembershipInfo,
  OTPPurpose,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from "@/types/auth";

// For Next.js API routes, we use relative URLs since frontend and backend are on the same domain
const API_BASE_URL = "";

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("Server Down, Please try again later.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Server Down, Please try again later.") {
          throw error;
        }
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          throw new Error("Server Down, Please try again later.");
        }
        throw error;
      }
      throw new Error(String(error));
    }
  }

  async sendOTP(
    phoneNumber: string,
    purpose: string = "login"
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone: phoneNumber, purpose }),
    });
  }

  async verifyOTP(
    phoneNumber: string,
    otp: string,
    purpose: OTPPurpose = OTPPurpose.LOGIN
  ): Promise<LoginResponse> {
    return this.makeRequest("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone: phoneNumber, otp, purpose }),
    });
  }

  async registerUser(userData: UserRegistrationData): Promise<LoginResponse> {
    return this.makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async checkUserMembership(userId: number): Promise<{
    hasMembership: boolean;
    membershipInfo?: MembershipInfo;
    memberships?: MembershipInfo[];
  }> {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    return this.makeRequest(`/api/user/membership/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(): Promise<User> {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await this.makeRequest<{ success: boolean; data: User }>(
      "/api/user/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.success) {
      throw new Error("Failed to fetch user profile");
    }

    return response.data;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      console.log("authService.verifyToken: Verifying token...");
      console.log("authService.verifyToken: Token length:", token?.length);
      console.log(
        "authService.verifyToken: Token preview:",
        token?.substring(0, 20) + "..."
      );

      const response = await this.makeRequest<{
        success: boolean;
        message?: string;
      }>("/api/auth/verify-token", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      console.log("authService.verifyToken: Response:", response);
      return response.success;
    } catch (error) {
      console.error("authService.verifyToken: Error:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      try {
        await this.makeRequest("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Even if logout fails on server, we should clear local data
        console.warn("Server logout failed, clearing local data");
      }
    }
  }

  // Helper method to get current user from session storage
  getCurrentUser(): User | null {
    try {
      const userData = sessionStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Helper method to get current token from session storage
  getCurrentToken(): string | null {
    return sessionStorage.getItem("auth_token");
  }

  async updateProfile(
    updateData: ProfileUpdateRequest
  ): Promise<ProfileUpdateResponse> {
    const token = this.getCurrentToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    return this.makeRequest("/api/user/profile/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  }
}

export const authService = new AuthService();
