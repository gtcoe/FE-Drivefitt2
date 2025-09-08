import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/lib/jwtService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    console.log("verify-token: Received token length:", token?.length);
    console.log(
      "verify-token: Token preview:",
      token?.substring(0, 20) + "..."
    );

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token is required.",
        },
        { status: 400 }
      );
    }

    // Verify the JWT token
    const decoded = jwtService.verifyToken(token);

    if (decoded) {
      return NextResponse.json(
        {
          success: true,
          message: "Token is valid.",
          data: {
            userId: decoded.user_id,
            phone: decoded.phone,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in verify-token:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
