import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const salesQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_sales
      FROM orders
      WHERE status = 'paid'
        AND created_at >= ?
    `;

    const subscriptionCountQuery = `
      SELECT COUNT(*) as count
      FROM memberships
      WHERE created_at >= ?
        AND status != 'cancelled'
    `;

    const newUserLoginQuery = `
      SELECT COUNT(DISTINCT id) as count
      FROM users
      WHERE created_at >= ?
    `;

    const formSubmittedQuery = `
      SELECT 
        (SELECT COUNT(*) FROM contact_us WHERE created_at >= ? AND status != 5) +
        (SELECT COUNT(*) FROM franchise_inquiries WHERE created_at >= ? AND status != 6) +
        (SELECT COUNT(*) FROM lead_generation WHERE created_at >= ? AND status != 6) as total
    `;

    const [salesResult] = await executeQuery<{ total_sales: number }[]>(
      salesQuery,
      [startDateStr]
    );

    const [subscriptionResult] = await executeQuery<{ count: number }[]>(
      subscriptionCountQuery,
      [startDateStr]
    );

    const [userLoginResult] = await executeQuery<{ count: number }[]>(
      newUserLoginQuery,
      [startDateStr]
    );

    const [formResult] = await executeQuery<{ total: number }[]>(
      formSubmittedQuery,
      [startDateStr, startDateStr, startDateStr]
    );

    return NextResponse.json({
      status: true,
      data: {
        sales: salesResult?.total_sales || 0,
        subscriptionCount: subscriptionResult?.count || 0,
        newUserLogin: userLoginResult?.count || 0,
        formSubmitted: formResult?.total || 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { status: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
