import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { BlogStatus } from "@/constants/enums";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
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
      WHERE b.id = ?`,
      [params.id]
    );
    if (!row)
      return NextResponse.json(
        { status: false, error: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ status: true, data: row });
  } catch {
    return NextResponse.json(
      { status: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const fields: string[] = [];
    const values: any[] = [];

    const map: Record<string, string> = {
      title: "title",
      description: "description",
      slug: "slug",
      date: "date",
      image: "image_url",
      content: "html",
      categoryId: "category_id",
      is_featured: "is_featured",
      status: "status",
    };

    for (const key of Object.keys(map)) {
      if (body[key] !== undefined) {
        fields.push(`${map[key]} = ?`);
        values.push(key === "categoryId" ? body[key] ?? 0 : body[key]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { status: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(params.id);
    await executeQuery(
      `UPDATE blogs SET ${fields.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const [row]: any[] = await executeQuery<any[]>(
      `SELECT id, title, description, slug, date, image_url AS image, category_id, is_featured, status, created_at, updated_at FROM blogs WHERE id = ?`,
      [params.id]
    );
    return NextResponse.json({ status: true, data: row });
  } catch {
    return NextResponse.json(
      { status: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await executeQuery(
      `UPDATE blogs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [BlogStatus.DELETED, params.id]
    );
    return NextResponse.json({ status: true });
  } catch {
    return NextResponse.json(
      { status: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
