import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/lib/otpService";
import { VerifyOTPRequest, AuthResponse, OTPPurpose } from "@/types/auth";
import { executeQuery } from "@/lib/database";
import { jwtService } from "@/lib/jwtService";

export async function POST(request: NextRequest) {
  try {
    const body: VerifyOTPRequest = await request.json();
    const { phone, otp, purpose } = body;

    // Validate inputs
    if (!phone || !otp || purpose === undefined) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Phone number, OTP, and purpose are required.",
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

    const isValid = await otpService.verifyOTP(phone, otp, purpose);

    if (isValid) {
      // Fetch user and membership data in a single JOIN query
      const userQuery = `
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.phone, 
          u.date_of_birth, 
          u.created_at,
          m.id as membership_id,
          m.membership_type,
          m.status as membership_status,
          m.start_date,
          m.end_date,
          m.order_id,
          m.payment_id
        FROM users u
        LEFT JOIN memberships m ON u.id = m.user_id AND m.status = 'active'
        WHERE u.phone = ?
        ORDER BY m.created_at DESC
        LIMIT 1
      `;

      const userResult = await executeQuery<
        Array<{
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string;
          created_at: string;
          membership_id: number | null;
          membership_type: number | null;
          membership_status: string | null;
          start_date: string | null;
          end_date: string | null;
          order_id: number | null;
          payment_id: number | null;
        }>
      >(userQuery, [phone]);
      const user = userResult?.[0];
      console.log("user with membership data:", user);

      if (user) {
        // User exists, generate JWT token and return user data with membership info
        const fullName =
          `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

        // Check if user has active membership
        const hasMembership =
          user.membership_id !== null && user.membership_status === "active";

        // Prepare membership info if exists
        const membershipInfo = hasMembership
          ? {
              id: user.membership_id!,
              membershipType: user.membership_type!,
              status: user.membership_status! as
                | "active"
                | "expired"
                | "cancelled"
                | "suspended",
              startDate: user.start_date!,
              expiresAt: user.end_date!,
              orderId: user.order_id!,
              paymentId: user.payment_id!,
            }
          : undefined;

        // Generate JWT token
        const token = jwtService.generateToken({
          user_id: user.id,
          phone: user.phone,
        });

        return NextResponse.json<AuthResponse>(
          {
            success: true,
            message: "OTP verified successfully. User found.",
            data: {
              token,
              user: {
                id: user.id,
                name: fullName,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.date_of_birth,
                hasMembership,
                membershipInfo,
              },
            },
          },
          { status: 200 }
        );
      } else {
        // User doesn't exist, return success without user data
        return NextResponse.json<AuthResponse>(
          {
            success: true,
            message: "OTP verified successfully. User not found.",
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid or expired OTP. Please try again.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
