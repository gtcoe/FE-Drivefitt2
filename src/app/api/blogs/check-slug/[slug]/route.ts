import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("exclude");

    let query = "SELECT COUNT(*) as count FROM blogs WHERE slug = ?";
    const queryParams: any[] = [params.slug];

    // Exclude a specific blog ID if provided (for updates)
    if (excludeId) {
      query += " AND id != ?";
      queryParams.push(excludeId);
    }

    const [result]: any[] = await executeQuery<any[]>(query, queryParams);
    const isUnique = result.count === 0;

    return NextResponse.json({
      status: true,
      data: {
        slug: params.slug,
        isUnique,
        exists: !isUnique,
      },
    });
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return NextResponse.json(
      { status: false, error: "Failed to check slug uniqueness" },
      { status: 500 }
    );
  }
}
