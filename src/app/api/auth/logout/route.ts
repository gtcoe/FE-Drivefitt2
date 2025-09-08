import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/lib/jwtService";
import { userService } from "@/lib/userService";
import { AuthResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "No token provided.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid token.",
        },
        { status: 401 }
      );
    }

    // Remove session
    const tokenHash = jwtService.hashToken(token);
    await userService.logoutUser(decoded.user_id, tokenHash);

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Logged out successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in logout:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
