import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { BlogStatus } from "@/constants/enums";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("exclude");
    const limit = parseInt(searchParams.get("limit") || "6");

    let query = `
      SELECT 
        b.id, 
        b.title, 
        b.description, 
        b.slug, 
        b.date, 
        b.image_url AS image, 
        b.category_id, 
        b.is_featured, 
        b.status, 
        b.created_at, 
        b.updated_at,
        bc.heading AS category_heading
      FROM blogs b 
      LEFT JOIN blog_category bc ON b.category_id = bc.id 
      WHERE b.status = ?
    `;

    const queryParams: any[] = [BlogStatus.PUBLISHED];

    // Exclude current category and current blog
    if (params.categoryId !== "0") {
      query +=
        " AND (b.category_id != ? OR b.category_id IS NULL OR b.category_id = 0)";
      queryParams.push(parseInt(params.categoryId));
    }

    if (excludeId) {
      query += " AND b.id != ?";
      queryParams.push(parseInt(excludeId));
    }

    // Don't use parameterized LIMIT - it causes MySQL driver issues
    query += ` ORDER BY b.created_at DESC LIMIT ${limit}`;

    const rows = await executeQuery<any[]>(query, queryParams);

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error fetching other category blogs:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch other category blogs" },
      { status: 500 }
    );
  }
}
