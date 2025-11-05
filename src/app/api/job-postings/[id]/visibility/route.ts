import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const body = await request.json();
    const { is_visible } = body;

    if (is_visible === undefined || typeof is_visible !== "boolean") {
      return NextResponse.json(
        { error: "Invalid is_visible value. Must be a boolean" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE job_postings 
      SET is_visible = ?
      WHERE id = ?
    `;

    const result = await executeQuery<{ affectedRows: number }>(query, [
      is_visible ? 1 : 0,
      jobId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        data: {
          message: `Job posting visibility updated to ${
            is_visible ? "visible" : "hidden"
          }`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job posting visibility:", error);
    return NextResponse.json(
      {
        status: false,
        data: null,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
