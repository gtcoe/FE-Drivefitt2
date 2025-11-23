import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { FranchiseInquiryRecord } from "@/types/formSubmissions";

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

    const whereConditions: string[] = ["status != 6"];
    const queryParams: any[] = [];

    if (search) {
      whereConditions.push(
        "(business_name LIKE ? OR contact_person LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ? OR state LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(
        searchPattern,
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
      "business_name",
      "email",
      "status",
      "city",
    ];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const countQuery = `SELECT COUNT(*) as total FROM franchise_inquiries ${whereClause}`;
    const countResult = await executeQuery<{ total: number }[]>(
      countQuery,
      queryParams
    );
    const totalItems = countResult[0]?.total || 0;

    const dataQuery = `
      SELECT id, business_name, contact_person, email, phone, location, city, state, 
             investment_capacity, experience_years, business_background, why_franchise, 
             status, notes, assigned_to, created_at, updated_at
      FROM franchise_inquiries
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = await executeQuery<FranchiseInquiryRecord[]>(
      dataQuery,
      queryParams
    );

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
    console.error("Error fetching franchise inquiries:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
