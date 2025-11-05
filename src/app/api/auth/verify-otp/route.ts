import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/lib/otpService";
import {
  VerifyOTPRequest,
  AuthResponse,
  OTPPurpose,
  MembershipStatus,
} from "@/types/auth";
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
      // First, fetch user data
      const userQuery = `
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.phone, 
          u.date_of_birth, 
          u.created_at
        FROM users u
        WHERE u.phone = ?
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
        }>
      >(userQuery, [phone]);
      const user = userResult?.[0];

      if (!user) {
        // User doesn't exist, return success without user data
        return NextResponse.json<AuthResponse>(
          {
            success: true,
            message: "OTP verified successfully. User not found.",
          },
          { status: 200 }
        );
      }

      // Fetch all memberships for the user
      const membershipQuery = `
        SELECT 
          m.id,
          m.membership_type,
          m.status,
          m.start_date,
          m.end_date,
          m.order_id,
          m.payment_id
        FROM memberships m
        WHERE m.user_id = ?
          AND m.status = 'active'
          AND m.end_date > NOW()
        ORDER BY m.created_at DESC
      `;

      const membershipResult = await executeQuery<
        Array<{
          id: number;
          membership_type: number;
          status: string; // Keep as string since DB returns 'active'
          start_date: string;
          end_date: string;
          order_id: number;
          payment_id: number;
        }>
      >(membershipQuery, [user.id]);

      // Process memberships array
      const memberships = membershipResult.map((membership) => ({
        id: membership.id,
        membershipType: membership.membership_type,
        status: MembershipStatus.ACTIVE, // Convert 'active' string to integer 1
        startDate: membership.start_date,
        expiresAt: membership.end_date,
        orderId: membership.order_id,
        paymentId: membership.payment_id,
      }));

      // Check if user has any active membership (all returned memberships are active since we filtered by status = 'active')
      const activeMemberships = memberships; // All are active
      const hasMembership = activeMemberships.length > 0;

      console.log("🔍 VERIFY-OTP DEBUG - User data:", user);
      console.log(
        "🔍 VERIFY-OTP DEBUG - Raw membership data:",
        membershipResult
      );
      console.log("🔍 VERIFY-OTP DEBUG - Processed memberships:", memberships);
      console.log(
        "🔍 VERIFY-OTP DEBUG - Active memberships:",
        activeMemberships
      );

      // For backward compatibility, use the most recent active membership as membershipInfo
      const membershipInfo =
        activeMemberships.length > 0 ? activeMemberships[0] : undefined;

      // Generate full name
      const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

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
              memberships, // New field for all memberships
            },
          },
        },
        { status: 200 }
      );
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
