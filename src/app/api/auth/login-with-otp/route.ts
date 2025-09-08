import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/lib/otpService";
import { userService } from "@/lib/userService";
import { jwtService } from "@/lib/jwtService";
import { AuthResponse, OTPPurpose } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: { phone: string; otp: string } = await request.json();
    const { phone, otp } = body;

    // Validate inputs
    if (!phone || !otp) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Phone number and OTP are required.",
        },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid phone number.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid OTP format. Please enter a 4-digit code.",
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await otpService.verifyOTP(phone, otp, OTPPurpose.LOGIN);
    if (!isValid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid or expired OTP. Please try again.",
        },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await userService.getUserByPhone(phone);

    if (!user) {
      // Create new user with phone
      user = await userService.createUser(phone);
    }

    // User is active by default (no status check needed)

    // Update phone verification and last login
    await userService.updatePhoneVerification(user.id);
    await userService.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwtService.generateToken({
      user_id: user.id,
      phone: user.phone,
    });

    // Store session
    const tokenHash = jwtService.hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await userService.storeUserSession(user.id, tokenHash, expiresAt);

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Login successful.",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            hasMembership: false,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in loginWithOTP:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
