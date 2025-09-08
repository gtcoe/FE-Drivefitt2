import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { jwtService } from "@/lib/jwtService";
import { User } from "@/types/auth";

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token required.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    // Get user data
    const userQuery = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        phone, 
        date_of_birth 
      FROM users 
      WHERE id = ?
    `;
    const userResult = await executeQuery<
      Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
      }>
    >(userQuery, [decoded.user_id]);
    const user = userResult?.[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Get active membership data with order and payment information
    const membershipQuery = `
      SELECT 
        m.id,
        m.user_id,
        m.order_id,
        m.payment_id,
        m.membership_type,
        m.status,
        m.start_date,
        m.end_date,
        o.invoice_number
      FROM memberships m
      INNER JOIN orders o ON m.order_id = o.id
      WHERE m.user_id = ? 
        AND m.status = 'active' 
        AND m.end_date > NOW()
      ORDER BY m.created_at DESC
      LIMIT 1
    `;

    const membershipResult = await executeQuery<
      Array<{
        id: number;
        user_id: number;
        order_id: number;
        payment_id: number;
        membership_type: number;
        status: string;
        start_date: string;
        end_date: string;
        invoice_number: string;
      }>
    >(membershipQuery, [decoded.user_id]);
    const membership = membershipResult?.[0];

    const fullName =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

    const userData: User = {
      id: user.id,
      name: fullName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      hasMembership: !!membership,
      membershipInfo: membership
        ? {
            id: membership.id,
            membershipType: membership.membership_type,
            status: membership.status as
              | "active"
              | "expired"
              | "cancelled"
              | "suspended",
            startDate: membership.start_date,
            expiresAt: membership.end_date,
            invoiceNumber: membership.invoice_number,
            orderId: membership.order_id,
            paymentId: membership.payment_id,
          }
        : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in get user profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
