import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { jwtService } from "@/lib/jwtService";

interface AdminUser {
  id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          status: false,
          error: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Find admin user by username
    const adminUsers = await executeQuery<AdminUser[]>(
      "SELECT * FROM admin_users WHERE username = ? AND status = 'active'",
      [username]
    );

    if (!adminUsers || adminUsers.length === 0) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const adminUser = adminUsers[0];

    // Verify password
    const isPasswordValid = jwtService.comparePassword(
      password,
      adminUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwtService.generateAdminToken({
      admin_id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      name: adminUser.name,
    });

    // Update last login timestamp (optional)
    await executeQuery(
      "UPDATE admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [adminUser.id]
    );

    // Return success response with token and user data
    return NextResponse.json({
      status: true,
      data: {
        token,
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
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
