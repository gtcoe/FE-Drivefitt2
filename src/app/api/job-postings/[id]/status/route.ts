import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { JobStatus } from "@/types/database";

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
    const { status } = body;

    if (status === undefined || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be one of: 0 (inactive), 1 (active), 2 (closed), 3 (deleted)",
        },
        { status: 400 }
      );
    }

    const query = `
      UPDATE job_postings 
      SET status = ?
      WHERE id = ?
    `;

    const result = await executeQuery<{ affectedRows: number }>(query, [
      status,
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
          message: "Job posting status updated successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job posting status:", error);
    return NextResponse.json(
      { 
        status: false,
        data: null,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
