import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

interface UserRow {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
}

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    const whereConditions: string[] = [];
    const queryParams: Array<string | number> = [];

    if (search) {
      whereConditions.push(
        "(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')) LIKE ? OR phone LIKE ? OR email LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
      SELECT 
        id,
        first_name,
        last_name,
        phone,
        email,
        date_of_birth,
        gender,
        created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const users = await executeQuery<UserRow[]>(query, queryParams);

    const csvRows: string[] = [];
    csvRows.push(
      [
        "ID",
        "Full Name",
        "Phone",
        "Email",
        "Date of Birth",
        "Gender",
        "Joined At",
      ].join(",")
    );

    for (const user of users) {
      const fullName = `${user.first_name || ""} ${
        user.last_name || ""
      }`.trim();

      csvRows.push(
        [
          user.id,
          escapeCsvValue(fullName),
          escapeCsvValue(user.phone),
          escapeCsvValue(user.email),
          escapeCsvValue(user.date_of_birth),
          escapeCsvValue(user.gender),
          escapeCsvValue(new Date(user.created_at).toLocaleString("en-IN")),
        ].join(",")
      );
    }

    const csvContent = csvRows.join("\n");
    const filename = `users-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
