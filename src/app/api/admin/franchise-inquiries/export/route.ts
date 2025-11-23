import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { FranchiseInquiryRecord } from "@/types/formSubmissions";
import { FRANCHISE_STATUS_LABELS } from "@/constants/formSubmissionStatus";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    const query = `
      SELECT id, business_name, contact_person, email, phone, location, city, state,
             investment_capacity, experience_years, business_background, why_franchise,
             status, notes, created_at, updated_at
      FROM franchise_inquiries
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const data = await executeQuery<FranchiseInquiryRecord[]>(
      query,
      queryParams
    );

    const csvRows = [];
    csvRows.push(
      [
        "ID",
        "Business Name",
        "Contact Person",
        "Email",
        "Phone",
        "Location",
        "City",
        "State",
        "Investment Capacity",
        "Experience Years",
        "Business Background",
        "Why Franchise",
        "Status",
        "Notes",
        "Created At",
        "Updated At",
      ].join(",")
    );

    for (const row of data) {
      const values = [
        row.id,
        `"${row.business_name || ""}"`,
        `"${row.contact_person || ""}"`,
        `"${row.email || ""}"`,
        `"${row.phone || ""}"`,
        `"${row.location || ""}"`,
        `"${row.city || ""}"`,
        `"${row.state || ""}"`,
        row.investment_capacity || "",
        row.experience_years || "",
        `"${(row.business_background || "").replace(/"/g, '""')}"`,
        `"${(row.why_franchise || "").replace(/"/g, '""')}"`,
        `"${
          FRANCHISE_STATUS_LABELS[
            row.status as keyof typeof FRANCHISE_STATUS_LABELS
          ] || row.status
        }"`,
        `"${(row.notes || "").replace(/"/g, '""')}"`,
        new Date(row.created_at).toLocaleString("en-IN"),
        new Date(row.updated_at).toLocaleString("en-IN"),
      ];
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const filename = `franchise-inquiries-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting franchise inquiries:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
