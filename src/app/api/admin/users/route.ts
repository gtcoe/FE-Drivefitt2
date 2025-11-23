import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

interface User {
  id: number;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, 
        phone, 
        email, 
        first_name, 
        last_name, 
        date_of_birth, 
        gender, 
        created_at 
      FROM users 
      WHERE 1=1
    `;
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const queryParams: (string | number)[] = [];

    if (search) {
      const searchCondition = ` AND (CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')) LIKE ? OR phone LIKE ? OR email LIKE ?)`;
      query += searchCondition;
      countQuery += searchCondition;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const users = await executeQuery<User[]>(query, queryParams);
    const totalResults = await executeQuery<{ total: number }[]>(
      countQuery,
      queryParams.slice(0, queryParams.length - 2)
    );

    const total = totalResults[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      status: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { status: false, error: errorMessage },
      { status: 500 }
    );
  }
}
