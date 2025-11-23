import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { LeadGenerationRecord } from "@/types/formSubmissions";
import { LEAD_STATUS_LABELS } from "@/constants/formSubmissionStatus";

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
        "(name LIKE ? OR phone LIKE ? OR message LIKE ? OR preferred_location LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(
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
      SELECT id, name, phone, message, preferred_location,
             cricket, fitness, recovery, running, pilates, personal_training,
             physiotherapy, group_classes, status, notes, created_at, updated_at
      FROM lead_generation
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const data = await executeQuery<LeadGenerationRecord[]>(query, queryParams);

    const csvRows = [];
    csvRows.push(
      [
        "ID",
        "Name",
        "Phone",
        "Message",
        "Preferred Location",
        "Cricket",
        "Fitness",
        "Recovery",
        "Running",
        "Pilates",
        "Personal Training",
        "Physiotherapy",
        "Group Classes",
        "Status",
        "Notes",
        "Created At",
        "Updated At",
      ].join(",")
    );

    for (const row of data) {
      const values = [
        row.id,
        `"${row.name || ""}"`,
        `"${row.phone || ""}"`,
        `"${(row.message || "").replace(/"/g, '""')}"`,
        `"${row.preferred_location || ""}"`,
        row.cricket,
        row.fitness,
        row.recovery,
        row.running,
        row.pilates,
        row.personal_training,
        row.physiotherapy,
        row.group_classes,
        `"${
          LEAD_STATUS_LABELS[row.status as keyof typeof LEAD_STATUS_LABELS] ||
          row.status
        }"`,
        `"${(row.notes || "").replace(/"/g, '""')}"`,
        new Date(row.created_at).toLocaleString("en-IN"),
        new Date(row.updated_at).toLocaleString("en-IN"),
      ];
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const filename = `lead-generation-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting lead generation data:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
