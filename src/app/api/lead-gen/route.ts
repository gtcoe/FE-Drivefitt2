import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { sendLeadGenFormEmail } from "@/utils/brevo";

interface LeadGenFormData {
  name: string;
  phone: string;
  message?: string;
  preferredLocation?: string;
  interests: {
    cricket: number;
    fitness: number;
    recovery: number;
    running: number;
    pilates: number;
    personalTraining: number;
    physiotherapy: number;
    groupClasses: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadGenFormData = await request.json();
    try {
      const query = `
            INSERT INTO lead_generation (
              name, phone, message, preferred_location,
              cricket, fitness, recovery, running, 
              pilates, personal_training, physiotherapy, group_classes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

      const params = [
        body.name || null,
        body.phone || null,
        body.message || null,
        body.preferredLocation || null,
        body.interests.cricket || 0,
        body.interests.fitness || 0,
        body.interests.recovery || 0,
        body.interests.running || 0,
        body.interests.pilates || 0,
        body.interests.personalTraining || 0,
        body.interests.physiotherapy || 0,
        body.interests.groupClasses || 0,
      ];

      await executeQuery(query, params);
      console.log("Lead generation database record created successfully");
    } catch (dbError) {
      console.error("Lead generation database error:", dbError);
    }

    try {
      // Add timeout wrapper for email sending
      const emailPromise = sendLeadGenFormEmail(body);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timeout")), 25000)
      );

      await Promise.race([emailPromise, timeoutPromise]);
      console.log("Lead gen email sent successfully");
    } catch (emailError) {
      console.error("Error sending lead gen email notification:", emailError);
    }

    // Return success immediately
    const response = NextResponse.json(
      { success: true, message: "Lead generation form submitted successfully" },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Error processing lead generation form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
