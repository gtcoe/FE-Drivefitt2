import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { jwtService } from "@/lib/jwtService";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          status: false,
          error: "Token is required",
        },
        { status: 400 }
      );
    }

    // Verify JWT token
    const decoded = jwtService.verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // Verify admin still exists and is active
    const adminUsers = await executeQuery<AdminUser[]>(
      "SELECT id, username, email, name, status FROM admin_users WHERE id = ? AND status = 'active'",
      [decoded.admin_id]
    );

    if (!adminUsers || adminUsers.length === 0) {
      return NextResponse.json(
        {
          status: false,
          error: "Admin user not found or inactive",
        },
        { status: 401 }
      );
    }

    const adminUser = adminUsers[0];

    // Return success response with user data
    return NextResponse.json({
      status: true,
      data: {
        admin: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          name: adminUser.name,
          status: adminUser.status,
        },
      },
    });
  } catch (error) {
    console.error("Admin token verification error:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
