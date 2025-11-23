import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { Department, Location } from "@/types/database";

export async function GET() {
  try {
    const departmentsQuery = `
      SELECT id, name, title, status, created_at, updated_at
      FROM departments
      WHERE status = 1
      ORDER BY name ASC
    `;

    const locationsQuery = `
      SELECT id, full_location, city, status, created_at, updated_at
      FROM location
      WHERE status = 1
      ORDER BY city ASC, full_location ASC
    `;

    const [departmentsResult, locationsResult] = await Promise.all([
      executeQuery<any[]>(departmentsQuery),
      executeQuery<any[]>(locationsQuery),
    ]);

    const departments: Department[] = departmentsResult.map((row) => ({
      id: row.id,
      name: row.name,
      title: row.title,
      status: row.status,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    const locations: Location[] = locationsResult.map((row) => ({
      id: row.id,
      full_location: row.full_location,
      city: row.city,
      status: row.status,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    return NextResponse.json(
      {
        status: true,
        data: {
          departments,
          locations,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching departments and locations:", error);
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
