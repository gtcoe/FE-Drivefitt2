import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { BlogStatus } from "@/constants/enums";

export async function GET() {
  try {
    const rows = await executeQuery<any[]>(
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
      WHERE b.status <> ? 
      ORDER BY b.id DESC`,
      [BlogStatus.DELETED]
    );
    return NextResponse.json({ status: true, data: rows });
  } catch {
    return NextResponse.json(
      { status: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      slug,
      date,
      image,
      content,
      categoryId,
      isPublished,
      is_featured,
    } = body;

    if (!title || !description || !slug || !date || !image || !content) {
      return NextResponse.json(
        { status: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const status = isPublished ? BlogStatus.PUBLISHED : BlogStatus.DRAFT;
    const category_id = categoryId ?? 0;
    const result: any = await executeQuery(
      `INSERT INTO blogs (title, description, slug, date, image_url, html, category_id, is_featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        slug,
        date,
        image,
        content,
        category_id,
        is_featured ? 1 : 0,
        status,
      ]
    );

    const insertedId = result?.insertId;
    const [row]: any[] = await executeQuery<any[]>(
      `SELECT id, title, description, slug, date, image_url AS image, category_id, is_featured, status, created_at, updated_at FROM blogs WHERE id = ?`,
      [insertedId]
    );
    return NextResponse.json({ status: true, data: row }, { status: 201 });
  } catch {
    return NextResponse.json(
      { status: false, error: "Failed to create" },
      { status: 500 }
    );
  }
}
