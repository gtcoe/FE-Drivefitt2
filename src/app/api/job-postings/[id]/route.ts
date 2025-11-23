import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { JobPosting, JobPostingUpdateData } from "@/types/database";
import { JOB_STATUS, JobStatus } from "@/constants/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const query = `
      SELECT 
        jp.id,
        jp.title,
        jp.job_type,
        jp.application_deadline,
        jp.job_description,
        jp.skills_required,
        jp.role,
        jp.qualifications,
        jp.status,
        jp.years_of_experience,
        jp.is_visible,
        jp.created_at,
        jp.updated_at,
        d.id as dept_id,
        d.name as dept_name,
        d.title as dept_title,
        d.status as dept_status,
        d.created_at as dept_created_at,
        d.updated_at as dept_updated_at,
        l.id as loc_id,
        l.full_location,
        l.city,
        l.status as loc_status,
        l.created_at as loc_created_at,
        l.updated_at as loc_updated_at
      FROM job_postings jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN location l ON jp.location_id = l.id
      WHERE jp.id = ? AND jp.status = ? AND jp.is_visible = 1
    `;

    const result = await executeQuery<any[]>(query, [jobId, JOB_STATUS.ACTIVE]);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    const row = result[0];
    const jobPosting: JobPosting = {
      id: row.id,
      title: row.title,
      department_id: row.dept_id,
      location_id: row.loc_id,
      job_type: row.job_type,
      application_deadline: row.application_deadline
        ? new Date(row.application_deadline)
        : undefined,
      job_description: row.job_description,
      skills_required: row.skills_required,
      role: row.role
        ? typeof row.role === "string"
          ? JSON.parse(row.role)
          : row.role
        : [],
      qualifications: row.qualifications
        ? typeof row.qualifications === "string"
          ? JSON.parse(row.qualifications)
          : row.qualifications
        : [],
      status: row.status as JobStatus,
      years_of_experience: row.years_of_experience,
      is_visible: Boolean(row.is_visible),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      department: row.dept_id
        ? {
            id: row.dept_id,
            name: row.dept_name,
            title: row.dept_title,
            status: row.dept_status,
            created_at: new Date(row.dept_created_at),
            updated_at: new Date(row.dept_updated_at),
          }
        : undefined,
      location: row.loc_id
        ? {
            id: row.loc_id,
            full_location: row.full_location,
            city: row.city,
            status: row.loc_status,
            created_at: new Date(row.loc_created_at),
            updated_at: new Date(row.loc_updated_at),
          }
        : undefined,
    };

    return NextResponse.json(
      {
        status: true,
        data: jobPosting,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching job posting:", error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const body: JobPostingUpdateData = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (body.title !== undefined) {
      updateFields.push("title = ?");
      updateValues.push(body.title);
    }

    if (body.department_id !== undefined) {
      updateFields.push("department_id = ?");
      updateValues.push(body.department_id);
    }

    if (body.location_id !== undefined) {
      updateFields.push("location_id = ?");
      updateValues.push(body.location_id);
    }

    if (body.job_type !== undefined) {
      updateFields.push("job_type = ?");
      updateValues.push(body.job_type);
    }

    if (body.application_deadline !== undefined) {
      updateFields.push("application_deadline = ?");
      updateValues.push(body.application_deadline || null);
    }

    if (body.job_description !== undefined) {
      updateFields.push("job_description = ?");
      updateValues.push(body.job_description);
    }

    if (body.skills_required !== undefined) {
      updateFields.push("skills_required = ?");
      updateValues.push(body.skills_required);
    }

    if (body.role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(JSON.stringify(body.role));
    }

    if (body.qualifications !== undefined) {
      updateFields.push("qualifications = ?");
      updateValues.push(JSON.stringify(body.qualifications));
    }

    if (body.status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(body.status);
    }

    if (body.years_of_experience !== undefined) {
      updateFields.push("years_of_experience = ?");
      updateValues.push(body.years_of_experience);
    }

    if (body.is_visible !== undefined) {
      updateFields.push("is_visible = ?");
      updateValues.push(body.is_visible ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updateValues.push(jobId);

    const query = `
      UPDATE job_postings 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    await executeQuery(query, updateValues);

    return NextResponse.json(
      {
        status: true,
        data: {
          message: "Job posting updated successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job posting:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    // Check if job posting exists
    const checkQuery = `SELECT id FROM job_postings WHERE id = ?`;
    const existingJob = await executeQuery<any[]>(checkQuery, [jobId]);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Soft delete: Update status to DELETED
    const updateQuery = `UPDATE job_postings SET status = ? WHERE id = ?`;
    await executeQuery(updateQuery, [JOB_STATUS.DELETED, jobId]);

    return NextResponse.json(
      {
        status: true,
        data: {
          message: "Job posting deleted successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job posting:", error);
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
