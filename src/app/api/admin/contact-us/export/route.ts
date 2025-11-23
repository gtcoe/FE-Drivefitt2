import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { ContactUsRecord } from "@/types/formSubmissions";
import { CONTACT_STATUS_LABELS } from "@/constants/formSubmissionStatus";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereConditions: string[] = [];
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

    const query = `
      SELECT id, first_name, last_name, email, phone, message, status, notes, created_at, updated_at
      FROM contact_us
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const data = await executeQuery<ContactUsRecord[]>(query, queryParams);

    const csvRows = [];
    csvRows.push(
      [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Message",
        "Status",
        "Notes",
        "Created At",
        "Updated At",
      ].join(",")
    );

    for (const row of data) {
      const values = [
        row.id,
        `"${row.first_name}"`,
        `"${row.last_name}"`,
        `"${row.email}"`,
        `"${row.phone || ""}"`,
        `"${(row.message || "").replace(/"/g, '""')}"`,
        `"${
          CONTACT_STATUS_LABELS[
            row.status as keyof typeof CONTACT_STATUS_LABELS
          ] || row.status
        }"`,
        `"${(row.notes || "").replace(/"/g, '""')}"`,
        new Date(row.created_at).toLocaleString("en-IN"),
        new Date(row.updated_at).toLocaleString("en-IN"),
      ];
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const filename = `contact-us-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting contact us data:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
