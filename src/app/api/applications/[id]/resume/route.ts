import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = parseInt(params.id);

    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const query = `
      SELECT resume, candidate_name
      FROM applications
      WHERE id = ?
    `;

    const result = await executeQuery<any[]>(query, [applicationId]);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const application = result[0];

    if (!application.resume) {
      return NextResponse.json(
        { error: "No resume found for this application" },
        { status: 404 }
      );
    }

    // resume is now stored as a URL/path string; redirect to it
    const resumeUrl = application.resume as string;
    return NextResponse.redirect(resumeUrl, 302);
  } catch (error) {
    console.error("Error fetching application resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
