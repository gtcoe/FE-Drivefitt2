import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("exclude");
    const limit = parseInt(searchParams.get("limit") || "5");

    const categoryIdInt = parseInt(params.categoryId);
    const excludeIdInt = excludeId ? parseInt(excludeId) : null;

    let query = `
      SELECT 
        id, 
        title, 
        description, 
        slug, 
        date, 
        image_url AS image, 
        category_id, 
        is_featured, 
        status, 
        created_at, 
        updated_at,
        'Related Blog' AS category_heading
      FROM blogs 
      WHERE category_id = ? AND status = 1
    `;
    const queryParams: Array<number> = [categoryIdInt];

    if (excludeIdInt) {
      query += " AND id != ?";
      queryParams.push(excludeIdInt);
    }

    // Don't use parameterized LIMIT - it causes MySQL driver issues
    query += ` ORDER BY created_at DESC LIMIT ${limit}`;

    type BlogRow = {
      id: number;
      title: string;
      description: string;
      slug: string;
      date: string;
      image: string;
      category_id: number | null;
      is_featured: number;
      status: number;
      created_at: string;
      updated_at: string;
      category_heading: string | null;
    };
    const rows = await executeQuery<BlogRow[]>(query, queryParams);

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Failed to fetch related blogs",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
