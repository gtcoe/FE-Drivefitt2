import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { JobPosting, JobStatus } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isVisible = searchParams.get("is_visible");
    const departmentId = searchParams.get("department_id");
    const locationId = searchParams.get("location_id");
    const admin = searchParams.get("admin");

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // For admin access, don't filter by is_visible unless explicitly requested
    // For public access, only show visible job postings
    if (admin === "true") {
      // Admin portal: only filter by is_visible if explicitly provided
      if (isVisible !== null) {
        whereConditions.push("jp.is_visible = ?");
        queryParams.push(isVisible === "true" ? 1 : 0);
      }
    } else {
      // Public access: only show visible job postings
      if (isVisible !== null) {
        whereConditions.push("jp.is_visible = ?");
        queryParams.push(isVisible === "true" ? 1 : 0);
      } else {
        whereConditions.push("jp.is_visible = 1");
      }
    }

    if (status !== null) {
      whereConditions.push("jp.status = ?");
      queryParams.push(parseInt(status));
    }

    if (departmentId) {
      whereConditions.push("jp.department_id = ?");
      queryParams.push(parseInt(departmentId));
    }

    if (locationId) {
      whereConditions.push("jp.location_id = ?");
      queryParams.push(parseInt(locationId));
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

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
      ${whereClause}
      ORDER BY jp.created_at DESC
    `;

    const result = await executeQuery<any[]>(query, queryParams);

    const jobPostings: JobPosting[] = result.map((row) => ({
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
    }));

    return NextResponse.json(
      {
        status: true,
        data: jobPostings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching job postings:", error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      department_id,
      location_id,
      job_type,
      application_deadline,
      job_description,
      skills_required,
      role,
      qualifications,
      years_of_experience,
      is_visible = true,
    } = body;

    if (!title || !department_id || !location_id || !job_type) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, department_id, location_id, job_type",
        },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO job_postings (
        title, department_id, location_id, job_type, application_deadline,
        job_description, skills_required, role, qualifications, years_of_experience, is_visible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title,
      department_id,
      location_id,
      job_type,
      application_deadline || null,
      job_description || null,
      skills_required || null,
      JSON.stringify(role || []),
      JSON.stringify(qualifications || []),
      years_of_experience || null,
      is_visible ? 1 : 0,
    ];

    const result = await executeQuery<{ insertId: number }>(query, params);

    return NextResponse.json(
      {
        status: true,
        data: {
          id: result.insertId,
          message: "Job posting created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job posting:", error);
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
