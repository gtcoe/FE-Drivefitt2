import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 400 }
      );
    }

    // Check if user has active membership with order and payment information
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
    >(membershipQuery, [userId]);
    const membership = membershipResult?.[0];

    if (membership) {
      return NextResponse.json(
        {
          success: true,
          hasMembership: true,
          membershipInfo: {
            id: membership.id,
            userId: membership.user_id,
            orderId: membership.order_id,
            paymentId: membership.payment_id,
            membershipType: membership.membership_type,
            status: membership.status,
            startDate: membership.start_date,
            expiresAt: membership.end_date,
            invoiceNumber: membership.invoice_number,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          hasMembership: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in checkMembership:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
