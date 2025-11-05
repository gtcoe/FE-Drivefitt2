import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { BlogStatus } from "@/constants/enums";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    type BlogRow = {
      id: number;
      title: string;
      description: string;
      slug: string;
      date: string;
      image: string;
      html: string;
      category_id: number | null;
      is_featured: number;
      status: number;
      created_at: string;
      updated_at: string;
      category_heading: string | null;
    };
    const [row] = await executeQuery<BlogRow[]>(
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
      WHERE b.slug = ? AND b.status = ?`,
      [params.slug, BlogStatus.PUBLISHED]
    );

    if (!row) {
      return NextResponse.json(
        { status: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: true, data: row });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
