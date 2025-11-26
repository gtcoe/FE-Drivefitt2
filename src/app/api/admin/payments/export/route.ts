import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

interface PaymentRow {
  id: number;
  razorpay_order_id: string;
  amount: number;
  status: string;
  created_at: string;
  user_name: string | null;
}

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const whereConditions: string[] = [];
    const queryParams: Array<string | number> = [];

    if (search) {
      whereConditions.push(
        "(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) LIKE ? OR o.razorpay_order_id LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    if (status && status !== "all") {
      whereConditions.push("o.status = ?");
      queryParams.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
      SELECT 
        o.id,
        o.razorpay_order_id,
        o.amount,
        o.status,
        o.created_at,
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
    `;

    const payments = await executeQuery<PaymentRow[]>(query, queryParams);

    const csvRows: string[] = [];
    csvRows.push(
      ["Order ID", "User Name", "Amount (INR)", "Status", "Created At"].join(
        ","
      )
    );

    for (const payment of payments) {
      csvRows.push(
        [
          escapeCsvValue(payment.razorpay_order_id),
          escapeCsvValue((payment.user_name || "").trim()),
          escapeCsvValue(payment.amount),
          escapeCsvValue(payment.status.toUpperCase()),
          escapeCsvValue(new Date(payment.created_at).toLocaleString("en-IN")),
        ].join(",")
      );
    }

    const csvContent = csvRows.join("\n");
    const filename = `payments-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting payments:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
