import { NextRequest, NextResponse } from "next/server";
import { smsService } from "@/lib/smsService";
import { SendOTPRequest, AuthResponse, OTPPurpose } from "@/types/auth";

// Use Edge Runtime for better performance in serverless environment
export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body: SendOTPRequest & { otp?: string } = await request.json();
    const { phone, purpose, otp } = body;

    // Validate phone number
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message:
            "Invalid phone number. Please enter a valid 10-digit mobile number.",
        },
        { status: 400 }
      );
    }

    // Validate purpose
    if (!Object.values(OTPPurpose).includes(purpose)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid purpose specified.",
        },
        { status: 400 }
      );
    }

    // Use provided OTP or generate new one if not provided
    const otpToSend = otp || Math.floor(1000 + Math.random() * 9000).toString();

    // Send OTP via SMS
    const smsResult = await smsService.sendOTP(phone, otpToSend);

    if (smsResult.success) {
      return NextResponse.json<AuthResponse>(
        {
          success: true,
          message: "OTP sent successfully to your mobile number.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Failed to send OTP. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
