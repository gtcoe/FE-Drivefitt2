import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { ContactUsFormData } from "@/types/database";
import { sendContactFormEmail } from "@/utils/brevo";

export async function POST(request: NextRequest) {
  try {
    const body: ContactUsFormData = await request.json();
    try {
      const query = `
            INSERT INTO contact_us (first_name, last_name, email, phone, message)
            VALUES (?, ?, ?, ?, ?)
          `;

      const params = [
        body.first_name || null,
        body.last_name || null,
        body.email || null,
        body.phone || null,
        body.message || null,
      ];

      await executeQuery(query, params);
      console.log("Contact form database record created successfully");
    } catch (dbError) {
      console.error("Contact form database error:", dbError);
    }

    try {
      // Add timeout wrapper for email sending
      const emailPromise = sendContactFormEmail(body);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timeout")), 25000)
      );

      await Promise.race([emailPromise, timeoutPromise]);
      console.log("Contact form email sent successfully");
    } catch (emailError) {
      console.error(
        "Error sending contact form email notification:",
        emailError
      );
    }

    // Return success immediately
    const response = NextResponse.json(
      { success: true, message: "Contact form submitted successfully" },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
