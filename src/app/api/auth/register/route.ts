import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/userService";
import { jwtService } from "@/lib/jwtService";
import { UserRegistrationData, AuthResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistrationData = await request.json();
    const { name, email, phone, dateOfBirth, gender } = body;

    // Validate inputs
    if (!name || !email || !phone || !gender) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "All fields are required.",
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userService.getUserByPhone(phone);
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "User with this phone number already exists.",
        },
        { status: 400 }
      );
    }

    // Check if email is already taken
    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "User with this email already exists.",
        },
        { status: 400 }
      );
    }

    // Create new user
    const userData = {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
    };

    const user = await userService.createUserWithDetails(userData);

    // Generate JWT token
    const token = jwtService.generateToken({
      user_id: user.id,
      phone: user.phone,
    });

    // Store session
    const tokenHash = jwtService.hashToken(token);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await userService.storeUserSession(user.id, tokenHash, expiresAt);

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Registration successful.",
        data: {
          token: token, // Use the actual JWT token
          user: {
            id: user.id,
            name: user.name || "User",
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            hasMembership: false,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
