import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { LeadGenerationRecord } from "@/types/formSubmissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const query = `
      SELECT id, name, phone, message, preferred_location,
             cricket, fitness, recovery, running, pilates, personal_training,
             physiotherapy, group_classes, status, notes, assigned_to,
             created_at, updated_at
      FROM lead_generation
      WHERE id = ?
    `;

    const result = await executeQuery<LeadGenerationRecord[]>(query, [id]);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          status: false,
          error: "Record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching lead generation record:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    if (status === undefined) {
      return NextResponse.json(
        {
          status: false,
          error: "Status is required",
        },
        { status: 400 }
      );
    }

    const statusNum = parseInt(status);
    if (isNaN(statusNum) || statusNum < 1 || statusNum > 6) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid status value (must be 1-6)",
        },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE lead_generation
      SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [statusNum, notes || null, id]);

    const selectQuery = `
      SELECT id, name, phone, message, preferred_location,
             cricket, fitness, recovery, running, pilates, personal_training,
             physiotherapy, group_classes, status, notes, assigned_to,
             created_at, updated_at
      FROM lead_generation
      WHERE id = ?
    `;

    const result = await executeQuery<LeadGenerationRecord[]>(selectQuery, [
      id,
    ]);

    return NextResponse.json({
      status: true,
      message: "Status updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating lead generation status:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          status: false,
          error: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const checkQuery = `SELECT id FROM lead_generation WHERE id = ? AND status != 6`;
    const existing = await executeQuery<{ id: number }[]>(checkQuery, [id]);

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        {
          status: false,
          error: "Record not found",
        },
        { status: 404 }
      );
    }

    const softDeleteQuery = `
      UPDATE lead_generation
      SET status = 6, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await executeQuery(softDeleteQuery, [id]);

    return NextResponse.json({
      status: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead generation record:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
