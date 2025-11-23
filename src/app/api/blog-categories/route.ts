import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET() {
  try {
    const rows = await executeQuery<unknown[]>(
      `SELECT id, heading, status, created_at, updated_at FROM blog_category ORDER BY id DESC`
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
    const heading: string = body.heading;
    const status: string = body.status ?? "active";
    if (!heading) {
      return NextResponse.json(
        { status: false, error: "heading is required" },
        { status: 400 }
      );
    }
    const result = await executeQuery<{ insertId: number }>(
      `INSERT INTO blog_category (heading, status) VALUES (?, ?)`,
      [heading, status]
    );
    const insertedId = result.insertId;
    const [row]: unknown[] = await executeQuery<unknown[]>(
      `SELECT id, heading, status, created_at, updated_at FROM blog_category WHERE id = ?`,
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
