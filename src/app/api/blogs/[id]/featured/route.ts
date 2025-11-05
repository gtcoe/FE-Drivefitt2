import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, unset all other featured blogs (only one can be featured at a time)
    await executeQuery(
      `UPDATE blogs SET is_featured = 0 WHERE is_featured = 1`
    );

    // Then set the current blog as featured
    await executeQuery(`UPDATE blogs SET is_featured = 1 WHERE id = ?`, [
      params.id,
    ]);

    // Return the updated blog
    const [row] = await executeQuery<
      Array<{
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
      }>
    >(
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
      WHERE b.id = ?`,
      [params.id]
    );

    if (!row) {
      return NextResponse.json(
        { status: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: true, data: row });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return NextResponse.json(
      { status: false, error: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
