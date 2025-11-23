import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { ContactUsRecord } from "@/types/formSubmissions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    const whereConditions: string[] = ["status != 5"];
    const queryParams: unknown[] = [];

    if (search) {
      whereConditions.push(
        "(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    if (status) {
      whereConditions.push("status = ?");
      queryParams.push(parseInt(status));
    }

    if (startDate) {
      whereConditions.push("DATE(created_at) >= ?");
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push("DATE(created_at) <= ?");
      queryParams.push(endDate);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const allowedSortColumns = [
      "created_at",
      "updated_at",
      "first_name",
      "email",
      "status",
    ];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const countQuery = `SELECT COUNT(*) as total FROM contact_us ${whereClause}`;
    const countResult = await executeQuery<{ total: number }[]>(
      countQuery,
      queryParams
    );
    const totalItems = countResult[0]?.total || 0;

    const dataQuery = `
      SELECT id, first_name, last_name, email, phone, message, status, notes, assigned_to, created_at, updated_at
      FROM contact_us
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = await executeQuery<ContactUsRecord[]>(dataQuery, queryParams);

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      status: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching contact us data:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
