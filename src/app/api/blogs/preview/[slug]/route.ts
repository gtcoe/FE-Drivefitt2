import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

/**
 * Preview API route - Returns blog by slug regardless of status
 * This allows admins to preview draft blogs
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const [row]: any[] = await executeQuery<any[]>(
      `SELECT 
        b.id, 
        b.title, 
        b.description, 
        b.slug, 
        b.date, 
        b.image_url AS image, 
        b.html,
        b.category_id, 
        b.is_featured, 
        b.status, 
        b.created_at, 
        b.updated_at,
        bc.heading AS category_heading
      FROM blogs b 
      LEFT JOIN blog_category bc ON b.category_id = bc.id 
      WHERE b.slug = ?`,
      [params.slug]
    );

    if (!row) {
      return NextResponse.json(
        { status: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: true, data: row });
  } catch (error) {
    console.error("Error fetching blog preview by slug:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch blog preview" },
      { status: 500 }
    );
  }
}

