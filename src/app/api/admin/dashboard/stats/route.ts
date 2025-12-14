import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDateStr: string;
    let endDateStr: string;

    if (startDateParam && endDateParam) {
      startDateStr = startDateParam;
      endDateStr = endDateParam;
    } else {
      const days = parseInt(searchParams.get("days") || "30");
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      startDateStr = startDate.toISOString().split("T")[0];
      endDateStr = endDate.toISOString().split("T")[0];
    }

    const salesQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_sales
      FROM orders
      WHERE status = 'paid'
        AND DATE(created_at) >= ?
        AND DATE(created_at) <= ?
    `;

    const subscriptionCountQuery = `
      SELECT COUNT(*) as count
      FROM memberships
      WHERE DATE(created_at) >= ?
        AND DATE(created_at) <= ?
        AND status != 'cancelled'
    `;

    const newUserLoginQuery = `
      SELECT COUNT(DISTINCT id) as count
      FROM users
      WHERE DATE(created_at) >= ?
        AND DATE(created_at) <= ?
    `;

    const formSubmittedQuery = `
      SELECT 
        (SELECT COUNT(*) FROM contact_us WHERE DATE(created_at) >= ? AND DATE(created_at) <= ? AND status != 5) as contact_us_count,
        (SELECT COUNT(*) FROM franchise_inquiries WHERE DATE(created_at) >= ? AND DATE(created_at) <= ? AND status != 6) as franchise_count,
        (SELECT COUNT(*) FROM lead_generation WHERE DATE(created_at) >= ? AND DATE(created_at) <= ? AND status != 6) as leads_count
    `;

    const [salesResult] = await executeQuery<{ total_sales: number }[]>(
      salesQuery,
      [startDateStr, endDateStr]
    );

    const [subscriptionResult] = await executeQuery<{ count: number }[]>(
      subscriptionCountQuery,
      [startDateStr, endDateStr]
    );

    const [userLoginResult] = await executeQuery<{ count: number }[]>(
      newUserLoginQuery,
      [startDateStr, endDateStr]
    );

    const [formResult] = await executeQuery<{ 
      contact_us_count: number;
      franchise_count: number;
      leads_count: number;
    }[]>(
      formSubmittedQuery,
      [startDateStr, endDateStr, startDateStr, endDateStr, startDateStr, endDateStr]
    );

    return NextResponse.json({
      status: true,
      data: {
        sales: salesResult?.total_sales || 0,
        subscriptionCount: subscriptionResult?.count || 0,
        newUserLogin: userLoginResult?.count || 0,
        formSubmitted: (formResult?.contact_us_count || 0) + (formResult?.franchise_count || 0) + (formResult?.leads_count || 0),
        contactUsCount: formResult?.contact_us_count || 0,
        franchiseCount: formResult?.franchise_count || 0,
        leadsCount: formResult?.leads_count || 0,
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
