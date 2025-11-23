import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "subscription";
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    let query = "";
    let params: any[] = [];

    if (type === "subscription") {
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as value
        FROM memberships
        WHERE created_at >= ?
          AND status != 'cancelled'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      params = [startDateStr];
    } else if (type === "forms") {
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as value
        FROM (
          SELECT created_at FROM contact_us WHERE created_at >= ? AND status != 5
          UNION ALL
          SELECT created_at FROM franchise_inquiries WHERE created_at >= ? AND status != 6
          UNION ALL
          SELECT created_at FROM lead_generation WHERE created_at >= ? AND status != 6
        ) as all_forms
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      params = [startDateStr, startDateStr, startDateStr];
    }

    const results = await executeQuery<
      { date: string | Date; value: number }[]
    >(query, params);

    const dataMap = new Map<string, number>();
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split("T")[0];
      dataMap.set(dateStr, 0);
    }

    results.forEach((row) => {
      let dateStr: string;
      if (row.date instanceof Date) {
        dateStr = row.date.toISOString().split("T")[0];
      } else if (typeof row.date === "string") {
        dateStr = row.date.split(" ")[0];
      } else {
        dateStr = new Date(row.date).toISOString().split("T")[0];
      }
      dataMap.set(dateStr, row.value);
    });

    const formattedData = Array.from(dataMap.entries()).map(
      ([dateStr, value]) => {
        const date = new Date(dateStr);
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          value: value,
        };
      }
    );

    const total = results.reduce((sum, row) => sum + row.value, 0);

    return NextResponse.json({
      status: true,
      data: {
        data: formattedData,
        total: total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard graph data:", error);
    return NextResponse.json(
      { status: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
