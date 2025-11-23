import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

interface Payment {
  id: number;
  razorpay_order_id: string;
  amount: number;
  status: string;
  created_at: string;
  user_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.id, 
        o.razorpay_order_id, 
        o.amount, 
        o.status, 
        o.created_at, 
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];

    if (search) {
      const searchCondition = ` AND (CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) LIKE ? OR o.razorpay_order_id LIKE ?)`;
      query += searchCondition;
      countQuery += searchCondition;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    if (status && status !== "all") {
      query += ` AND o.status = '${status}'`;
      countQuery += ` AND o.status = '${status}'`;
      queryParams.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const payments = await executeQuery<Payment[]>(query, queryParams);
    // Adjust queryParams for count query (exclude LIMIT and OFFSET, but include status if present)
    const searchPattern = `%${search}%`;
    const countQueryParams = search ? [searchPattern, searchPattern] : [];
    if (status && status !== "all") {
      countQueryParams.push(status);
    }

    const totalResults = await executeQuery<{ total: number }[]>(
      countQuery,
      countQueryParams
    );

    const total = totalResults[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      status: true,
      data: payments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching payments:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { status: false, error: errorMessage },
      { status: 500 }
    );
  }
}
